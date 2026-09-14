/**
 * Copy HTML as rich text to system clipboard.
 * Writes both `text/html` and `text/plain` for seamless pasting into
 * WeChat Official Accounts, Zhihu, Juejin, Yuque, Word, etc.
 */
export async function copyRichText(html: string, plainText: string): Promise<boolean> {
  // Strategy 1: Modern Async Clipboard API with ClipboardItem
  if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
    try {
      const blobHtml = new Blob([html], { type: 'text/html' })
      const blobText = new Blob([plainText], { type: 'text/plain' })
      const item = new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText
      })
      await navigator.clipboard.write([item])
      return true
    } catch (err) {
      console.warn('Modern ClipboardItem API failed, falling back to legacy execCommand:', err)
    }
  }

  // Strategy 2: Fallback using document.execCommand('copy') with temporary DOM container
  try {
    let success = false
    const container = document.createElement('div')
    container.innerHTML = html
    container.style.position = 'fixed'
    container.style.left = '-9999px'
    container.style.top = '0'
    container.style.opacity = '0'
    container.style.pointerEvents = 'none'
    container.setAttribute('contenteditable', 'true')
    document.body.appendChild(container)

    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(container)
    selection?.removeAllRanges()
    selection?.addRange(range)

    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      if (e.clipboardData) {
        e.clipboardData.setData('text/html', html)
        e.clipboardData.setData('text/plain', plainText)
        success = true
      }
    }

    document.addEventListener('copy', onCopy)
    const result = document.execCommand('copy')
    document.removeEventListener('copy', onCopy)

    selection?.removeAllRanges()
    document.body.removeChild(container)

    return success || result
  } catch (err) {
    console.error('All clipboard write attempts failed:', err)
    return false
  }
}

/**
 * Trigger browser file download
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
