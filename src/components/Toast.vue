<template>
  <Transition name="toast">
    <div
      v-if="visible"
      class="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border text-xs font-medium"
      :class="type === 'success' ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-950/50' : 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-950/50'"
    >
      <CheckCircle2 v-if="type === 'success'" class="w-4 h-4 text-emerald-400 shrink-0" />
      <AlertCircle v-else class="w-4 h-4 text-rose-400 shrink-0" />
      <span>{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle2, AlertCircle } from '@lucide/vue'

const visible = ref(false)
const message = ref('')
const type = ref<'success' | 'error'>('success')
let timer: any = null

function show(msg: string, toastType: 'success' | 'error' = 'success', duration = 3000) {
  message.value = msg
  type.value = toastType
  visible.value = true

  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    visible.value = false
  }, duration)
}

defineExpose({
  show
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
</style>
