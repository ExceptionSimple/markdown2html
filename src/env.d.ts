/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// MathJax 的浏览器自包含包没有类型声明，只用它的副作用（挂 window.MathJax）
declare module 'mathjax/tex-svg.js'

interface Window {
  electronAPI?: {
    saveFile: (options: {
      defaultPath: string
      filters: Array<{ name: string; extensions: string[] }>
      content: string
    }) => Promise<{ success: boolean; filePath?: string; canceled?: boolean; error?: string }>
    isElectron: boolean
  }
}
