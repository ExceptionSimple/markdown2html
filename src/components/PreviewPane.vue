<template>
  <div class="h-full w-full overflow-y-auto bg-slate-950 flex flex-col items-center p-6 relative select-text">
    <!-- Dynamic Injected Theme CSS for live preview -->
    <component :is="'style'" type="text/css">
      {{ previewCss }}
    </component>

    <!-- Canvas Wrapper with Scale Transform -->
    <div
      class="transition-transform duration-200 ease-out origin-top my-auto py-4"
      :style="{ transform: `scale(${viewportStore.scale})` }"
    >
      <!-- PC Wide Screen Mode -->
      <PcFrame
        v-if="viewportStore.currentDevice === 'pc'"
        :maxWidth="viewportStore.pcWidth"
        :backgroundColor="themeStore.activeTheme.typography.backgroundColor"
      >
        <div id="m2h-preview-container" @copy="handleContainerCopy" v-html="displayHtml"></div>
      </PcFrame>

      <!-- Mobile Simulation Mode (375px / 360px / 414px) -->
      <PhoneFrame
        v-else
        :width="viewportStore.currentConfig.width"
        :height="viewportStore.currentConfig.height"
        :name="viewportStore.currentConfig.name"
        :badge="viewportStore.currentConfig.badge"
        :backgroundColor="themeStore.activeTheme.typography.backgroundColor"
      >
        <div id="m2h-preview-container" @copy="handleContainerCopy" v-html="displayHtml"></div>
      </PhoneFrame>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useViewportStore } from '../stores/viewportStore'
import { useThemeStore } from '../stores/themeStore'
import { generateThemeCss } from '../engine/cssGenerator'
import PcFrame from './devices/PcFrame.vue'
import PhoneFrame from './devices/PhoneFrame.vue'

const props = defineProps<{
  renderedHtml: string
}>()

const viewportStore = useViewportStore()
const themeStore = useThemeStore()

// Ensure HTML has outer .m2h-content container without duplicate nesting
const displayHtml = computed(() => {
  if (!props.renderedHtml) return ''
  if (props.renderedHtml.trim().startsWith('<section class="m2h-content"')) {
    return props.renderedHtml
  }
  return `<section class="m2h-content">${props.renderedHtml}</section>`
})

// Dynamically generate preview CSS targeting #m2h-preview-container .m2h-content
const previewCss = computed(() => {
  return generateThemeCss(themeStore.activeTheme, '#m2h-preview-container .m2h-content')
})

function handleContainerCopy(e: ClipboardEvent) {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return

  // Because renderedHtml already has all styles written directly into every element's style attribute,
  // extracting the selected DOM fragment directly preserves 100% of inline styles for WeChat & Zhihu.
  const container = document.createElement('div')
  for (let i = 0; i < selection.rangeCount; i++) {
    container.appendChild(selection.getRangeAt(i).cloneContents())
  }
  const html = container.innerHTML
  const text = selection.toString()

  if (e.clipboardData && html) {
    e.preventDefault()
    e.clipboardData.setData('text/html', html)
    e.clipboardData.setData('text/plain', text)
  }
}
</script>

<style scoped>
/* Canvas subtle grid pattern */
.bg-slate-950 {
  background-image: radial-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
}
</style>
