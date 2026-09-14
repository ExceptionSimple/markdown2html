import type { ThemeConfig, HeadingStyle } from '../themes/types'

function generateHeadingCss(selector: string, h: HeadingStyle): string {
  const rules: string[] = [
    `font-size: ${h.fontSize};`,
    `font-weight: ${h.fontWeight};`,
    `color: ${h.color};`,
    `text-align: ${h.textAlign};`,
    `margin-top: ${h.marginTop};`,
    `margin-bottom: ${h.marginBottom};`,
    `line-height: 1.35;`
  ]

  if (h.borderBottom && h.borderBottom !== 'none') {
    rules.push(`border-bottom: ${h.borderBottom};`)
  }
  if (h.backgroundColor) {
    rules.push(`background-color: ${h.backgroundColor};`)
  }
  if (h.padding) {
    rules.push(`padding: ${h.padding};`)
  }
  if (h.borderRadius) {
    rules.push(`border-radius: ${h.borderRadius};`)
  }
  if (h.prefixBar?.enabled) {
    rules.push(`border-left: ${h.prefixBar.width} solid ${h.prefixBar.color};`)
    rules.push(`padding-left: 10px;`)
    if (h.prefixBar.radius) {
      rules.push(`border-top-left-radius: ${h.prefixBar.radius};`)
      rules.push(`border-bottom-left-radius: ${h.prefixBar.radius};`)
    }
  }
  if (h.customCss) {
    rules.push(h.customCss.trim())
  }

  return `${selector} {\n  ${rules.join('\n  ')}\n}`
}

// 微信编辑器只认十六进制实色，rgba() 背景会被整条过滤掉。
// 这里把半透明叠加色预先合成到实色底上，保证粘贴后背景不丢。
function mixHex(base: string, overlay: string, alpha: number): string {
  const rgb = (c: string): number[] | null => {
    const h = c.trim().replace('#', '')
    const full = h.length === 3 ? h.replace(/./g, '$&$&') : h
    if (!/^[0-9a-f]{6}$/i.test(full)) return null
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
  }
  const b = rgb(base)
  const o = rgb(overlay)
  if (!b || !o) return base // 解析失败时原样返回，避免拼出非法值
  return (
    '#' +
    b
      .map((v, i) => Math.round(v + (o[i] - v) * alpha).toString(16).padStart(2, '0'))
      .join('')
  )
}

export function generateThemeCss(theme: ThemeConfig, scopeClass = '.m2h-content'): string {
  const { typography, headings, blockquote, table, list, inline, code, outputBlock } = theme
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
    borderRadius: '8px',
    customCss: ''
  }
  const alerts = theme.alerts || {
    noteColor: '#3b82f6',
    tipColor: '#10b981',
    warningColor: '#f59e0b',
    importantColor: '#8b5cf6',
    cautionColor: '#ef4444',
    borderRadius: '8px',
    customCss: ''
  }
  const image = theme.image || {
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: 'none',
    showCaption: true,
    captionColor: '#6b7280',
    captionFontSize: '12px',
    customCss: ''
  }
  const divider = theme.divider || {
    style: 'symbol',
    color: '#cbd5e1',
    height: '1px',
    margin: '28px 0',
    symbol: '✦ ✦ ✦',
    customCss: ''
  }
  const footnotes = theme.footnotes || {
    linkToFootnote: true,
    title: '参考链接',
    fontSize: '12px',
    textColor: '#6b7280',
    customCss: ''
  }

  // 预合成微信不支持的 rgba 半透明色（mac 顶栏及其分隔线、单色圆点、STDOUT 标签）
  const codeHeaderBg = mixHex(code.block.backgroundColor, '#000000', 0.18)
  const codeHeaderBorder = mixHex(codeHeaderBg, '#ffffff', 0.08)
  const codeDotMono = mixHex(codeHeaderBg, '#ffffff', 0.25)
  const outputTagBg = mixHex(outputBlock.headerBackground, '#ffffff', 0.1)

  return `
/* === Markdown Typography & Layout === */
${scopeClass} {
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize};
  line-height: ${typography.lineHeight};
  color: ${typography.color};
  background-color: ${typography.backgroundColor};
  letter-spacing: ${typography.letterSpacing};
  text-align: ${typography.textAlign};
  word-break: break-word;
  overflow-wrap: break-word;
  ${typography.customCss || ''}
}

${scopeClass} p {
  margin-top: 0;
  margin-bottom: ${typography.paragraphMargin};
  line-height: ${typography.lineHeight};
  text-indent: ${typography.textIndent || '0'};
  text-align: ${typography.textAlign || 'justify'};
}

/* === Headings === */
${generateHeadingCss(`${scopeClass} h1`, headings.h1)}
${generateHeadingCss(`${scopeClass} h2`, headings.h2)}
${generateHeadingCss(`${scopeClass} h3`, headings.h3)}
${generateHeadingCss(`${scopeClass} h4`, headings.h4)}
${generateHeadingCss(`${scopeClass} h5`, headings.h5)}
${generateHeadingCss(`${scopeClass} h6`, headings.h6)}

/* === Blockquote === */
${scopeClass} blockquote {
  border-left: ${blockquote.borderLeftWidth} solid ${blockquote.borderLeftColor};
  background-color: ${blockquote.backgroundColor};
  color: ${blockquote.color};
  padding: ${blockquote.padding};
  border-radius: ${blockquote.borderRadius};
  margin: ${blockquote.margin};
  font-style: ${blockquote.fontStyle};
  ${blockquote.customCss || ''}
}

${scopeClass} blockquote p {
  margin-bottom: 0;
}

${scopeClass} blockquote p:not(:last-child) {
  margin-bottom: 8px;
}

/* === Table === */
${scopeClass} .m2h-table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin: 18px 0;
}

${scopeClass} table {
  width: 100%;
  border-collapse: collapse;
  font-size: ${table.fontSize};
  border: ${table.borderWidth} solid ${table.borderColor};
  background-color: #ffffff;
  border-radius: ${table.borderRadius || '6px'};
  box-shadow: ${table.boxShadow || 'none'};
  overflow: hidden;
  ${table.customCss || ''}
}

${scopeClass} th {
  background-color: ${table.headerBackground};
  color: ${table.headerColor};
  font-weight: 600;
  padding: ${table.cellPadding};
  border: ${table.borderWidth} solid ${table.borderColor};
  text-align: left;
}

${scopeClass} td {
  padding: ${table.cellPadding};
  border: ${table.borderWidth} solid ${table.borderColor};
}

${scopeClass} tr:nth-child(even) td {
  background-color: ${table.zebraBackground};
}

/* === List === */
${scopeClass} ul {
  list-style: disc;
  list-style-type: disc;
  padding-left: ${list.paddingLeft};
  margin-top: 8px;
  margin-bottom: 14px;
  ${list.customCss || ''}
}

${scopeClass} ul ul {
  list-style: circle;
  list-style-type: circle;
}

${scopeClass} ul ul ul {
  list-style: square;
  list-style-type: square;
}

${scopeClass} ol {
  list-style: decimal;
  list-style-type: decimal;
  padding-left: ${list.paddingLeft};
  margin-top: 8px;
  margin-bottom: 14px;
  ${list.customCss || ''}
}

${scopeClass} ol ol {
  list-style: lower-alpha;
  list-style-type: lower-alpha;
}

${scopeClass} ol ol ol {
  list-style: lower-roman;
  list-style-type: lower-roman;
}

${scopeClass} li {
  margin-bottom: ${list.itemSpacing};
  line-height: ${typography.lineHeight};
}

${scopeClass} ul > li {
  list-style: disc;
  list-style-type: disc;
}

${scopeClass} ul ul > li {
  list-style: circle;
  list-style-type: circle;
}

${scopeClass} ul ul ul > li {
  list-style: square;
  list-style-type: square;
}

${scopeClass} ol > li {
  list-style: decimal;
  list-style-type: decimal;
}

${scopeClass} ol ol > li {
  list-style: lower-alpha;
  list-style-type: lower-alpha;
}

${scopeClass} ol ol ol > li {
  list-style: lower-roman;
  list-style-type: lower-roman;
}

${scopeClass} li p {
  text-indent: 0 !important;
  margin-top: 0;
  margin-bottom: 4px;
}

${scopeClass} ol > li::marker {
  color: ${list.orderedColor};
  font-weight: 600;
}

${scopeClass} ul > li::marker {
  color: ${list.unorderedBulletColor};
}

${scopeClass} li.task-list-item {
  list-style: none !important;
  list-style-type: none !important;
  margin-left: -18px;
}

/* === Inline Elements === */
${scopeClass} strong, ${scopeClass} b {
  color: ${inline.boldColor};
  font-weight: 700;
}

${scopeClass} em, ${scopeClass} i {
  color: ${inline.italicColor};
}

${scopeClass} del, ${scopeClass} s {
  color: ${inline.strikeColor || '#9ca3af'};
  text-decoration: line-through;
}

${scopeClass} mark {
  background-color: ${inline.markBackground};
  color: ${inline.markColor};
  padding: 2px 5px;
  border-radius: 3px;
}

${scopeClass} a {
  color: ${inline.linkColor};
  text-decoration: ${inline.linkUnderline};
  word-break: break-all;
}

/* === Dividers === */
${scopeClass} hr, ${scopeClass} .m2h-divider {
  border: none;
  border-top: ${divider.height} ${divider.style === 'dashed' ? 'dashed' : 'solid'} ${divider.color};
  margin: ${divider.margin};
  ${divider.customCss || ''}
}

${scopeClass} .m2h-divider-gradient {
  height: ${divider.height};
  background: linear-gradient(to right, transparent, ${divider.color}, transparent);
  border: none;
  margin: ${divider.margin};
  ${divider.customCss || ''}
}

${scopeClass} .m2h-divider-symbol {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: ${divider.margin};
  color: ${divider.color};
  font-size: 13px;
  font-weight: bold;
  ${divider.customCss || ''}
}

${scopeClass} .m2h-divider-symbol-line {
  flex: 1;
  height: 1px;
  background-color: ${divider.color};
  opacity: 0.35;
}

/* === Images & Captions === */
${scopeClass} .m2h-image-card {
  text-align: center;
  margin: 20px 0;
  ${image.customCss || ''}
}

${scopeClass} img, ${scopeClass} .m2h-img {
  max-width: 100%;
  height: auto;
  border-radius: ${image.borderRadius};
  box-shadow: ${image.boxShadow};
  border: ${image.border};
  margin: 14px auto;
  display: block;
}

${scopeClass} .m2h-image-caption {
  font-size: ${image.captionFontSize};
  color: ${image.captionColor};
  text-align: center;
  margin-top: 8px;
  line-height: 1.5;
}

/* === Footnotes & Reference Links === */
${scopeClass} .m2h-footnotes {
  margin-top: 36px;
  padding-top: 18px;
  border-top: 1px dashed #cbd5e1;
  font-size: ${footnotes.fontSize};
  color: ${footnotes.textColor};
  ${footnotes.customCss || ''}
}

${scopeClass} .m2h-footnotes-title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 12px;
  color: ${typography.color};
  display: flex;
  align-items: center;
  gap: 6px;
}

${scopeClass} .m2h-footnote-ref {
  font-size: 11px;
  font-weight: bold;
  color: ${inline.linkColor};
  margin-left: 2px;
  vertical-align: super;
}

${scopeClass} .m2h-footnotes-list {
  list-style: none !important;
  list-style-type: none !important;
  padding-left: 0;
  margin: 0;
}

${scopeClass} .m2h-footnotes-item {
  list-style: none !important;
  list-style-type: none !important;
  margin-bottom: 6px;
  line-height: 1.6;
  word-break: break-all;
}

${scopeClass} kbd, ${scopeClass} .m2h-kbd {
  display: inline-block;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.4;
  color: ${inline.kbd?.textColor || '#334155'};
  background-color: ${inline.kbd?.backgroundColor || '#f1f5f9'};
  border: 1px solid ${inline.kbd?.borderColor || '#cbd5e1'};
  border-bottom: 2px solid ${inline.kbd?.borderColor || '#94a3b8'};
  border-radius: 4px;
}

${scopeClass} u {
  text-decoration: underline;
  text-underline-offset: 3px;
}

${scopeClass} sub, ${scopeClass} sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
${scopeClass} sup { top: -0.5em; }
${scopeClass} sub { bottom: -0.25em; }

/* === Inline Code === */
${scopeClass} :not(pre) > code {
  color: ${code.inline.color};
  background-color: ${code.inline.backgroundColor};
  font-size: ${code.inline.fontSize};
  border-radius: ${code.inline.borderRadius};
  padding: ${code.inline.padding};
  font-family: ${code.inline.fontFamily};
  word-break: break-word;
  ${code.inline.customCss || ''}
}

/* === Standard Code Block === */
${scopeClass} .code-block-wrapper {
  margin: 16px 0;
  border-radius: ${code.block.borderRadius};
  overflow: hidden;
  background-color: ${code.block.backgroundColor};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  ${code.block.customCss || ''}
}

/* 微信编辑器不保留 display:flex，顶栏改用 inline-block + float 布局 */
${scopeClass} .code-block-mac-header {
  display: block;
  padding: 8px 14px;
  background-color: ${codeHeaderBg};
  border-bottom: 1px solid ${codeHeaderBorder};
}

${scopeClass} .mac-dots {
  display: inline-block;
  vertical-align: middle;
}

/* 圆点由实心字符 ● 画出，不再用「空元素 + 背景色」。
   微信编辑器会剪掉空元素（三个点整颗消失）；而 width / height / 背景色 /
   border-radius 都在它的白名单之外，堆五个样式去撑一个装饰性圆点不可靠。
   字符方案只依赖 color 与 font-size，二者都是实测能存活的属性。 */
${scopeClass} .mac-dot {
  font-size: 16px;
  line-height: 1;
  margin-right: 4px;
}

${scopeClass} .mac-dot-red { color: #ff5f56; }
${scopeClass} .mac-dot-yellow { color: #ffbd2e; }
${scopeClass} .mac-dot-green { color: #27c93f; }
${scopeClass} .mac-dot-mono { color: ${codeDotMono}; }

${scopeClass} .code-lang-badge {
  float: right;
  line-height: 10px;
  font-size: 11px;
  font-family: ${code.block.fontFamily};
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
}

${scopeClass} pre.shiki {
  margin: 0 !important;
  padding: ${code.block.padding} !important;
  font-size: ${code.block.fontSize} !important;
  line-height: ${code.block.lineHeight} !important;
  font-family: ${code.block.fontFamily} !important;
  overflow-x: auto !important;
  /* 背景交给外层 .code-block-wrapper：微信会丢弃 overflow:hidden，
     若 pre 再自画一层方角背景，wrapper 的圆角就会被盖掉 */
  background-color: transparent !important;
}

${scopeClass} pre.shiki code {
  font-family: inherit !important;
  font-size: inherit !important;
  background-color: transparent !important;
  padding: 0 !important;
}

${scopeClass} .m2h-line-number {
  display: inline-block;
  user-select: none;
  -webkit-user-select: none;
  font-family: inherit;
  font-size: inherit;
  text-align: right;
}

/* === Specialized Output Code Block === */
${scopeClass} .code-output-card {
  margin: 18px 0;
  background-color: ${outputBlock.backgroundColor};
  border: ${outputBlock.borderWidth} solid ${outputBlock.borderColor};
  border-radius: ${outputBlock.borderRadius};
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  ${outputBlock.customCss || ''}
}

/* 微信编辑器不保留 display:flex，改用 block + inline-block + float */
${scopeClass} .code-output-header {
  display: block;
  background-color: ${outputBlock.headerBackground};
  color: ${outputBlock.headerColor};
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  border-bottom: 1px solid ${outputBlock.borderColor};
  letter-spacing: 0.5px;
}

${scopeClass} .code-output-title-wrap {
  display: inline-block;
  vertical-align: middle;
}

/* 与 mac 圆点同因：空元素被微信剪掉，图标改用实心字符 ● 画出。
   代价是丢掉原来的 box-shadow 光晕——它本就不在微信白名单里，粘贴后也留不下。 */
${scopeClass} .code-output-icon {
  font-size: 15px;
  line-height: 1;
  vertical-align: middle;
  margin-right: 7px;
  color: ${outputBlock.textColor};
}

${scopeClass} .code-output-title {
  font-family: ${outputBlock.fontFamily};
  font-size: 12px;
  font-weight: 600;
}

${scopeClass} .code-output-tag {
  float: right;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${outputTagBg};
  color: ${outputBlock.headerColor};
  font-family: ${outputBlock.fontFamily};
}

${scopeClass} .code-output-body {
  margin: 0;
  padding: ${outputBlock.padding};
  background-color: ${outputBlock.backgroundColor};
  color: ${outputBlock.textColor};
  font-size: ${outputBlock.fontSize};
  line-height: ${outputBlock.lineHeight};
  font-family: ${outputBlock.fontFamily};
  white-space: pre-wrap;
  word-break: break-all;
  overflow-x: auto;
}

${scopeClass} .code-output-prompt {
  color: rgba(255, 255, 255, 0.4);
  user-select: none;
  margin-right: 6px;
}

/* === Math Formulas (MathJax SVG) === */
/* 公式是自包含的 <svg>，图形靠 currentColor 跟随正文颜色，这里只负责排版间距 */
${scopeClass} .m2h-math-block {
  margin: 18px 0;
  text-align: center;
}

${scopeClass} .m2h-math-inline {
  padding: 0 2px;
}

/* === TOC Card & Links === */
${scopeClass} .m2h-toc-card {
  background-color: ${toc.backgroundColor};
  border: 1px solid ${toc.borderColor};
  border-left: 4px solid ${toc.accentColor};
  border-radius: ${toc.borderRadius};
  padding: 14px 18px;
  margin: 20px 0;
  ${toc.customCss || ''}
}

${scopeClass} .m2h-toc-list {
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
  list-style-type: none !important;
}

${scopeClass} .m2h-toc-list li {
  list-style: none !important;
  list-style-type: none !important;
}

/* 目录项不再是链接：微信正文不支持页内锚点跳转——它只认自家编辑器的标题样式，
   而我们把 h1~h6 降级成了 <section role="heading">，微信那边压根看不到标题。
   带 href 的目录项粘过去只会变成一个带域名、永远点不动的链接（域名由接收方
   解析相对 URL 时补全），所以这里直接不给 href。详情见 walkthrough 第 27 节。
   类名保留 m2h-toc-link 不重命名：用户的自定义 CSS 可能已经引用它。 */

/* === Alerts / Callouts === */
${scopeClass} .m2h-alert-card {
  margin: 18px 0;
  border-radius: ${alerts.borderRadius};
  ${alerts.customCss || ''}
}

/* === Mermaid Diagram Card === */
${scopeClass} .mermaid-diagram-card {
  text-align: center;
  margin: 20px 0;
  overflow-x: auto;
}
`
}
