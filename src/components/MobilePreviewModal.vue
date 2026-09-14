<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm select-none animate-in fade-in duration-200"
    @click.self="$emit('close')"
  >
    <div
      class="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-emerald-950/40 w-full max-w-md overflow-hidden transition-all transform"
    >
      <!-- Modal Header -->
      <div class="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <QrCode class="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>真机预览</span>
              <span class="text-3xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">纯只读</span>
            </h3>
            <p class="text-2xs text-slate-400">微信或手机浏览器直接查看真实机型排版效果</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 flex flex-col items-center">
        <!-- QR Code Canvas / Image Container -->
        <div class="p-3 bg-white rounded-2xl shadow-lg shadow-black/30 border border-slate-200 mb-4 flex items-center justify-center min-w-[220px] min-h-[220px]">
          <img
            v-if="qrCodeDataUrl"
            :src="qrCodeDataUrl"
            alt="手机真机扫码预览"
            class="w-52 h-52 object-contain"
          />
          <div v-else class="flex flex-col items-center justify-center text-slate-500 text-xs gap-2 py-12">
            <div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span>生成二维码中...</span>
          </div>
        </div>

        <!-- Network Interface Selection -->
        <div class="w-full space-y-1.5 mb-3">
          <div class="flex items-center justify-between text-2xs text-slate-400 px-1">
            <span class="flex items-center gap-1">
              <Wifi class="w-3 h-3 text-emerald-400" />
              <span>局域网 IP / 接口</span>
            </span>
            <span v-if="selectedIpObj?.isRecommended" class="text-emerald-400 font-medium">推荐 Wi-Fi 地址</span>
          </div>
          <select
            v-model="selectedIp"
            @change="generateQrCode"
            class="w-full bg-slate-800/90 text-slate-200 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option v-for="item in networkIps" :key="item.ip" :value="item.ip">
              {{ item.ip }} ({{ item.name }}) {{ item.isRecommended ? '★ 推荐' : '' }}
            </option>
          </select>
        </div>

        <!-- URL & Copy -->
        <div class="w-full flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-lg p-1.5 mb-4">
          <input
            type="text"
            readonly
            :value="previewUrl"
            class="flex-1 bg-transparent text-2xs font-mono text-slate-300 px-2 outline-none select-all truncate"
          />
          <button
            @click="copyUrl"
            class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-2xs font-medium rounded border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <Check v-if="copied" class="w-3 h-3 text-emerald-400" />
            <Copy v-else class="w-3 h-3 text-slate-400" />
            <span>{{ copied ? '已复制' : '复制' }}</span>
          </button>
        </div>

        <!-- Guidelines / Tips -->
        <div class="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 space-y-1.5 text-2xs text-slate-400 leading-relaxed">
          <div class="flex items-start gap-1.5 text-slate-300">
            <Smartphone class="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>扫码即看</strong>：使用微信「扫一扫」或手机系统自带相机扫描。</span>
          </div>
          <div class="flex items-start gap-1.5">
            <Radio class="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
            <span><strong>实时静默同步</strong>：电脑端修改内容或主题时，手机端无需手动刷新，自动静默更新排版。</span>
          </div>
          <div class="flex items-start gap-1.5">
            <Info class="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>网络提示</strong>：请确保手机与电脑已接入<strong>同一个 Wi-Fi 局域网</strong>。</span>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-2xs text-slate-400">
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span class="text-slate-300">同步服务正在运行</span>
        </span>
        <button
          @click="$emit('close')"
          class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
        >
          完成
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import QRCode from 'qrcode'
import { QrCode, X, Wifi, Copy, Check, Smartphone, Radio, Info } from '@lucide/vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'toast', msg: string, type?: 'success' | 'error'): void
}>()

interface NetIp {
  name: string
  ip: string
  isRecommended: boolean
}

const networkIps = ref<NetIp[]>([])
const selectedIp = ref<string>('127.0.0.1')
const serverPort = ref<number>(5173)
const qrCodeDataUrl = ref<string>('')
const copied = ref(false)

const selectedIpObj = computed(() => {
  return networkIps.value.find(i => i.ip === selectedIp.value)
})

const previewUrl = computed(() => {
  const host = selectedIp.value || window.location.hostname || '127.0.0.1'
  const port = serverPort.value || window.location.port || 5173
  return `http://${host}:${port}/?mode=mobile`
})

async function fetchNetworkIps() {
  try {
    const res = await fetch('/api/network-ips')
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data.ips) && data.ips.length > 0) {
        networkIps.value = data.ips
        serverPort.value = data.port || 5173
        // Prefer first recommended IP
        const recommended = data.ips.find((i: NetIp) => i.isRecommended)
        selectedIp.value = recommended ? recommended.ip : data.ips[0].ip
        await generateQrCode()
        return
      }
    }
  } catch (e) {
    console.warn('Fetch network IPs failed, falling back to window.location:', e)
  }

  // Fallback
  selectedIp.value = window.location.hostname || '127.0.0.1'
  serverPort.value = Number(window.location.port) || 5173
  networkIps.value = [
    { name: 'local', ip: selectedIp.value, isRecommended: true }
  ]
  await generateQrCode()
}

async function generateQrCode() {
  if (!previewUrl.value) return
  try {
    qrCodeDataUrl.value = await QRCode.toDataURL(previewUrl.value, {
      width: 260,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
  } catch (err) {
    console.error('Failed to generate QR code:', err)
  }
}

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(previewUrl.value)
    copied.value = true
    emit('toast', '预览链接已复制到剪贴板', 'success')
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    emit('toast', '复制链接失败，请手动复制', 'error')
  }
}

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      fetchNetworkIps()
    }
  }
)

onMounted(() => {
  if (props.isOpen) {
    fetchNetworkIps()
  }
})
</script>
