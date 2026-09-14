<template>
  <div class="iphone-wrapper select-none">
    <!-- Physical Phone Chassis -->
    <div
      class="relative mx-auto bg-[#1c1c1e] rounded-[55px] p-[11px] shadow-[0_25px_65px_-15px_rgba(0,0,0,0.65),0_0_0_2px_#38383a,0_0_0_6px_#242426]"
      style="width: 393px; height: 852px;"
    >
      <!-- Action Button / Volume Buttons -->
      <div class="absolute -left-[8px] top-[115px] w-[5px] h-[26px] bg-[#38383a] rounded-l-md"></div>
      <div class="absolute -left-[8px] top-[160px] w-[5px] h-[50px] bg-[#38383a] rounded-l-md"></div>
      <div class="absolute -left-[8px] top-[220px] w-[5px] h-[50px] bg-[#38383a] rounded-l-md"></div>
      <!-- Power Button -->
      <div class="absolute -right-[8px] top-[170px] w-[5px] h-[75px] bg-[#38383a] rounded-r-md"></div>

      <!-- Phone Screen -->
      <div class="relative w-full h-full bg-white dark:bg-slate-900 rounded-[44px] overflow-hidden flex flex-col">
        <!-- iOS Status Bar & Dynamic Island -->
        <div class="relative z-30 pt-3 pb-2 px-7 flex items-center justify-between text-xs text-slate-900 dark:text-slate-100 font-semibold select-none">
          <!-- Time -->
          <span class="text-[13px] tracking-tight">9:41</span>

          <!-- Dynamic Island (灵动岛) -->
          <div
            class="dynamic-island absolute left-1/2 -translate-x-1/2 top-2.5 h-[29px] bg-black rounded-full px-3 flex items-center justify-between transition-all duration-300 hover:w-[190px] w-[118px] cursor-pointer shadow-md"
            title="iPhone 灵动岛 (Dynamic Island)"
          >
            <!-- Camera lens -->
            <div class="w-3 h-3 rounded-full bg-[#111] flex items-center justify-center border border-slate-800/80">
              <span class="w-1 h-1 rounded-full bg-blue-950"></span>
            </div>
            <!-- Dynamic Island active indicator / sound wave icon -->
            <div class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
          </div>

          <!-- Status Right Icons -->
          <div class="flex items-center gap-1.5">
            <!-- Cellular signal -->
            <div class="flex items-end gap-[1.5px] h-3">
              <span class="w-[2.5px] h-1 bg-current rounded-2xs"></span>
              <span class="w-[2.5px] h-1.5 bg-current rounded-2xs"></span>
              <span class="w-[2.5px] h-2 bg-current rounded-2xs"></span>
              <span class="w-[2.5px] h-3 bg-current rounded-2xs"></span>
            </div>
            <!-- WiFi icon -->
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.71 0 7.07 1.48 9.53 3.9L12 19.12 2.47 11.4C4.93 8.98 8.29 7.5 12 7.5z"/>
            </svg>
            <!-- Battery with fill -->
            <div class="w-[22px] h-[11px] border border-current rounded-[3px] p-[1.5px] flex items-center relative">
              <div class="w-full h-full bg-current rounded-[1.5px]"></div>
              <div class="absolute -right-[3.5px] top-1 w-[2px] h-[3.5px] bg-current rounded-r-[1px]"></div>
            </div>
          </div>
        </div>

        <!-- Phone Content Area -->
        <div class="flex-1 overflow-y-auto px-5 py-4 scroll-smooth">
          <slot />
        </div>

        <!-- iOS Bottom Home Indicator Bar -->
        <div class="relative z-30 py-2 flex justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm pointer-events-none">
          <div class="w-36 h-1 bg-slate-900/70 dark:bg-slate-200/70 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- Device Tag below -->
    <div class="text-center mt-3 text-xs text-slate-400 font-mono">
      iPhone 15 / 16 Pro · 393 × 852 (Dynamic Island)
    </div>
  </div>
</template>

<script setup lang="ts">
// iPhone simulator with Dynamic Island
</script>

<style scoped>
.iphone-wrapper {
  perspective: 1000px;
}
.dynamic-island {
  transform: translateX(-50%);
}
</style>
