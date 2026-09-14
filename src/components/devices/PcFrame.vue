<template>
  <div
    class="pc-container transition-all duration-300 mx-auto"
    :style="{ maxWidth: `${maxWidth}px`, width: '100%' }"
  >
    <div
      class="rounded-xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-colors duration-200"
      :style="{ backgroundColor: backgroundColor || '#ffffff' }"
    >
      <!-- Browser-like header bar for PC view -->
      <div class="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/60 select-none">
        <div class="flex items-center space-x-2">
          <span class="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
          <span class="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
          <span class="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
        </div>
        <div class="px-6 py-1 bg-white dark:bg-slate-950 rounded-md text-xs text-slate-500 font-mono flex items-center gap-2 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>desktop-reader://preview</span>
        </div>
        <div class="text-xs text-slate-400 font-medium">
          宽屏模式 · {{ maxWidth }}px
        </div>
      </div>

      <!-- Content Area -->
      <div
        class="p-8 sm:p-10 min-h-[600px] overflow-y-auto transition-colors duration-200"
        :style="{ backgroundColor: backgroundColor || '#ffffff' }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  maxWidth?: number
  backgroundColor?: string
}>()
</script>

<style scoped>
.pc-container {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>
