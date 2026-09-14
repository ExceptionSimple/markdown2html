import { createHighlighter, type Highlighter } from 'shiki'

let highlighterPromise: Promise<Highlighter> | null = null

const PRELOAD_THEMES = [
  'github-dark',
  'github-light',
  'tokyo-night',
  'one-dark-pro'
]

const PRELOAD_LANGS = [
  'javascript',
  'typescript',
  'python',
  'bash',
  'shell',
  'json',
  'yaml',
  'html',
  'css',
  'sql',
  'go',
  'rust',
  'java',
  'c',
  'cpp',
  'markdown'
]

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: PRELOAD_THEMES,
      langs: PRELOAD_LANGS
    })
  }
  return highlighterPromise
}

const highlightCache = new Map<string, string>()
const MAX_HIGHLIGHT_CACHE = 1000

export function clearHighlightCache() {
  highlightCache.clear()
}

export async function highlightCode(
  code: string,
  lang: string,
  theme = 'github-dark'
): Promise<string> {
  const safeTheme = PRELOAD_THEMES.includes(theme) ? theme : 'github-dark'
  const cacheKey = `${safeTheme}:::${lang}:::${code}`

  const cached = highlightCache.get(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const hl = await getHighlighter()
    const loadedLangs = hl.getLoadedLanguages()
    const safeLang = loadedLangs.includes(lang) ? lang : 'text'

    const result = hl.codeToHtml(code, {
      lang: safeLang,
      theme: safeTheme
    })

    if (highlightCache.size >= MAX_HIGHLIGHT_CACHE) {
      const oldestKey = highlightCache.keys().next().value
      if (oldestKey) highlightCache.delete(oldestKey)
    }
    highlightCache.set(cacheKey, result)

    return result
  } catch (err) {
    console.error('Shiki highlight failed:', err)
    // Fallback: escaped pre/code
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return `<pre class="shiki"><code>${escaped}</code></pre>`
  }
}
