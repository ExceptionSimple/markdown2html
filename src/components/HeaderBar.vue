<template>
  <header class="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between select-none z-40 relative">
    <!-- Left: Brand & Theme Selector & Customizer Drawer Toggle -->
    <div class="flex items-center gap-3">
      <!-- App Brand -->
      <div class="flex items-center gap-2 pr-2 border-r border-slate-800">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-950">
          <FileCode class="w-4 h-4 text-slate-950 font-bold" />
        </div>
        <div class="hidden sm:block">
          <span class="text-xs font-black tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Markdown2HTML
          </span>
          <span class="block text-[10px] text-slate-400 leading-none">全平台富文本排版</span>
        </div>
      </div>

      <!-- Theme Customizer Toggle Button (Left Drawer) -->
      <button
        @click="$emit('openThemeDrawer')"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors font-medium cursor-pointer"
        title="打开左侧主题细化定制面板"
      >
        <Sliders class="w-3.5 h-3.5 text-emerald-400" />
        <span>精细化定制</span>
      </button>

      <!-- Preset Theme Selector -->
      <div class="flex items-center gap-1.5">
        <Palette class="w-4 h-4 text-slate-400 hidden md:block" />
        <select
          :value="themeStore.currentThemeId"
          @change="onThemeChange"
          class="bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium"
        >
          <option
            v-for="item in themeStore.presetThemes"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Center: Viewport Switcher & Zoom Scale -->
    <div class="flex items-center gap-2">
      <!-- Device Switcher Tabs: 375px / 360px / 414px / PC -->
      <div class="flex items-center bg-slate-800/90 p-0.5 rounded-lg border border-slate-700/80">
        <button
          v-for="dev in viewportStore.deviceOptions"
          :key="dev.id"
          @click="viewportStore.setDevice(dev.id)"
          class="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all"
          :class="viewportStore.currentDevice === dev.id ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'"
          :title="dev.description"
        >
          <span>{{ dev.shortName }}</span>
        </button>
      </div>

      <!-- Zoom Scale Dropdown -->
      <div class="flex items-center bg-slate-800 rounded-lg border border-slate-700 px-2 py-1 text-xs">
        <ZoomIn class="w-3.5 h-3.5 text-slate-400 mr-1 hidden md:block" />
        <select
          :value="viewportStore.scale"
          @change="(e) => viewportStore.setScale(parseFloat((e.target as HTMLSelectElement).value))"
          class="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
        >
          <option :value="1">100%</option>
          <option :value="0.9">90%</option>
          <option :value="0.85">85%</option>
          <option :value="0.8">80%</option>
          <option :value="0.75">75%</option>
          <option :value="0.6">60%</option>
          <option :value="0.5">50%</option>
        </select>
      </div>
    </div>

    <!-- Right: Mobile Preview, Export & One-Click Copy -->
    <div class="flex items-center gap-2">
      <!-- Mobile Scan QR Code Preview Button -->
      <button
        @click="$emit('openMobileModal')"
        class="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors font-medium cursor-pointer"
        title="真机预览（扫码在手机上只读查看）"
      >
        <QrCode class="w-3.5 h-3.5 text-emerald-400" />
        <span class="hidden md:inline">真机预览</span>
      </button>

      <!-- Export Menu -->
      <div class="relative" ref="exportMenuRef">
        <button
          @click="isExportMenuOpen = !isExportMenuOpen"
          class="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors cursor-pointer"
          title="导出格式"
        >
          <Upload class="w-3.5 h-3.5" />
          <span class="hidden md:inline">导出</span>
          <ChevronDown class="w-3 h-3 text-slate-400" />
        </button>

        <div
          v-if="isExportMenuOpen"
          class="absolute right-0 mt-1.5 w-44 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 text-xs text-slate-200 z-50"
        >
          <button
            @click="exportHtml"
            class="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileCode class="w-4 h-4 text-emerald-400" />
            <span>导出独立 HTML</span>
          </button>
          <button
            @click="exportMarkdown"
            class="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileText class="w-4 h-4 text-sky-400" />
            <span>导出 Markdown</span>
          </button>
          <div class="border-t border-slate-700 my-1"></div>
          <button
            @click="copyHtmlSource"
            class="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center gap-2 transition-colors text-slate-300 cursor-pointer"
          >
            <Code class="w-4 h-4 text-amber-400" />
            <span>复制内联 HTML 源码</span>
          </button>
        </div>
      </div>

      <!-- One-Click Copy Rich Text (Primary Action) -->
      <button
        @click="$emit('copyRichText')"
        :disabled="isCopying"
        class="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-emerald-950/60 transition-all cursor-pointer disabled:opacity-50"
        title="一键将排版编译为 Inline CSS 富文本并写入剪贴板，可直接无损粘贴到微信公众号、知乎等平台"
      >
        <Copy class="w-4 h-4" />
        <span>一键复制富文本</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  FileCode,
  Palette,
  Sliders,
  ZoomIn,
  Upload,
  ChevronDown,
  Copy,
  FileText,
  Code,
  QrCode
} from '@lucide/vue'
import { useThemeStore } from '../stores/themeStore'
import { useViewportStore } from '../stores/viewportStore'
import { useEditorStore } from '../stores/editorStore'
import { inlineHtmlWithTheme, generateStandaloneHtml } from '../engine/inliner'
import { downloadFile } from '../utils/clipboard'

const props = defineProps<{
  renderedRawHtml: string
  isCopying?: boolean
}>()

const emit = defineEmits<{
  (e: 'openThemeDrawer'): void
  (e: 'openMobileModal'): void
  (e: 'copyRichText'): void
  (e: 'toast', msg: string, type?: 'success' | 'error'): void
}>()

const themeStore = useThemeStore()
const viewportStore = useViewportStore()
const editorStore = useEditorStore()

const isExportMenuOpen = ref(false)
const exportMenuRef = ref<HTMLElement | null>(null)

function onThemeChange(e: Event) {
  const id = (e.target as HTMLSelectElement).value
  themeStore.selectPreset(id)
  emit('toast', `已应用主题：${themeStore.activeTheme.name}`, 'success')
}

function exportHtml() {
  isExportMenuOpen.value = false
  const standalone = generateStandaloneHtml(
    props.renderedRawHtml,
    themeStore.activeTheme,
    'Markdown2HTML 排版文档'
  )
  downloadFile(standalone, `markdown-export-${Date.now()}.html`, 'text/html')
  emit('toast', '独立 HTML 文档已导出', 'success')
}

function exportMarkdown() {
  isExportMenuOpen.value = false
  downloadFile(editorStore.markdown, `document-${Date.now()}.md`, 'text/markdown')
  emit('toast', 'Markdown 文件已导出', 'success')
}

async function copyHtmlSource() {
  isExportMenuOpen.value = false
  const inlined = inlineHtmlWithTheme(props.renderedRawHtml, themeStore.activeTheme)
  try {
    await navigator.clipboard.writeText(inlined)
    emit('toast', '已成功将带内联样式的 HTML 源码复制到剪贴板', 'success')
  } catch (err) {
    emit('toast', '源码复制失败', 'error')
  }
}

function handleClickOutside(e: MouseEvent) {
  if (exportMenuRef.value && !exportMenuRef.value.contains(e.target as Node)) {
    isExportMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>
