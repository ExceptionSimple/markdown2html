import mermaid from 'mermaid'

let isInitialized = false

export function initMermaid() {
  if (!isInitialized && typeof window !== 'undefined') {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      htmlLabels: false,
      flowchart: {
        htmlLabels: false,
        useMaxWidth: false
      },
      sequence: {
        useMaxWidth: false
      },
      gantt: {
        useMaxWidth: false
      },
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
    })
    isInitialized = true
  }
}

/**
 * Clean SVG and ensure explicit pixel width/height from viewBox to prevent
 * tainted canvas SecurityError in Chromium and blurry rasterization.
 */
function prepareSvgForCanvas(svg: string): { cleanSvg: string; width: number; height: number } {
  let width = 600
  let height = 400

  // 1. Extract dimensions from viewBox if available
  const viewBoxMatch = svg.match(/viewBox\s*=\s*["']\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*["']/i)
  if (viewBoxMatch) {
    const vbWidth = parseFloat(viewBoxMatch[3])
    const vbHeight = parseFloat(viewBoxMatch[4])
    if (vbWidth > 0 && vbHeight > 0) {
      width = vbWidth
      height = vbHeight
    }
  } else {
    const widthMatch = svg.match(/width\s*=\s*["']([\d.]+)px?["']/i)
    const heightMatch = svg.match(/height\s*=\s*["']([\d.]+)px?["']/i)
    if (widthMatch) width = parseFloat(widthMatch[1])
    if (heightMatch) height = parseFloat(heightMatch[1])
  }

  // 2. Eliminate any <foreignObject> tags (Chromium taints canvas if foreignObject is present)
  let cleanSvg = svg
    .replace(/<foreignObject[\s\S]*?<div[^>]*>([\s\S]*?)<\/div>[\s\S]*?<\/foreignObject>/gi, (_, text) => {
      const cleanText = text.replace(/<[^>]+>/g, '').trim()
      return `<text text-anchor="middle" dominant-baseline="middle">${cleanText}</text>`
    })
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')

  // 3. Inject explicit width & height attributes onto root <svg> tag
  cleanSvg = cleanSvg.replace(/<svg\b([^>]*)>/i, (_match, attrs) => {
    let newAttrs = attrs
      .replace(/\bwidth\s*=\s*["'][^"']*["']/i, `width="${width}px"`)
      .replace(/\bheight\s*=\s*["'][^"']*["']/i, `height="${height}px"`)
    if (!/width\s*=/i.test(newAttrs)) newAttrs += ` width="${width}px"`
    if (!/height\s*=/i.test(newAttrs)) newAttrs += ` height="${height}px"`
    return `<svg${newAttrs}>`
  })

  return { cleanSvg, width, height }
}

const mermaidCache = new Map<string, string>()
const MAX_MERMAID_CACHE = 200

export function clearMermaidCache() {
  mermaidCache.clear()
}

/**
 * Render a Mermaid chart definition to a PNG Data URL (data:image/png;base64,...)
 * using HTML5 Canvas for 100% compatibility with WeChat Official Accounts and rich text.
 */
export async function renderMermaidToPng(code: string, id: string): Promise<string> {
  const trimmedCode = code.trim()
  const cached = mermaidCache.get(trimmedCode)
  if (cached) {
    return cached
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // Non-browser fallback for test runners
    const fallback = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg"><text>${code}</text></svg>`)}`
    mermaidCache.set(trimmedCode, fallback)
    return fallback
  }

  initMermaid()

  try {
    // 1. Render SVG from Mermaid definition
    const containerId = `m2h-mermaid-${id}-${Date.now()}`
    const { svg } = await mermaid.render(containerId, trimmedCode)

    const { cleanSvg, width, height } = prepareSvgForCanvas(svg)

    // 2. Convert SVG string into Image on high-DPI Canvas
    const result = await new Promise<string>((resolve) => {
      const img = new Image()
      const svgBlob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          // High-DPI 2x scaling for crisp retina rendering in WeChat articles
          const dpr = 2
          canvas.width = Math.ceil(width * dpr)
          canvas.height = Math.ceil(height * dpr)
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.scale(dpr, dpr)
            // Clean white background behind diagram
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, width, height)
            ctx.drawImage(img, 0, 0, width, height)
            const pngDataUrl = canvas.toDataURL('image/png')
            URL.revokeObjectURL(url)
            resolve(pngDataUrl)
            return
          }
        } catch (e) {
          console.warn('Canvas rasterization error, falling back to SVG data URL:', e)
        }
        // Fallback to SVG Data URL if canvas fails
        URL.revokeObjectURL(url)
        resolve(`data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`)
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(`data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`)
      }

      img.src = url
    })

    if (mermaidCache.size >= MAX_MERMAID_CACHE) {
      const oldestKey = mermaidCache.keys().next().value
      if (oldestKey) mermaidCache.delete(oldestKey)
    }
    mermaidCache.set(trimmedCode, result)
    return result
  } catch (err: any) {
    console.error('Mermaid render error:', err)
    // Return placeholder diagram error image
    return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="60"><rect width="300" height="60" fill="#fef2f2" rx="6"/><text x="10" y="35" fill="#ef4444" font-size="12">Mermaid 图表解析错误</text></svg>`)}`
  }
}
