// 用 MathJax 把 TeX 渲染成自包含的 <svg>。
//
// 为什么换掉 KaTeX：KaTeX 只输出 HTML + CSS，公式形状依赖 60 个外部字体文件，
// 微信编辑器会丢掉那套 CSS，公式就散成乱码。MathJax 的 SVG 输出把字形路径直接
// 写进标签里，不依赖任何外部资源，实测粘贴到公众号后显示正常。
//
// 只用 tex-svg.js 这个自包含包。tex-svg-nofont.js 的名字容易误解：它省掉的正是
// 字体数据，运行期会去 jsdelivr 拉 @mathjax/mathjax-newcm-font，离线直接挂。

const SVG_OPTIONS = {
  // 'none' 把字形路径展开进每个公式，不带 <defs>/<use>。
  // 实测微信编辑器会拆掉 SVG 内部的 <defs>/<use>，粘贴后公式整块消失。
  fontCache: 'none',
  // 不自动换行。否则一个公式会被切成多个 <svg>，中间夹 <mjx-break>。
  linebreaks: false
}

type MathJaxLike = {
  tex2svg?(tex: string, options: { display: boolean }): unknown
  tex2svgPromise?(tex: string, options: { display: boolean }): Promise<unknown>
  startup: { adaptor: { outerHTML(node: unknown): string }; promise: Promise<void> }
}

let ready: Promise<MathJaxLike> | null = null

function loadMathJax(): Promise<MathJaxLike> {
  if (!ready) {
    ready = typeof window === 'undefined' ? loadInNode() : loadInBrowser()
  }
  return ready
}

// 浏览器：自包含 IIFE 包，靠 window.MathJax 读配置
async function loadInBrowser(): Promise<MathJaxLike> {
  // bundle 求值时会读 window.MathJax，配置必须先挂上去
  ;(window as any).MathJax = {
    // 不扫描文档，我们只调 tex2svg 单点渲染
    startup: { typeset: false },
    options: {
      // tex-svg 组合包 preload 了无障碍语音引擎 a11y/sre，它会起一个 Worker
      // 去页面基址拉 sre/speech-worker.js——Vite 下没这个文件，会一直报 404。
      // 文档要求这三个开关一起关；只关前两个不够，菜单的 enrich 默认还会拉。
      enableSpeech: false,
      enableBraille: false,
      menuOptions: { settings: { enrich: false } }
    },
    svg: SVG_OPTIONS
  }
  await import('mathjax/tex-svg.js')
  const mj = (window as any).MathJax as MathJaxLike
  await mj.startup.promise
  return mj
}

// Node（tests/verify.ts）：浏览器包需要 DOM，这里走 mathjax 的 node 入口。
// 模块名写成变量是故意的：写成字面量 Vite 会顺着它把依赖 fs 的 node 入口打进浏览器包。
async function loadInNode(): Promise<MathJaxLike> {
  const entry = 'mathjax'
  const { init } = (await import(/* @vite-ignore */ entry)) as any
  return init({ loader: { load: ['input/tex', 'output/svg'] }, svg: SVG_OPTIONS })
}

// 剥掉 MathJax 的 <mjx-container> 外壳：它带的 tabindex、右键菜单标记对微信没有意义
function stripContainer(html: string): string {
  return html.replace(/^<mjx-container[^>]*>/, '').replace(/<\/mjx-container>\s*$/, '')
}

// 把额外样式合进 <svg> 根节点的 style 属性。
//
// 必须写成行内 style，不能靠 CSS 规则：Tailwind 的 preflight 里有
// `img, svg, video, canvas, audio, iframe, embed, object { display: block }`，
// 会把行内公式整块挤到单独一行；行内样式优先级更高，能盖住它。
function patchSvgStyle(svg: string, extra: string): string {
  const open = /^<svg[^>]*>/.exec(svg)?.[0]
  if (!open) return svg
  const patched = open.includes('style="')
    ? open.replace('style="', `style="${extra}`)
    : open.replace('<svg', `<svg style="${extra.replace(/;$/, '')}"`)
  return patched + svg.slice(open.length)
}

export async function renderMathToSvg(tex: string, display: boolean): Promise<string> {
  const mj = await loadMathJax()
  // node 入口给的是同步 tex2svg，浏览器包给的是 tex2svgPromise
  const node = mj.tex2svgPromise
    ? await mj.tex2svgPromise(tex, { display })
    : mj.tex2svg!(tex, { display })
  const svg = stripContainer(mj.startup.adaptor.outerHTML(node))
  // 块级公式：宽公式在公众号正文（窄屏约 375px）里会溢出，按 viewBox 等比缩到容器宽度
  return display ? patchSvgStyle(svg, 'display:block;margin:0 auto;max-width:100%;height:auto;') : patchSvgStyle(svg, 'display:inline;')
}
