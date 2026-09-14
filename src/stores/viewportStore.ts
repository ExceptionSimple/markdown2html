import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type DeviceType = 'iphone375' | 'android360' | 'phone414' | 'pc'

export interface DeviceConfig {
  id: DeviceType
  name: string
  shortName: string
  width: number
  height: number
  description: string
  badge: string
}

export const DEVICE_OPTIONS: DeviceConfig[] = [
  {
    id: 'iphone375',
    name: '375px (iPhone 微信标杆)',
    shortName: '375px 微信标杆',
    width: 375,
    height: 812,
    description: '微信公众号正文事实标准宽度，必须死守的排版基准线',
    badge: '微信基准'
  },
  {
    id: 'android360',
    name: '360px (安卓 / 小米 14)',
    shortName: '360px 安卓',
    width: 360,
    height: 800,
    description: '主流安卓机型逻辑渲染宽度，用于排查窄屏边距是否溢出',
    badge: '安卓基准'
  },
  {
    id: 'phone414',
    name: '414px (大屏 Plus / Max)',
    shortName: '414px 大屏',
    width: 414,
    height: 896,
    description: '大屏手机视口，检查在大屏上是否显得空旷或图片失真',
    badge: '大屏视口'
  },
  {
    id: 'pc',
    name: 'PC 宽屏阅读视图',
    shortName: 'PC 宽屏',
    width: 800,
    height: 900,
    description: '桌面端沉浸式阅读与排版视图',
    badge: 'PC 宽屏'
  }
]

export const useViewportStore = defineStore('viewport', () => {
  const currentDevice = ref<DeviceType>('iphone375')
  const scale = ref<number>(1)
  const showDeviceFrame = ref<boolean>(true)
  const pcWidth = ref<number>(800)

  const currentConfig = computed(() => {
    return DEVICE_OPTIONS.find(d => d.id === currentDevice.value) || DEVICE_OPTIONS[0]
  })

  function setDevice(device: DeviceType) {
    currentDevice.value = device
    if (device === 'pc') {
      scale.value = 1
    } else {
      // Fit mobile frame nicely in desktop split view
      if (scale.value > 0.9) {
        scale.value = 0.85
      }
    }
  }

  function setScale(val: number) {
    scale.value = val
  }

  function toggleDeviceFrame() {
    showDeviceFrame.value = !showDeviceFrame.value
  }

  return {
    currentDevice,
    scale,
    showDeviceFrame,
    pcWidth,
    currentConfig,
    deviceOptions: DEVICE_OPTIONS,
    setDevice,
    setScale,
    toggleDeviceFrame
  }
})
