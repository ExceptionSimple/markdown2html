import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure:
// dist/
// ├─ index.html
// dist-electron/
// ├─ main.js
// ├─ preload.js

process.env.APP_ROOT = path.join(__dirname, '..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null = null

function createWindow() {
  win = new BrowserWindow({
    title: 'Markdown2HTML - 微信与富文本排版神器',
    width: 1360,
    height: 880,
    minWidth: 960,
    minHeight: 650,
    backgroundColor: '#090d16',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    titleBarStyle: 'default',
    autoHideMenuBar: true
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  win.on('closed', () => {
    win = null
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  // IPC Handlers for native file save
  ipcMain.handle('dialog:saveFile', async (_, { defaultPath, filters, content }) => {
    if (!win) return { success: false, error: 'No active window' }
    const result = await dialog.showSaveDialog(win, {
      defaultPath,
      filters
    })
    if (!result.canceled && result.filePath) {
      try {
        fs.writeFileSync(result.filePath, content, 'utf-8')
        return { success: true, filePath: result.filePath }
      } catch (err: any) {
        return { success: false, error: err.message }
      }
    }
    return { success: false, canceled: true }
  })

  createWindow()
})
