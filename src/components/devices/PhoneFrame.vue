<template>
  <div class="phone-frame-wrapper select-none">
    <!-- Physical Phone Chassis -->
    <div
      class="relative mx-auto bg-[#18181b] rounded-[50px] p-[10px] shadow-[0_25px_65px_-15px_rgba(0,0,0,0.65),0_0_0_2px_#3f3f46,0_0_0_5px_#27272a] transition-all duration-300"
      :style="{ width: `${width + 20}px`, height: `${height + 20}px` }"
    >
      <!-- Hardware Buttons Simulation -->
      <div class="absolute -left-[7px] top-[120px] w-[5px] h-[35px] bg-[#3f3f46] rounded-l-md"></div>
      <div class="absolute -left-[7px] top-[170px] w-[5px] h-[55px] bg-[#3f3f46] rounded-l-md"></div>
      <div class="absolute -right-[7px] top-[140px] w-[5px] h-[65px] bg-[#3f3f46] rounded-r-md"></div>

      <!-- Inner Screen Container -->
      <div
        class="relative w-full h-full rounded-[40px] overflow-hidden flex flex-col transition-colors duration-200"
        :style="{ width: `${width}px`, backgroundColor: effectiveBgColor }"
      >
        <!-- Top Status Bar -->
        <div
          class="relative z-30 pt-3 pb-1 px-6 flex items-center justify-between text-xs font-semibold select-none backdrop-blur-md transition-colors duration-200"
          :style="{
            backgroundColor: isDarkBg ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.45)',
            color: isDarkBg ? '#e2e8f0' : '#1e293b'
          }"
        >
          <!-- Time -->
          <span class="text-[13px] tracking-tight">09:41</span>

          <!-- Camera Cutout (Dynamic Island / Micro Hole) -->
          <div
            class="absolute left-1/2 -translate-x-1/2 top-2.5 h-[26px] bg-black rounded-full px-2.5 flex items-center justify-between transition-all duration-200"
            :class="width === 375 ? 'w-[110px]' : width === 360 ? 'w-[24px] h-[24px] rounded-full' : 'w-[125px]'"
            :title="width === 375 ? 'iPhone 灵动岛 (微信标准)' : width === 360 ? '安卓中置微孔' : '大屏灵动岛'"
          >
            <div class="w-3 h-3 rounded-full bg-[#111] flex items-center justify-center border border-slate-800">
              <span class="w-1 h-1 rounded-full bg-blue-900"></span>
            </div>
            <div v-if="width !== 360" class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>

          <!-- Status Icons -->
          <div class="flex items-center gap-1.5 text-[11px]">
            <span
              class="font-bold text-[10px] px-1 py-0.5 rounded transition-colors"
              :class="isDarkBg ? 'bg-white/20 text-slate-200' : 'bg-black/10 text-slate-700'"
            >5G</span>
            <!-- WiFi -->
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.71 0 7.07 1.48 9.53 3.9L12 19.12 2.47 11.4C4.93 8.98 8.29 7.5 12 7.5z"/>
            </svg>
            <!-- Battery -->
            <div class="w-5 h-2.5 border border-current rounded-sm p-0.5 flex items-center">
              <div class="w-full h-full bg-current rounded-2xs"></div>
            </div>
          </div>
        </div>

        <!-- Scrollable Article Content -->
        <div class="flex-1 overflow-y-auto px-4 py-3 scroll-smooth">
          <slot />
        </div>

        <!-- Bottom Gesture Home Bar -->
        <div
          class="relative z-30 py-2 flex justify-center backdrop-blur-sm pointer-events-none transition-colors duration-200"
          :style="{
            backgroundColor: isDarkBg ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.35)'
          }"
        >
          <div
            class="w-32 h-1 rounded-full transition-colors"
            :class="isDarkBg ? 'bg-slate-200/70' : 'bg-slate-800/70'"
          ></div>
        </div>
      </div>
    </div>

    <!-- Device Tag below -->
    <div class="text-center mt-3 text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
      <span class="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-semibold text-2xs">
        {{ badge }}
      </span>
      <span>{{ name }} · 逻辑宽度 {{ width }}px</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    width: number
    height: number
    name: string
    badge: string
    backgroundColor?: string
  }>(),
  {
    backgroundColor: '#ffffff'
  }
)

const effectiveBgColor = computed(() => {
  return props.backgroundColor || '#ffffff'
})

const isDarkBg = computed(() => {
  return isColorDark(effectiveBgColor.value)
})

function isColorDark(hexOrRgb: string): boolean {
  if (!hexOrRgb) return false
  const color = hexOrRgb.trim().toLowerCase()
  if (color.startsWith('#')) {
    let hex = color.slice(1)
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('')
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      const yiq = (r * 299 + g * 587 + b * 114) / 1000
      return yiq < 128
    }
  } else if (color.startsWith('rgb')) {
    const match = color.match(/\(([^)]+)\)/)
    if (match) {
      const parts = match[1].split(',').map(n => parseFloat(n.trim()))
      if (parts.length >= 3) {
        const yiq = (parts[0] * 299 + parts[1] * 587 + parts[2] * 114) / 1000
        return yiq < 128
      }
    }
  }
  return false
}
</script>

<style scoped>
.phone-frame-wrapper {
  perspective: 1000px;
}
</style>
