import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import type { ThemeConfig } from '../themes/types'
import { highlightCode } from './shiki'
import { renderMathToSvg } from './mathjax'
import { renderMermaidToPng } from './mermaid'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function injectLineNumbers(shikiHtml: string, color = 'rgba(148, 163, 184, 0.45)'): string {
  const lineMatches = shikiHtml.match(/<span class="line">/g)
  if (!lineMatches || lineMatches.length === 0) {
    const lines = shikiHtml.split('\n')
    if (lines.length <= 1) return shikiHtml
    const digits = Math.max(2, String(lines.length).length)
    const minWidthPx = digits * 9 + 8
    return lines
      .map((line, idx) => {
        const numSpan = `<span class="m2h-line-number" style="display: inline-block; min-width: ${minWidthPx}px; text-align: right; padding-right: 12px; margin-right: 10px; color: ${color}; user-select: none; -webkit-user-select: none; opacity: 0.5; border-right: 1px solid rgba(148, 163, 184, 0.2); font-family: inherit; font-size: inherit;">${idx + 1}</span>`
        return `${numSpan}${line}`
      })
      .join('\n')
  }

  const totalLines = lineMatches.length
  const digits = Math.max(2, String(totalLines).length)
  const minWidthPx = digits * 9 + 8

  let currentLine = 1
  return shikiHtml.replace(/<span class="line">/g, () => {
    const lineNum = currentLine++
    const numSpan = `<span class="m2h-line-number" style="display: inline-block; min-width: ${minWidthPx}px; text-align: right; padding-right: 12px; margin-right: 10px; color: ${color}; user-select: none; -webkit-user-select: none; opacity: 0.5; border-right: 1px solid rgba(148, 163, 184, 0.2); font-family: inherit; font-size: inherit;">${lineNum}</span>`
    return `<span class="line">${numSpan}`
  })
}

// 公式渲染结果缓存。MathJax 是异步的而下面改 AST 的 visit 是同步的，
// 所以先并发预渲染把缓存填满，同步 visit 只负责查表。
const mathInlineCache = new Map<string, string>()
const mathBlockCache = new Map<string, string>()

export function clearMathCache() {
  mathInlineCache.clear()
  mathBlockCache.clear()
}

async function prerenderMath(tex: string, display: boolean, cache: Map<string, string>, limit: number) {
  if (cache.has(tex)) return
  try {
    cache.set(tex, await renderMathToSvg(tex, display))
  } catch {
    // 渲染失败就不填缓存，交给同步 visit 里的兜底分支降级成公式源码
    return
  }
  if (cache.size > limit) {
    const oldest = cache.keys().next().value
    if (oldest) cache.delete(oldest)
  }
}

// Convert numbers to Chinese numerals for chapter prefix
export function toChineseNumber(num: number): string {
  if (num <= 0) return String(num)
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  if (num <= 10) {
    return num === 10 ? '十' : digits[num]
  }
  if (num < 20) {
    return '十' + digits[num % 10]
  }
  if (num < 100) {
    const tens = Math.floor(num / 10)
    const ones = num % 10
    return digits[tens] + '十' + (ones > 0 ? digits[ones] : '')
  }
  if (num < 1000) {
    const hundreds = Math.floor(num / 100)
    const rem = num % 100
    const tens = Math.floor(rem / 10)
    const ones = rem % 10
    let res = digits[hundreds] + '百'
    if (rem > 0) {
      if (tens === 0) {
        res += '零' + digits[ones]
      } else {
        res += digits[tens] + '十' + (ones > 0 ? digits[ones] : '')
      }
    }
    return res
  }
  return String(num)
}

// Clean existing manual numbers/chapter prefixes from heading text to avoid duplication
export function cleanHeadingText(text: string): string {
  const cleaned = text
    .replace(/^第[一二三四五六七八九十百\d]+(?:章|节|篇|部分|回|卷|集|单元|大类)[、:\s\.-]+/i, '')
    .replace(/^[一二三四五六七八九十]+[、\.\s\.-]+/i, '')
    .replace(/^\d+(\.\d+)*[\.、:\s\.-]+/i, '')
    .trim()
  return cleaned || text
}

// Common Emojis map
const EMOJI_MAP: Record<string, string> = {
  ':smile:': '😄',
  ':+1:': '👍',
  ':heart:': '❤️',
  ':rocket:': '🚀',
  ':warning:': '⚠️',
  ':tada:': '🎉',
  ':fire:': '🔥',
  ':check:': '✅',
  ':star:': '⭐',
  ':bulb:': '💡',
  ':memo:': '📝',
  ':eyes:': '👀'
}

export interface HeadingItem {
  id: string
  level: number
  text: string
  prefix: string
}

/**
 * Preprocess Markdown:
 * - Fix CJK punctuation emphasis delimiter issues (e.g. `**xxx（CSS）**或`)
 * - ==highlight== -> <mark>highlight</mark>
 * - ~sub~ -> <sub>sub</sub>
 * - ^sup^ -> <sup>sup</sup>
 * - <kbd>Key</kbd> -> <span class="m2h-kbd">Key</span>
 * - Emoji shortcodes
 */
function preprocessMarkdown(text: string): string {
  // Protect code blocks, inline code, and math expressions from preprocessor modifications
  const protectedBlocks: string[] = []
  let res = text.replace(
    /(```[\s\S]*?```|`[^`\n]+`|\$\$[\s\S]*?\$\$|(?<!\$)\$(?!\$)(?:\\.|[^$\n])+?(?<!\$)\$(?!\$))/g,
    (match) => {
      const placeholder = `\x02M2H_BLOCK_${protectedBlocks.length}\x03`
      protectedBlocks.push(match)
      return placeholder
    }
  )

  // 1. Emojis
  for (const [key, val] of Object.entries(EMOJI_MAP)) {
    res = res.replaceAll(key, val)
  }

  // 2. Fix CommonMark CJK punctuation emphasis issue:
  // In CommonMark spec, a closing delimiter run `**` preceded by punctuation (e.g. `)`, `）`, `!`, `！`, `?`, `？`, `。`, `”`, etc.)
  // and followed by a CJK ideograph or word character is not recognized as a right-flanking delimiter run.
  // This causes patterns like `在复制时**100% 编译为内联样式（Inline CSS）**或无损嵌入图片！` to fail to parse as bold.
  // We normalize these occurrences into safe HTML tags before mdast/rehype-raw processing.
  res = res.replace(
    /(?<!\*)\*\*\*([^\*\n]+?[\)）！!？?。"'”’、；;：:\>》\]】\}｝])\*\*\*(?=[\u4e00-\u9fa5\w])/g,
    '<strong><em>$1</em></strong>'
  )
  res = res.replace(
    /(?<!\*)\*\*([^\*\n]+?[\)）！!？?。"'”’、；;：:\>》\]】\}｝])\*\*(?=[\u4e00-\u9fa5\w])/g,
    '<strong>$1</strong>'
  )
  res = res.replace(
    /(?<!\*)\*([^\*\n]+?[\)）！!？?。"'”’、；;：:\>》\]】\}｝])\*(?=[\u4e00-\u9fa5\w])/g,
    '<em>$1</em>'
  )

  // 3. ==highlight== -> <mark>$1</mark>
  res = res.replace(/==([^=\n]+)==/g, '<mark>$1</mark>')

  // 4. Subscript ~sub~ (protecting math and code)
  res = res.replace(/(?<![~$\w])~([^~\n\s]+)~(?!~)/g, '<sub>$1</sub>')

  // 5. Superscript ^sup^
  res = res.replace(/(?<![\^$\w])\^([^\^\n\s]+)\^(?!\^)/g, '<sup>$1</sup>')

  // 6. <kbd>Key</kbd>
  res = res.replace(/<kbd>([\s\S]*?)<\/kbd>/gi, '<span class="m2h-kbd">$1</span>')

  // Restore protected code/math blocks
  for (let i = protectedBlocks.length - 1; i >= 0; i--) {
    res = res.replace(`\x02M2H_BLOCK_${i}\x03`, () => protectedBlocks[i])
  }

  return res
}

export async function renderMarkdown(
  rawMdText: string,
  theme: ThemeConfig
): Promise<string> {
  const mdText = preprocessMarkdown(rawMdText)

  const toc = theme.toc || {
    enabled: true,
    title: '文章导读 · 目录',
    minLevel: 1,
    maxLevel: 3,
    prefixStyle: 'none',
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    textColor: '#166534',
    accentColor: '#07c160',
    borderRadius: '8px'
  }

  const alerts = theme.alerts || {
    noteColor: '#3b82f6',
    tipColor: '#10b981',
    warningColor: '#f59e0b',
    importantColor: '#8b5cf6',
    cautionColor: '#ef4444',
    borderRadius: '8px'
  }

  const imageConfig = theme.image || {
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: 'none',
    showCaption: true,
    captionColor: '#6b7280',
    captionFontSize: '12px'
  }

  const dividerConfig = theme.divider || {
    style: 'symbol',
    color: '#cbd5e1',
    height: '1px',
    margin: '28px 0',
    symbol: '✦ ✦ ✦'
  }

  const footnotesConfig = theme.footnotes || {
    linkToFootnote: true,
    title: '参考链接',
    fontSize: '12px',
    textColor: '#6b7280'
  }

  // 1. Parse Markdown into mdast with GFM and Math
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)

  const mdast = processor.parse(mdText)

  // 2. Extract Headings & Assign IDs & Body Numbering
  const rawHeadingNodes: any[] = []
  visit(mdast, 'heading', (node: any) => {
    rawHeadingNodes.push(node)
  })

  // Detect heading hierarchy: H1 is NEVER mandatory!
  // In WeChat and online articles, writers overwhelmingly start body sections at H2.
  // If an article has only a single H1 at the very beginning and has multiple H2 sections,
  // that single H1 is the Document Title (not Chapter 1).
  const h1Nodes = rawHeadingNodes.filter(n => n.depth === 1)
  const h2Nodes = rawHeadingNodes.filter(n => n.depth === 2)
  const isSingleH1Title =
    h1Nodes.length === 1 &&
    rawHeadingNodes[0] === h1Nodes[0] &&
    h2Nodes.length >= 2 &&
    (theme.headings?.treatFirstH1AsTitle !== false)

  // Determine root chapter level:
  // If there are no H1s in the document, or if the first H1 is an article title,
  // then H2 IS THE ROOT CHAPTER LEVEL!
  const rootChapterLevel = (h1Nodes.length === 0 || isSingleH1Title) ? 2 : 1

  const bodyNumbering = theme.headings?.bodyNumbering || 'none'
  const iconPrefix = theme.headings?.iconPrefix || ''
  const bodyCounters = [0, 0, 0, 0, 0, 0]

  // Track canonical heading items for TOC
  const headingItemsForToc: Array<{ id: string; level: number; rawText: string }> = []

  rawHeadingNodes.forEach((node: any, idx: number) => {
    const level = node.depth
    let rawText = ''
    visit(node, 'text', (t: any) => {
      rawText += t.value || ''
    })
    rawText = rawText.trim()
    const id = `heading-${idx + 1}-${encodeURIComponent(rawText.toLowerCase().replace(/\s+/g, '-'))}`

    node.data = node.data || {}
    node.data.hProperties = node.data.hProperties || {}
    node.data.hProperties.id = id

    const isTocSelfRef = /^(?:目录|目录索引|文章目录|Contents|Table of Contents|TOC)$/i.test(cleanHeadingText(rawText))
    const isDocTitle = isSingleH1Title && idx === 0

    // Do not index document title or TOC self-reference into the TOC list
    if (!isDocTitle && !isTocSelfRef) {
      headingItemsForToc.push({ id, level, rawText })
    }

    let bodyPrefix = ''
    // Do not number document title or TOC self-reference heading
    if (bodyNumbering !== 'none' && !isDocTitle && !isTocSelfRef) {
      const depthIdx = Math.max(0, level - rootChapterLevel)
      bodyCounters[depthIdx]++
      for (let i = depthIdx + 1; i < 6; i++) bodyCounters[i] = 0

      if (bodyNumbering === 'chapter') {
        if (depthIdx === 0) {
          bodyPrefix = `第${toChineseNumber(bodyCounters[0])}章 `
        } else {
          bodyPrefix = bodyCounters.slice(0, depthIdx + 1).join('.') + ' '
        }
      } else if (bodyNumbering === 'number') {
        if (depthIdx === 0) {
          bodyPrefix = `${bodyCounters[0]}. `
        } else {
          bodyPrefix = bodyCounters.slice(0, depthIdx + 1).join('.') + ' '
        }
      }
    }

    if (bodyPrefix || (iconPrefix && !isDocTitle)) {
      const cleanText = bodyPrefix ? cleanHeadingText(rawText) : rawText
      const fullPrefix = `${iconPrefix && !isDocTitle ? iconPrefix : ''}${bodyPrefix}`

      if (node.children?.[0]?.type === 'text') {
        node.children[0].value = fullPrefix + (bodyPrefix ? cleanText : node.children[0].value)
      } else if (node.children) {
        node.children.unshift({ type: 'text', value: fullPrefix })
      }
    }
  })

  // 3. Process [TOC]
  const effectiveMinLevel = (toc.minLevel && toc.minLevel > 1) ? toc.minLevel : rootChapterLevel
  const filteredHeadings = headingItemsForToc.filter(
    h => h.level >= effectiveMinLevel && h.level <= toc.maxLevel
  )

  let tocCardHtml = ''
  if (filteredHeadings.length > 0 && toc.enabled !== false) {
    const tocLevels = filteredHeadings.map(h => h.level)
    const minTocLevel = tocLevels.length > 0 ? Math.min(...tocLevels) : rootChapterLevel
    const tocCounters = [0, 0, 0, 0, 0, 0]

    const itemsHtml = filteredHeadings.map(h => {
      const depthIdx = Math.max(0, h.level - minTocLevel)
      tocCounters[depthIdx]++
      for (let i = depthIdx + 1; i < 6; i++) tocCounters[i] = 0

      let prefix = ''
      if (toc.prefixStyle === 'chapter') {
        if (depthIdx === 0) {
          prefix = `第${toChineseNumber(tocCounters[0])}章 `
        } else {
          prefix = tocCounters.slice(0, depthIdx + 1).join('.') + ' '
        }
      } else if (toc.prefixStyle === 'number') {
        if (depthIdx === 0) {
          prefix = `${tocCounters[0]}. `
        } else {
          prefix = tocCounters.slice(0, depthIdx + 1).join('.') + ' '
        }
      }

      const cleanText = prefix ? cleanHeadingText(h.rawText) : h.rawText
      const indentPx = depthIdx * 16
      const displayText = `${prefix}${escapeHtml(cleanText)}`
      return `
        <li style="margin-left: ${indentPx}px; margin-bottom: 6px; list-style: none !important; list-style-type: none !important;">
          <span class="m2h-toc-link" style="color: ${toc.textColor}; text-decoration: none; display: flex; align-items: center;">
            <span style="border-bottom: 1px dashed rgba(0,0,0,0.15);">${displayText}</span>
          </span>
        </li>
      `
    }).join('\n')

    tocCardHtml = `
      <section class="m2h-toc-card" style="background-color: ${toc.backgroundColor}; border: 1px solid ${toc.borderColor}; border-left: 4px solid ${toc.accentColor}; border-radius: ${toc.borderRadius}; padding: 14px 18px; margin: 20px 0;">
        <ul class="m2h-toc-list" style="margin: 0; padding: 0; list-style: none !important; list-style-type: none !important;">
          ${itemsHtml}
        </ul>
      </section>
    `
  }

  // Regex matching [TOC], [toc], [ToC], [目录], 【TOC】, 【toc】, <!-- toc -->
  const TOC_PATTERN = /(?:\[(?:TOC|toc|ToC|目录)\]|【(?:TOC|toc|ToC|目录)】|<!--\s*toc\s*-->)/gi
  let tocFound = false

  if (toc.enabled !== false) {
    visit(mdast, (node: any, index: number | undefined, parent: any) => {
      if (parent && typeof index === 'number') {
        if (node.type === 'text' && TOC_PATTERN.test(node.value || '')) {
          TOC_PATTERN.lastIndex = 0
          parent.children[index] = {
            type: 'html',
            value: node.value.replace(TOC_PATTERN, tocCardHtml)
          }
          tocFound = true
        } else if (
          node.type === 'paragraph' &&
          node.children?.length === 1 &&
          TOC_PATTERN.test(node.children[0].value?.trim() || '')
        ) {
          TOC_PATTERN.lastIndex = 0
          parent.children[index] = {
            type: 'html',
            value: tocCardHtml
          }
          tocFound = true
        }
      }
    })

    // Auto-insert TOC if autoInsert is enabled and [TOC] was not explicitly present
    if (!tocFound && toc.autoInsert && tocCardHtml) {
      let insertIndex = 0
      for (let i = 0; i < (mdast as any).children.length; i++) {
        if ((mdast as any).children[i].type === 'heading') {
          insertIndex = i + 1
          break
        }
      }
      ;(mdast as any).children.splice(insertIndex, 0, {
        type: 'html',
        value: tocCardHtml
      })
    }
  } else {
    // When toc.enabled is false, remove any [TOC] tags cleanly
    visit(mdast, (node: any, index: number | undefined, parent: any) => {
      if (parent && typeof index === 'number') {
        if (node.type === 'text' && TOC_PATTERN.test(node.value || '')) {
          TOC_PATTERN.lastIndex = 0
          parent.children[index] = {
            type: 'html',
            value: node.value.replace(TOC_PATTERN, '')
          }
        } else if (
          node.type === 'paragraph' &&
          node.children?.length === 1 &&
          TOC_PATTERN.test(node.children[0].value?.trim() || '')
        ) {
          TOC_PATTERN.lastIndex = 0
          parent.children.splice(index, 1)
        }
      }
    })
  }

  // 4. Pre-render math formulas (inlineMath & math)
  // 先用 Set 去重，重复公式只渲染一次；全部并发跑完再进同步流程
  const inlineTex = new Set<string>()
  const blockTex = new Set<string>()
  visit(mdast, 'inlineMath', (node: any) => {
    inlineTex.add(node.value)
  })
  visit(mdast, 'math', (node: any) => {
    blockTex.add(node.value)
  })

  await Promise.all([
    ...[...inlineTex].map((tex) => prerenderMath(tex, false, mathInlineCache, 2000)),
    ...[...blockTex].map((tex) => prerenderMath(tex, true, mathBlockCache, 1000))
  ])

  visit(mdast, 'inlineMath', (node: any, index: number | undefined, parent: any) => {
    if (parent && typeof index === 'number') {
      const svg = mathInlineCache.get(node.value)
      parent.children[index] = svg
        ? { type: 'html', value: `<span class="m2h-math-inline">${svg}</span>` }
        : { type: 'html', value: `<code>$${escapeHtml(node.value)}$</code>` }
    }
  })

  visit(mdast, 'math', (node: any, index: number | undefined, parent: any) => {
    if (parent && typeof index === 'number') {
      const svg = mathBlockCache.get(node.value)
      // 容器一律用 section：微信编辑器会整段吞掉 div，连带 background/border-radius
      parent.children[index] = svg
        ? { type: 'html', value: `<section class="m2h-math-block" style="text-align: center; margin: 18px 0;">${svg}</section>` }
        : { type: 'html', value: `<pre><code>$$${escapeHtml(node.value)}$$</code></pre>` }
    }
  })

  // 5. Process Alerts in blockquote (> [!NOTE], [!TIP], etc.)
  visit(mdast, 'blockquote', (node: any, index: number | undefined, parent: any) => {
    if (!parent || typeof index !== 'number') return

    const firstP = node.children?.[0]
    if (firstP && firstP.type === 'paragraph' && firstP.children?.[0]?.type === 'text') {
      const textVal: string = firstP.children[0].value || ''
      const alertMatch = textVal.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*\n?/i)

      if (alertMatch) {
        const alertType = alertMatch[1].toUpperCase()
        // Strip the alert marker from text
        firstP.children[0].value = textVal.substring(alertMatch[0].length)

        // 背景色使用纯色 hex（由 8% 透明度 rgba 合成到白底得出）。
        // 微信公众号编辑器对 rgba() 背景支持不可靠，会整条丢弃导致卡片"没有样式"。
        let color = alerts.noteColor
        let title = '提示 NOTE'
        let icon = 'ℹ️'
        let bg = '#eff5fe'

        if (alertType === 'TIP') {
          color = alerts.tipColor
          title = '技巧 TIP'
          icon = '💡'
          bg = '#ecf9f5'
        } else if (alertType === 'WARNING') {
          color = alerts.warningColor
          title = '警告 WARNING'
          icon = '⚠️'
          bg = '#fef7eb'
        } else if (alertType === 'IMPORTANT') {
          color = alerts.importantColor
          title = '重要 IMPORTANT'
          icon = '📌'
          bg = '#f6f2fe'
        } else if (alertType === 'CAUTION') {
          color = alerts.cautionColor
          title = '注意 CAUTION'
          icon = '🚨'
          bg = '#fef0f0'
        }

        // Render inner paragraph content to html
        const innerProcessor = unified()
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeRaw)
          .use(rehypeStringify)
        const innerHtml = innerProcessor.stringify(innerProcessor.runSync(firstP as any))

        const alertCardHtml = `
          <section class="m2h-alert-card m2h-alert-${alertType.toLowerCase()}" style="border-left: 4px solid ${color}; background-color: ${bg}; padding: 12px 16px; margin: 18px 0; border-radius: ${alerts.borderRadius};">
            <section class="m2h-alert-title" style="font-weight: bold; font-size: 13px; color: ${color}; margin-bottom: 6px; line-height: 1.6;">
              <span style="margin-right: 6px;">${icon}</span>
              <span>${title}</span>
            </section>
            <section class="m2h-alert-body" style="font-size: 14px; line-height: 1.6; color: inherit;">
              ${innerHtml}
            </section>
          </section>
        `

        parent.children[index] = {
          type: 'html',
          value: alertCardHtml
        }
      }
    }
  })

  // 5.1 Process Blockquote Icon (for non-alert blockquotes)
  if (theme.blockquote?.icon) {
    visit(mdast, 'blockquote', (node: any) => {
      const firstP = node.children?.[0]
      if (firstP && firstP.type === 'paragraph') {
        const firstText = firstP.children?.[0]?.value || ''
        if (!firstText.startsWith('[!')) {
          firstP.children.unshift({
            type: 'html',
            value: `<span class="m2h-blockquote-icon" style="margin-right: 6px; font-style: normal; opacity: 0.85;">${escapeHtml(theme.blockquote.icon || '')}</span>`
          })
        }
      }
    })
  }

  // 5.2 Process Thematic Breaks (Dividers: solid, dashed, gradient, symbol)
  visit(mdast, 'thematicBreak', (node: any, index: number | undefined, parent: any) => {
    if (parent && typeof index === 'number') {
      let dividerHtml = ''
      if (dividerConfig.style === 'gradient') {
        dividerHtml = `<section class="m2h-divider-gradient" style="height: ${dividerConfig.height}; background: linear-gradient(to right, transparent, ${dividerConfig.color}, transparent); border: none; margin: ${dividerConfig.margin};"></section>`
      } else if (dividerConfig.style === 'symbol') {
        dividerHtml = `
          <section class="m2h-divider-symbol" style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: ${dividerConfig.margin}; color: ${dividerConfig.color}; font-size: 13px; font-weight: bold;">
            <span class="m2h-divider-symbol-line" style="flex: 1; height: 1px; background-color: ${dividerConfig.color}; opacity: 0.35;"></span>
            <span>${escapeHtml(dividerConfig.symbol || '✦ ✦ ✦')}</span>
            <span class="m2h-divider-symbol-line" style="flex: 1; height: 1px; background-color: ${dividerConfig.color}; opacity: 0.35;"></span>
          </section>
        `
      } else {
        const borderStyle = dividerConfig.style === 'dashed' ? 'dashed' : 'solid'
        dividerHtml = `<section class="m2h-divider" style="margin: ${dividerConfig.margin}; border: none; border-top: ${dividerConfig.height} ${borderStyle} ${dividerConfig.color};"></section>`
      }
      parent.children[index] = { type: 'html', value: dividerHtml }
    }
  })

  // 5.3 Process Images with Captions
  visit(mdast, 'image', (node: any, index: number | undefined, parent: any) => {
    if (parent && typeof index === 'number') {
      const alt = (node.alt || '').trim()
      const url = node.url || ''
      const captionHtml = (imageConfig.showCaption && alt)
        ? `<figcaption class="m2h-image-caption" style="font-size: ${imageConfig.captionFontSize}; color: ${imageConfig.captionColor}; text-align: center; margin-top: 8px; line-height: 1.5;">${escapeHtml(alt)}</figcaption>`
        : ''

      const imgCardHtml = `
        <figure class="m2h-image-card" style="text-align: center; margin: 20px 0;">
          <img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" class="m2h-img" style="max-width: 100%; height: auto; border-radius: ${imageConfig.borderRadius}; box-shadow: ${imageConfig.boxShadow}; border: ${imageConfig.border}; display: block; margin: 0 auto;" />
          ${captionHtml}
        </figure>
      `
      parent.children[index] = { type: 'html', value: imgCardHtml }
    }
  })

  // 5.4 Process External Links to Footnotes (Reference Links for WeChat)
  const collectedLinks: Array<{ index: number; text: string; url: string }> = []
  if (footnotesConfig.linkToFootnote) {
    visit(mdast, 'link', (node: any, index: number | undefined, parent: any) => {
      const url = (node.url || '').trim()
      if (url && !url.startsWith('#') && !url.startsWith('javascript:')) {
        let linkText = ''
        visit(node, 'text', (t: any) => { linkText += t.value || '' })
        linkText = linkText.trim() || url

        const refIdx = collectedLinks.length + 1
        collectedLinks.push({ index: refIdx, text: linkText, url })

        if (parent && typeof index === 'number') {
          parent.children[index] = {
            type: 'html',
            value: `<span class="m2h-link-text" style="color: ${theme.inline.linkColor}; text-decoration: ${theme.inline.linkUnderline};">${escapeHtml(linkText)}</span><sup class="m2h-footnote-ref" style="font-size: 11px; font-weight: bold; color: ${theme.inline.linkColor}; margin-left: 2px;">[${refIdx}]</sup>`
          }
        }
      }
    })
  }

  // 6. Process Code Blocks (Mermaid, output, and standard syntax highlighting)
  const codeNodes: Array<{ node: any; index: number; parent: any }> = []
  visit(mdast, 'code', (node: any, index: number | undefined, parent: any) => {
    if (parent && typeof index === 'number') {
      codeNodes.push({ node, index, parent })
    }
  })

  await Promise.all(
    codeNodes.map(async ({ node, index, parent }) => {
      const lang = (node.lang || '').trim().toLowerCase()
      const rawCode = node.value || ''

      // A: Mermaid Diagram -> Render to PNG Data URL Image
      if (lang === 'mermaid') {
        const pngDataUrl = await renderMermaidToPng(rawCode, String(index))
        const mermaidCardHtml = `
          <div class="mermaid-diagram-card" style="text-align: center; margin: 20px 0; overflow-x: auto;">
            <img src="${pngDataUrl}" alt="Mermaid Chart" style="max-width: 100%; height: auto; border-radius: 6px; display: block; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.08); background-color: #ffffff;" />
          </div>
        `
        parent.children[index] = {
          type: 'html',
          value: mermaidCardHtml
        }
        return
      }

      // B: Output execution block (Terminal card)
      if (lang === 'output') {
        const title = theme.outputBlock.title || 'OUTPUT / 执行结果'
        const prompt = theme.outputBlock.prefixPrompt ? `<span class="code-output-prompt">${theme.outputBlock.prefixPrompt} </span>` : ''

        let bodyHtml = ''
        if (theme.outputBlock.prefixPrompt) {
          const lines = rawCode.split('\n')
          bodyHtml = lines.map((line: string) => `${prompt}${escapeHtml(line)}`).join('\n')
        } else {
          bodyHtml = escapeHtml(rawCode)
        }

        // 图标用实心字符 ●，不能是空 <span> + 背景色：
        // 与 mac 圆点同因，微信编辑器会把空元素整颗剪掉。
        const terminalHeaderHtml = theme.outputBlock.showTerminalHeader
          ? `
          <section class="code-output-header">
            <section class="code-output-title-wrap">
              <span class="code-output-icon">●</span>
              <span class="code-output-title">${escapeHtml(title)}</span>
            </section>
            <span class="code-output-tag">STDOUT</span>
          </section>
          `
          : ''

        const cardHtml = `
        <section class="code-output-card">
          ${terminalHeaderHtml}
          <pre class="code-output-body"><code>${bodyHtml}</code></pre>
        </section>
        `

        parent.children[index] = {
          type: 'html',
          value: cardHtml
        }
        return
      }

      // C: Standard code block (Shiki syntax highlight + Mac window dots)
      let highlightedHtml = await highlightCode(
        rawCode,
        lang,
        theme.code.block.shikiTheme
      )

      if (theme.code.block.showLineNumbers) {
        highlightedHtml = injectLineNumbers(
          highlightedHtml,
          theme.code.block.lineNumberColor || 'rgba(148, 163, 184, 0.45)'
        )
      }

      // 圆点必须是「有内容的字符」，不能是空 <span> + 背景色：
      // 实测微信编辑器会把空元素整颗剪掉，三个点粘贴后一个不剩。
      const macDots = theme.code.block.showMacDots
        ? `
        <section class="code-block-mac-header">
          <section class="mac-dots">
            <span class="mac-dot ${theme.code.block.macDotsStyle === 'colored' ? 'mac-dot-red' : 'mac-dot-mono'}">●</span>
            <span class="mac-dot ${theme.code.block.macDotsStyle === 'colored' ? 'mac-dot-yellow' : 'mac-dot-mono'}">●</span>
            <span class="mac-dot ${theme.code.block.macDotsStyle === 'colored' ? 'mac-dot-green' : 'mac-dot-mono'}">●</span>
          </section>
          <span class="code-lang-badge">${escapeHtml(lang || 'code')}</span>
        </section>
        `
        : ''

      const wrappedHtml = `
      <section class="code-block-wrapper">
        ${macDots}
        ${highlightedHtml}
      </section>
      `

      parent.children[index] = {
        type: 'html',
        value: wrappedHtml
      }
    })
  )

  // 7. Rehype Pipeline: Tables, Headings ID, Task Lists, HTML Imgs
  const rehypeProcessor = unified()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(() => (tree: any) => {
      visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
        // Wrap tables
        if (node.tagName === 'table' && parent && typeof index === 'number') {
          if (!parent.properties?.className?.includes('m2h-table-wrapper')) {
            const wrapper = {
              type: 'element',
              tagName: 'div',
              properties: { className: ['m2h-table-wrapper'] },
              children: [node]
            }
            parent.children[index] = wrapper
          }
        }

        // 列表项里的裸文本包进 span：裸文本承载不了任何 inline style
        // （juice 只能把样式写进元素），li 自身的样式一旦在微信侧被丢，
        // 这段文字就完全不设防。空白节点原样保留，避免改变换行行为。
        if (node.tagName === 'li' && Array.isArray(node.children)) {
          node.children = node.children.flatMap((child: any) =>
            child.type === 'text' && child.value.trim()
              ? [
                  {
                    type: 'element',
                    tagName: 'span',
                    properties: { className: ['m2h-li-text'] },
                    children: [child]
                  }
                ]
              : [child]
          )
        }

        // Convert task list checkboxes to bulletproof unicode symbols for WeChat compatibility
        if (node.tagName === 'input' && node.properties?.type === 'checkbox') {
          const isChecked = Boolean(node.properties.checked)
          node.tagName = 'span'
          node.properties = {
            className: ['m2h-task-checkbox', isChecked ? 'task-checked' : 'task-unchecked'],
            style: `display: inline-block; margin-right: 6px; font-weight: bold; color: ${theme.inline.boldColor}; font-size: 14px;`
          }
          node.children = [{ type: 'text', value: isChecked ? '☑' : '☐' }]
        }

        // Handle <img> elements (including raw HTML like Typora style="zoom:50%", custom width, local image hints)
        if (node.tagName === 'img') {
          node.properties = node.properties || {}
          const existingClasses = Array.isArray(node.properties.className)
            ? node.properties.className
            : (node.properties.className ? [node.properties.className] : [])
          if (!existingClasses.includes('m2h-img')) {
            existingClasses.push('m2h-img')
          }
          node.properties.className = existingClasses

          let styleStr = typeof node.properties.style === 'string' ? node.properties.style : ''
          let customWidth = ''

          // Check for zoom in style, e.g. zoom: 50% or zoom: 0.5
          const zoomMatch = styleStr.match(/zoom\s*:\s*([\d.]+)%?/i)
          if (zoomMatch) {
            let val = parseFloat(zoomMatch[1])
            if (!zoomMatch[0].includes('%') && val <= 1) {
              val = Math.round(val * 100)
            }
            customWidth = `${val}%`
            styleStr = styleStr.replace(/zoom\s*:\s*[^;]+;?/gi, '').trim()
          }

          // Check if explicit width attribute exists on node
          if (!customWidth && node.properties.width) {
            const w = String(node.properties.width).trim()
            customWidth = w.endsWith('%') || w.endsWith('px') ? w : `${w}px`
          }

          const baseStyles = [
            `max-width: 100%`,
            `height: auto`,
            `border-radius: ${imageConfig.borderRadius}`,
            `box-shadow: ${imageConfig.boxShadow}`,
            `border: ${imageConfig.border}`,
            `display: block`,
            `margin: 16px auto`
          ]
          if (customWidth) {
            baseStyles.push(`width: ${customWidth}`)
          }
          if (styleStr) {
            baseStyles.push(styleStr)
          }
          node.properties.style = baseStyles.filter(Boolean).join('; ')

          // Check for relative local image paths (e.g. ./images/foo.png) and provide a helpful title
          const src = String(node.properties.src || '')
          if (src && (src.startsWith('./') || src.startsWith('../') || (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('data:') && !src.startsWith('/')))) {
            if (!node.properties.title) {
              node.properties.title = '提示: 此图片为本地相对路径，建议在左侧编辑器中直接粘贴截图或拖入图片转换为 Base64，以保证多端与公众号正常显示'
            }
          }
        }
      })
    })
    .use(rehypeStringify)

  const hast = await rehypeProcessor.run(mdast)
  const htmlResult = rehypeProcessor.stringify(hast)

  let footnotesHtml = ''
  if (collectedLinks.length > 0) {
    footnotesHtml = `
      <section class="m2h-footnotes" style="margin-top: 36px; padding-top: 18px; border-top: 1px dashed #cbd5e1; font-size: ${footnotesConfig.fontSize}; color: ${footnotesConfig.textColor};">
        <div class="m2h-footnotes-title" style="font-weight: bold; font-size: 14px; margin-bottom: 12px; color: ${theme.typography.color}; display: flex; align-items: center; gap: 6px;">
          <span>🔗</span>
          <span>${escapeHtml(footnotesConfig.title || '参考链接')}</span>
        </div>
        <ul class="m2h-footnotes-list" style="list-style: none; padding-left: 0; margin: 0;">
          ${collectedLinks.map(item => `
            <li class="m2h-footnotes-item" style="margin-bottom: 6px; line-height: 1.6; word-break: break-all;">
              <span style="font-weight: 600; color: ${theme.typography.color};">[${item.index}] ${escapeHtml(item.text)}: </span>
              <span style="color: ${footnotesConfig.textColor}; text-decoration: underline;">${escapeHtml(item.url)}</span>
            </li>
          `).join('')}
        </ul>
      </section>
    `
  }

  return htmlResult + footnotesHtml
}
