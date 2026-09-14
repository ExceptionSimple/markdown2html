import { defineStore } from 'pinia'
import { ref } from 'vue'

const TYPORA_COMPREHENSIVE_MARKDOWN = `# Markdown 全平台富文本排版神器

> 💡 本排版工具专为**微信公众号、知乎、语雀、掘金**等现代富文本生态深度定制。所有公式、图表、高亮与自定义样式均可在复制时**100% 编译为内联样式（Inline CSS）**或无损嵌入图片！

---

## 目录索引

[TOC]

---

# 一、核心扩展功能展示

## 1. 数学公式支持

在微信公众号与知乎排版中，数学公式一直是排版难点。本应用原生支持 **行内公式** 与 **块级公式**，并自动内联样式：

行内公式演示：根据爱因斯坦质能方程 $E = mc^2$，以及勾股定理 $a^2 + b^2 = c^2$，导数极限定义为 $\\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x) - f(x)}{\\Delta x}$。

块级微积分与矩阵公式演示：

$$
\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)
$$

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

$$
\\begin{pmatrix}
\\cos\\theta & -\\sin\\theta \\\\
\\sin\\theta & \\cos\\theta
\\end{pmatrix}
$$

---

## 2. Mermaid 图表（自动转图片无损嵌入微信）

本应用在导出和预览时，会自动将 Mermaid 流程图与时序图绘制到高分屏 Canvas，转换为 **PNG 高保真图片** 嵌入 HTML，确保微信后台 100% 完整显示！

\`\`\`mermaid
graph TD
    A[Markdown 输入] --> B{解析引擎}
    B -->|MathJax| C[公式内联]
    B -->|Mermaid| D[渲染为 PNG 图片]
    B -->|output| E[终端执行卡片]
    C --> F[Juice CSS 全内联]
    D --> F
    E --> F
    F --> G[一键无损粘贴至公众号]
\`\`\`

时序图演示：

\`\`\`mermaid
sequenceDiagram
    participant U as 创作者
    participant E as 排版神器
    participant W as 微信公众号
    U->>E: 输入 Markdown 源码
    E->>E: 语法高亮 + 公式 + 图表转图
    U->>E: 点击一键复制富文本
    E->>W: 写入 ClipboardItem (text/html)
    W-->>U: 100% 完美还原排版
\`\`\`

---

## 3. 程序输出代码块 (\`output\`) 专属特化

当代码块标注为 \`\`\`output 时，会自动渲染为逼真的“控制台终端输出”卡片，与普通代码块显著区隔：

\`\`\`python
def execute_benchmark():
    print("[RUN] Running speed benchmark...")
    return {"latency_ms": 12.4, "status": "SUCCESS"}

execute_benchmark()
\`\`\`

\`\`\`output
[2026-09-13 01:25:00] [INFO] Worker pool initialized with 8 threads.
[2026-09-13 01:25:01] [SUCCESS] All 1024 test cases passed (0 failed).
>> Benchmark Result: {"throughput_qps": 48200, "cache_hit_ratio": "99.4%"}
\`\`\`

---

## 4. Alert 提示引用卡片

GitHub 与 Typora 风格的 5 种精选提示框，已全面卡片化适配微信公众号：

> [!NOTE]
> **提示 (NOTE)**：这是一个提示信息，用于告知读者背景知识与补充说明。

> [!TIP]
> **技巧 (TIP)**：优先使用 375px 模拟器排版，这是微信公众号正文的事实标准宽度！

> [!WARNING]
> **警告 (WARNING)**：公众号后台不支持外链直接点击，建议文末引导“阅读原文”。

> [!IMPORTANT]
> **重要 (IMPORTANT)**：微信公众号不支持外部样式表，所有样式必须通过 Juice 编译为内联样式。

> [!CAUTION]
> **注意 (CAUTION)**：不要直接复制未内联样式的纯 HTML，否则粘贴到公众号后样式将被全部剥离。

---

# 二、基础与 GFM 语法全面覆盖

## 1. 复杂表格与斑马纹

| 技术框架 | 核心角色 | 优势特性 | 兼容表现 |
| :--- | :---: | :--- | ---: |
| **Vue 3 + TS** | 前端界面驱动 | 响应式状态流、高性能渲染 | 极佳 |
| **MathJax** | 数学公式引擎 | 输出自包含 SVG、无外部字体依赖 | 100% |
| **Mermaid** | 矢量图表库 | 自动导出高清 PNG 嵌入 | 微信完美 |
| **Juice** | CSS 内联器 | 样式打入每个标签 style | 免剥离 |

---

## 2. 文本修饰与 Typora 特色语法

- **粗体强调**、*斜体文字*、~~删除线文本~~
- **文本高亮**：==这是使用双等号的高亮文本==，也可以使用 <mark>HTML 原生 mark 标签</mark>
- **上下标**：水分子式 H~2~O，爱因斯坦方程 E = mc^2^
- **按键提示**：按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 快速复制富文本
- **下划线**：<u>这是带下划线的重点内容</u>
- **任务清单**：
  - [x] 375px（iPhone 微信基准）、360px（安卓基准）、414px（大屏）视口仿真
  - [x] MathJax 数学公式渲染（行内与块级，输出自包含 SVG）
  - [x] Mermaid 图表转 PNG 图片嵌入
  - [x] 智能目录 [TOC] 支持无前缀/数字/中文章节
  - [x] 颜色支持透明色与组件级自定义 CSS
  - [x] 主题定制抽屉放置于左侧
`

export const useEditorStore = defineStore('editor', () => {
  const markdown = ref<string>(localStorage.getItem('m2h_markdown_content') || TYPORA_COMPREHENSIVE_MARKDOWN)
  const isRendering = ref<boolean>(false)

  function updateMarkdown(content: string) {
    markdown.value = content
    try {
      localStorage.setItem('m2h_markdown_content', content)
    } catch (e) {
      console.error('Failed to save markdown content:', e)
    }
  }

  function resetToDefault() {
    updateMarkdown(TYPORA_COMPREHENSIVE_MARKDOWN)
  }

  return {
    markdown,
    isRendering,
    updateMarkdown,
    resetToDefault
  }
})
