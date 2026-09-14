<template>
  <div
    class="mobile-preview-container w-full min-h-screen flex flex-col items-center select-text transition-colors duration-200"
    :style="{ backgroundColor: currentBgColor }"
  >
    <!-- Article Reading Area (100% Read-Only, Natural Native Scrolling) -->
    <main
      class="w-full max-w-lg min-h-screen px-4 py-6 pb-20 shadow-sm transition-colors duration-200"
      :style="{ backgroundColor: currentBgColor }"
    >
    <!-- Dynamic Injected Theme CSS from PC for zero-overhead live preview -->
    <component :is="'style'" v-if="currentCss" type="text/css">
      {{ currentCss }}
    </component>

    <!-- Dynamic Rendered HTML from PC -->
    <article
      v-if="renderedHtml"
      class="m2h-article-body break-words"
      v-html="renderedHtml"
    ></article>

      <!-- Empty / Initial Loading State -->
      <div
        v-else
        class="py-24 flex flex-col items-center justify-center text-slate-400 gap-3 text-sm select-none"
      >
        <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="font-medium text-slate-400">正在与电脑端排版建立连接...</p>
        <p class="text-xs text-slate-400">请保持手机与电脑在同一 Wi-Fi 局域网下</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const renderedHtml = ref<string>('')
const currentCss = ref<string>('')
const currentBgColor = ref<string>('#ffffff')
let lastUpdatedAt = 0
let pollTimer: ReturnType<typeof setInterval> | null = null

function applyBodyBackground(bgColor: string) {
  if (!bgColor) return
  currentBgColor.value = bgColor
  if (typeof document !== 'undefined') {
    document.body.style.setProperty('background-color', bgColor, 'important')
    document.documentElement.style.setProperty('background-color', bgColor, 'important')

    // Update or create <meta name="theme-color"> for iOS Safari & Android Chrome browser header
    let metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta')
      metaThemeColor.setAttribute('name', 'theme-color')
      document.head.appendChild(metaThemeColor)
    }
    metaThemeColor.setAttribute('content', bgColor)
  }
}

async function fetchLatestContent() {
  try {
    const res = await fetch('/api/preview-sync', {
      headers: { 'Cache-Control': 'no-cache' }
    })
    if (res.ok) {
      const data = await res.json()
      if (data && data.updatedAt && data.updatedAt !== lastUpdatedAt) {
        lastUpdatedAt = data.updatedAt
        renderedHtml.value = data.html || ''
        currentCss.value = data.css || ''
        if (data.title) {
          document.title = `${data.title} - 真机预览`
        }
        const bgFromHtml = data.html?.match(/background-color:\s*([^;]+)/i)?.[1]?.trim()
        const effectiveBg = data.backgroundColor || bgFromHtml || '#ffffff'
        applyBodyBackground(effectiveBg)
      }
    }
  } catch (err) {
    // Silent fail on network blips
    console.debug('Preview sync poll error:', err)
  }
}

onMounted(() => {
  // Ensure native scrolling on iOS Safari and Android Chrome
  document.documentElement.style.overflowY = 'auto'
  document.documentElement.style.height = 'auto'
  document.body.style.overflowY = 'auto'
  document.body.style.height = 'auto'
  document.body.style.userSelect = 'auto'
  document.body.classList.remove('overflow-hidden', 'select-none')

  applyBodyBackground(currentBgColor.value)

  // Initial fetch
  fetchLatestContent()
  // Background live sync every 1.5 seconds
  pollTimer = setInterval(fetchLatestContent, 1500)
})

onUnmounted(() => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
  if (typeof document !== 'undefined') {
    document.body.style.removeProperty('background-color')
    document.documentElement.style.removeProperty('background-color')
  }
})
</script>

<style>
/* Ensure mobile browser allows touch scrolling freely */
html, body {
  margin: 0;
  padding: 0;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  overflow-y: auto !important;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch !important;
  touch-action: pan-y !important;
  height: auto !important;
  min-height: 100% !important;
}

#app {
  height: auto !important;
  min-height: 100% !important;
  overflow: visible !important;
}

.mobile-preview-container {
  overflow-y: visible !important;
  touch-action: pan-y !important;
}

.m2h-article-body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  line-height: 1.75;
  overflow-y: visible !important;
}

/* Ensure images fit mobile screen properly */
.m2h-article-body img {
  max-width: 100% !important;
  height: auto !important;
}

/* Ensure tables scroll horizontally on small screens without blocking vertical page scroll */
.m2h-article-body table {
  max-width: 100%;
}
</style>
