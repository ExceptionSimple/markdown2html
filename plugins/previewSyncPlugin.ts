import type { Plugin, ViteDevServer, PreviewServer } from 'vite'
import os from 'node:os'
import type { IncomingMessage, ServerResponse } from 'node:http'

interface PreviewPayload {
  html: string
  css?: string
  title: string
  theme: string
  backgroundColor: string
  updatedAt: number
}

let latestPreview: PreviewPayload = {
  html: '',
  css: '',
  title: 'Markdown2HTML 移动端预览',
  theme: 'wechat',
  backgroundColor: '#ffffff',
  updatedAt: Date.now()
}

function getNetworkIps() {
  const nets = os.networkInterfaces()
  const list: { name: string; ip: string; isRecommended: boolean }[] = []

  for (const [name, netList] of Object.entries(nets)) {
    if (!netList) continue
    for (const net of netList) {
      const isIPv4 = net.family === 'IPv4' || (net.family as unknown) === 4
      if (isIPv4 && !net.internal) {
        // Prioritize physical Wi-Fi / Ethernet cards
        const isRecommend =
          (name.startsWith('wl') || name.startsWith('en') || name.startsWith('eth')) &&
          !name.includes('docker') &&
          !name.includes('br-') &&
          !name.includes('vmnet') &&
          !name.includes('tun')
        list.push({ name, ip: net.address, isRecommended: !!isRecommend })
      }
    }
  }

  // Sort recommended interfaces (e.g. Wi-Fi wlp0s...) first
  list.sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0))
  return list
}

function handleMiddleware(req: IncomingMessage, res: ServerResponse, port: number) {
  const url = req.url ? new URL(req.url, 'http://localhost') : null
  if (!url) return false

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return true
  }

  // 1. Get host network IPs
  if (url.pathname === '/api/network-ips' && req.method === 'GET') {
    const ips = getNetworkIps()
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ ips, port }))
    return true
  }

  // 2. Push preview content
  if (url.pathname === '/api/preview-sync' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => {
      body += chunk
    })
    req.on('end', () => {
      try {
        const data = JSON.parse(body)
        latestPreview = {
          html: typeof data.html === 'string' ? data.html : '',
          css: typeof data.css === 'string' ? data.css : '',
          title: typeof data.title === 'string' ? data.title : 'Markdown2HTML 移动端预览',
          theme: typeof data.theme === 'string' ? data.theme : 'wechat',
          backgroundColor: typeof data.backgroundColor === 'string' ? data.backgroundColor : '#ffffff',
          updatedAt: Date.now()
        }
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ success: true, updatedAt: latestPreview.updatedAt }))
      } catch (err) {
        res.statusCode = 400
        res.end(JSON.stringify({ error: 'Invalid JSON body' }))
      }
    })
    return true
  }

  // 3. Pull latest preview content
  if (url.pathname === '/api/preview-sync' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.end(JSON.stringify(latestPreview))
    return true
  }

  return false
}

export function previewSyncPlugin(): Plugin {
  return {
    name: 'vite-plugin-preview-sync',
    configureServer(server: ViteDevServer) {
      const port = server.config.server.port || 5173
      server.middlewares.use((req, res, next) => {
        if (handleMiddleware(req, res, port)) return
        next()
      })
    },
    configurePreviewServer(server: PreviewServer) {
      const port = server.config.preview?.port || 4173
      server.middlewares.use((req, res, next) => {
        if (handleMiddleware(req, res, port)) return
        next()
      })
    }
  }
}
