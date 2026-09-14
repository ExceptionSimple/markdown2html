/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

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
