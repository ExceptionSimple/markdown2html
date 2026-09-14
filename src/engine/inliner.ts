import juice from 'juice'
import type { ThemeConfig } from '../themes/types'
import { generateThemeCss } from './cssGenerator'

export function inlineHtmlWithTheme(html: string, theme: ThemeConfig): string {
  if (!html || !html.trim()) return ''
  const combinedCss = generateThemeCss(theme, '.m2h-content')

  // Wrap within a section container for WeChat (avoid double-wrapping if already present)
  const isAlreadyWrapped = html.trim().startsWith('<section class="m2h-content"')
  const rawHtml = isAlreadyWrapped
    ? html
    : `<section class="m2h-content" style="box-sizing: border-box; -webkit-tap-highlight-color: transparent;">${html}</section>`

  const juiceFn = (juice as any).inlineContent || juice
  const inlined = juiceFn(rawHtml, combinedCss, {
    inlinePseudoElements: false,
    preserveImportant: true
  })

  // WeChat Compatibility Tag Degradation:
  // Convert <h1>-<h6> to <section role="heading" ...> to bypass WeChat default UA margins
  let sanitized = inlined.replace(/<h([1-6])(\b[^>]*)>([\s\S]*?)<\/h\1>/gi, '<section role="heading" aria-level="$1"$2>$3</section>')
  // Convert <blockquote> to <section role="blockquote" ...>
  sanitized = sanitized.replace(/<blockquote(\b[^>]*)>([\s\S]*?)<\/blockquote>/gi, '<section role="blockquote"$1>$2</section>')

  return sanitized
}

export function generateStandaloneHtml(html: string, theme: ThemeConfig, title = 'Markdown Document'): string {
  const inlined = inlineHtmlWithTheme(html, theme)
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      background-color: ${theme.typography.backgroundColor};
      display: flex;
      justify-content: center;
    }
    .m2h-content {
      max-width: 800px;
      width: 100%;
    }
  </style>
</head>
<body>
  ${inlined}
</body>
</html>`
}
