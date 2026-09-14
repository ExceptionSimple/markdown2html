<template>
  <div class="xiaomi14-wrapper select-none">
    <!-- Physical Phone Chassis -->
    <div
      class="relative mx-auto bg-[#1e232d] rounded-[48px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6),0_0_0_2px_#3a4354,0_0_0_5px_#181c24]"
      style="width: 393px; height: 851px;"
    >
      <!-- Side buttons simulation -->
      <div class="absolute -right-[7px] top-[140px] w-[5px] h-[45px] bg-[#3a4354] rounded-r-md"></div>
      <div class="absolute -right-[7px] top-[200px] w-[5px] h-[75px] bg-[#3a4354] rounded-r-md"></div>

      <!-- Phone Screen (with physical rounded corners) -->
      <div class="relative w-full h-full bg-white dark:bg-slate-900 rounded-[38px] overflow-hidden flex flex-col">
        <!-- HyperOS Status Bar -->
        <div class="relative z-20 flex items-center justify-between px-6 pt-3 pb-1 text-xs text-slate-800 dark:text-slate-200 font-medium">
          <!-- Time -->
          <div class="font-semibold text-[13px] tracking-tight">08:16</div>

          <!-- Centered Micro-Punch Hole Camera -->
          <div class="absolute left-1/2 -translate-x-1/2 top-2.5 w-[14px] h-[14px] bg-black rounded-full ring-2 ring-slate-800/40 flex items-center justify-center">
            <span class="w-1.5 h-1.5 bg-[#0f172a] rounded-full border border-blue-900/50"></span>
          </div>

          <!-- Status Icons -->
          <div class="flex items-center gap-1.5 text-[11px]">
            <span class="font-semibold text-[10px] tracking-tighter bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">5G</span>
            <!-- Wifi Icon -->
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.71 0 7.07 1.48 9.53 3.9L12 19.12 2.47 11.4C4.93 8.98 8.29 7.5 12 7.5z"/>
            </svg>
            <!-- Battery Icon -->
            <div class="flex items-center gap-0.5">
              <span class="text-[10px] font-bold">98%</span>
              <div class="w-5 h-2.5 border border-current rounded-sm p-0.5 flex items-center">
                <div class="w-full h-full bg-current rounded-2xs"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Phone Screen Content (Scrollable Article) -->
        <div class="flex-1 overflow-y-auto px-5 py-4 scroll-smooth">
          <slot />
        </div>

        <!-- Bottom Gesture Pill Bar -->
        <div class="relative z-20 py-2 flex justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm pointer-events-none">
          <div class="w-32 h-1 bg-slate-400/80 dark:bg-slate-600 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- Device Tag below -->
    <div class="text-center mt-3 text-xs text-slate-400 font-mono">
      Xiaomi 14 · 393 × 851 (20:9 直屏)
    </div>
  </div>
</template>

<script setup lang="ts">
// Xiaomi 14 flagship phone simulator
</script>

<style scoped>
.xiaomi14-wrapper {
  perspective: 1000px;
}
</style>
