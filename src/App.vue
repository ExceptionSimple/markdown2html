<template>
  <!-- Mobile Preview Mode (100% Pure Read-Only, No Edit/Copy controls) -->
  <MobilePreviewView v-if="isMobileMode" />

  <!-- Desktop Full Editor & Simulator Workspace -->
  <div v-else class="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
    <!-- Top Global Header -->
    <HeaderBar
      :renderedRawHtml="renderedHtml"
      :isCopying="isCopying"
      @openThemeDrawer="isThemeDrawerOpen = true"
      @openMobileModal="isMobileModalOpen = true"
      @copyRichText="handleCopyRichText"
      @toast="triggerToast"
    />

    <!-- Main Workspace: Split Editor & Preview -->
    <main class="flex-1 flex flex-row overflow-hidden relative">
      <!-- Left: Editor Pane -->
      <div
        class="h-full flex-shrink-0 transition-all duration-75 relative overflow-hidden"
        :style="{ width: `${editorWidthPercent}%` }"
      >
        <EditorPane />

        <!-- Gaussian Blur Mask for Left: Editor Pane when Theme Settings Drawer is open -->
        <Transition name="editor-mask-fade">
          <div
            v-if="isThemeDrawerOpen"
            class="editor-pane-mask absolute inset-0 z-40 bg-slate-950/45 backdrop-blur-md cursor-pointer transition-all duration-300"
            @click="isThemeDrawerOpen = false"
            title="点击关闭样式设置面板"
          ></div>
        </Transition>
      </div>

      <!-- Split Divider / Drag Handle -->
      <div
        @mousedown="startResize"
        class="w-1.5 h-full bg-slate-800 hover:bg-emerald-500 cursor-col-resize flex-shrink-0 transition-colors duration-150 relative z-30 group"
      >
        <div class="absolute inset-y-0 -left-1 -right-1"></div>
      </div>

      <!-- Right: Preview Pane -->
      <div
        class="h-full flex-1 overflow-hidden"
      >
        <PreviewPane :renderedHtml="renderedHtml" />
      </div>
    </main>

    <!-- Theme Customization Drawer -->
    <ThemeDrawer
      :isOpen="isThemeDrawerOpen"
      @close="isThemeDrawerOpen = false"
      @toast="triggerToast"
    />

    <!-- Mobile QR Code Preview Modal -->
    <MobilePreviewModal
      :isOpen="isMobileModalOpen"
      @close="isMobileModalOpen = false"
      @toast="triggerToast"
    />

    <!-- Toast Notification -->
    <Toast ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import HeaderBar from './components/HeaderBar.vue'
import EditorPane from './components/EditorPane.vue'
import PreviewPane from './components/PreviewPane.vue'
import ThemeDrawer from './components/settings/ThemeDrawer.vue'
import MobilePreviewModal from './components/MobilePreviewModal.vue'
import MobilePreviewView from './views/MobilePreviewView.vue'
import Toast from './components/Toast.vue'
import { useEditorStore } from './stores/editorStore'
import { useThemeStore } from './stores/themeStore'
import { renderMarkdown } from './engine/markdown'
import { inlineHtmlWithTheme } from './engine/inliner'
import { generateThemeCss } from './engine/cssGenerator'
import { copyRichText } from './utils/clipboard'

// Check if running in mobile read-only preview mode (?mode=mobile)
const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
const isMobileMode = ref(urlParams ? urlParams.get('mode') === 'mobile' || window.location.hash.includes('mode=mobile') : false)

const editorStore = useEditorStore()
const themeStore = useThemeStore()

const rawRenderedHtml = ref('')
const renderedHtml = ref('')
const isCopying = ref(false)
const isThemeDrawerOpen = ref(false)
const isMobileModalOpen = ref(false)
const toastRef = ref<InstanceType<typeof Toast> | null>(null)

// Split pane resizer (default 45% editor, 55% preview)
const editorWidthPercent = ref(45)
let isDragging = false

function startResize(e: MouseEvent) {
  isDragging = true
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', stopResize)
  e.preventDefault()
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging) return
  const totalWidth = window.innerWidth
  const newPercent = (e.clientX / totalWidth) * 100
  if (newPercent >= 20 && newPercent <= 80) {
    editorWidthPercent.value = newPercent
  }
}

function stopResize() {
  isDragging = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', stopResize)
}

function triggerToast(msg: string, type: 'success' | 'error' = 'success') {
  toastRef.value?.show(msg, type)
}

// Structural fingerprint of active theme options that actually require Markdown AST re-parsing.
const structuralThemeFingerprint = computed(() => {
  const t = themeStore.activeTheme
  return JSON.stringify({
    id: t.id,
    shikiTheme: t.code?.block?.shikiTheme,
    showLineNumbers: t.code?.block?.showLineNumbers,
    lineNumberColor: t.code?.block?.lineNumberColor,
    showMacDots: t.code?.block?.showMacDots,
    macDotsStyle: t.code?.block?.macDotsStyle,
    outputBlock: t.outputBlock,
    bodyNumbering: t.headings?.bodyNumbering,
    iconPrefix: t.headings?.iconPrefix,
    tocEnabled: t.toc?.enabled,
    tocAutoInsert: t.toc?.autoInsert,
    tocPrefixStyle: t.toc?.prefixStyle,
    tocMinLevel: t.toc?.minLevel,
    tocMaxLevel: t.toc?.maxLevel,
    toc: t.toc,
    alerts: t.alerts,
    blockquoteIcon: t.blockquote?.icon,
    divider: t.divider,
    image: t.image,
    footnotes: t.footnotes
  })
})

// Markdown parser debounce pipeline with race-condition prevention
let parseTimer: any = null
let renderSeq = 0

async function updateHtml() {
  const currentSeq = ++renderSeq
  editorStore.isRendering = true
  try {
    const raw = await renderMarkdown(editorStore.markdown, themeStore.activeTheme)
    if (currentSeq === renderSeq) {
      rawRenderedHtml.value = raw
      // Directly inline all styles into every element's style attribute for perfect copying
      renderedHtml.value = inlineHtmlWithTheme(raw, themeStore.activeTheme)
    }
  } catch (err) {
    console.error('Failed to render markdown:', err)
  } finally {
    if (currentSeq === renderSeq) {
      editorStore.isRendering = false
    }
  }
}

function triggerRenderDebounced() {
  if (parseTimer) clearTimeout(parseTimer)
  parseTimer = setTimeout(() => {
    updateHtml()
  }, 120)
}

// Watch markdown changes
watch(
  () => editorStore.markdown,
  () => {
    triggerRenderDebounced()
  }
)

// Watch structural theme options for markdown re-parsing
watch(
  structuralThemeFingerprint,
  () => {
    triggerRenderDebounced()
  }
)

// Watch all theme changes to re-inline styles directly into style attributes in real-time
let themeInlineTimer: any = null
watch(
  () => themeStore.activeTheme,
  () => {
    if (themeInlineTimer) clearTimeout(themeInlineTimer)
    themeInlineTimer = setTimeout(() => {
      if (rawRenderedHtml.value) {
        renderedHtml.value = inlineHtmlWithTheme(rawRenderedHtml.value, themeStore.activeTheme)
      }
      syncToMobilePreview()
    }, 40)
  },
  { deep: true }
)

// Copy Rich Text
async function handleCopyRichText() {
  if (isCopying.value) return
  isCopying.value = true

  try {
    // Ensure HTML has all styles inlined into style attributes
    const inlinedHtml = renderedHtml.value.includes('style=')
      ? renderedHtml.value
      : inlineHtmlWithTheme(rawRenderedHtml.value || renderedHtml.value, themeStore.activeTheme)

    // Write both text/html and text/plain into system clipboard
    const success = await copyRichText(inlinedHtml, editorStore.markdown)

    if (success) {
      triggerToast('富文本已成功复制！所有样式已直接写入 style 属性，可直接无损粘贴到微信公众号、知乎等平台', 'success')
    } else {
      triggerToast('复制失败，请尝试使用“导出”菜单中的复制 HTML 源码', 'error')
    }
  } catch (err: any) {
    console.error('Copy rich text error:', err)
    triggerToast(`复制失败: ${err.message || err}`, 'error')
  } finally {
    isCopying.value = false
  }
}

// Background sync to mobile preview server (lightweight CSS + HTML, zero synchronous Juice delay)
let syncPushTimer: any = null
function syncToMobilePreview() {
  if (isMobileMode.value) return
  if (syncPushTimer) clearTimeout(syncPushTimer)
  syncPushTimer = setTimeout(async () => {
    try {
      if (!renderedHtml.value) return
      const dynamicCss = generateThemeCss(themeStore.activeTheme, '.m2h-article-body')
      await fetch('/api/preview-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: renderedHtml.value,
          css: dynamicCss,
          title: themeStore.activeTheme.name || 'Markdown2HTML 排版',
          theme: themeStore.activeTheme.id,
          backgroundColor: themeStore.activeTheme.typography.backgroundColor || '#ffffff',
          updatedAt: Date.now()
        })
      })
    } catch {
      // ignore network errors for silent background sync
    }
  }, 250)
}

watch(
  () => renderedHtml.value,
  () => {
    syncToMobilePreview()
  }
)

onMounted(() => {
  if (!isMobileMode.value) {
    updateHtml()
  }
})
</script>

<style scoped>
.editor-pane-mask {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.editor-mask-fade-enter-active,
.editor-mask-fade-leave-active {
  transition: opacity 0.25s ease;
}

.editor-mask-fade-enter-from,
.editor-mask-fade-leave-to {
  opacity: 0;
}
</style>
