<template>
  <div class="space-y-1">
    <div v-if="label || allowTransparent" class="flex items-center justify-between">
      <label v-if="label" class="text-slate-400" :class="compact ? 'text-2xs' : 'text-xs'">{{ label }}</label>
      <button
        v-if="allowTransparent"
        type="button"
        @click="$emit('update:modelValue', 'transparent')"
        class="text-2xs text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
        title="设为透明色"
      >
        透明
      </button>
    </div>
    <div class="flex items-center gap-2">
      <div
        class="relative rounded-lg border border-slate-700 overflow-hidden cursor-pointer hover:border-slate-500 transition-colors flex-shrink-0 shadow-sm"
        :class="compact ? 'w-6 h-6' : 'w-7 h-7'"
        title="点击调出颜色拾取器"
      >
        <div
          v-if="isTransparent"
          class="w-full h-full flex items-center justify-center text-2xs font-bold text-slate-500 bg-slate-900 select-none"
        >
          透
        </div>
        <div
          v-else
          class="w-full h-full"
          :style="{ backgroundColor: previewColor }"
        ></div>
        <input
          type="color"
          :value="safeHex"
          @input="onColorInput"
          class="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </div>
      <input
        type="text"
        :value="modelValue"
        @input="onTextInput"
        :placeholder="placeholder || (allowTransparent ? 'transparent' : '#000000')"
        class="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        :class="compact ? 'px-2 py-0.5 text-2xs' : 'px-2.5 py-1 text-xs'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    allowTransparent?: boolean
    placeholder?: string
    compact?: boolean
  }>(),
  {
    modelValue: '',
    label: '',
    allowTransparent: false,
    placeholder: '',
    compact: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isTransparent = computed(() => {
  return props.modelValue === 'transparent' || !props.modelValue
})

const previewColor = computed(() => {
  if (isTransparent.value) return 'transparent'
  return props.modelValue
})

const safeHex = computed(() => {
  const val = (props.modelValue || '').trim()
  if (/^#[0-9a-fA-F]{6}$/.test(val)) return val
  if (/^#[0-9a-fA-F]{3}$/.test(val)) {
    return `#${val[1]}${val[1]}${val[2]}${val[2]}${val[3]}${val[3]}`
  }
  return '#10b981'
})

function onColorInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onTextInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
