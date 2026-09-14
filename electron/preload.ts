import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (options: { defaultPath: string; filters: Array<{ name: string; extensions: string[] }>; content: string }) =>
    ipcRenderer.invoke('dialog:saveFile', options),
  isElectron: true
})
