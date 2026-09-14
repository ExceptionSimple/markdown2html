# Markdown2HTML - 全平台富文本排版与多端仿真器

基于 **Electron + Vue 3 + TypeScript + Tailwind CSS** 打造的高性能 Markdown 转富文本桌面排版应用。专为微信公众号、知乎、语雀、掘金等平台的内容创作者与工程师设计。

## 🌟 核心特性

1. **多端真实视口外框仿真**：
   - **PC 宽屏阅读视图**：自适应或固定宽度，模拟桌面端沉浸阅读体验。
   - **小米 14 仿真器**：393px × 851px（20:9 直屏比例），精致金属倒角边框、居中单摄打孔屏、HyperOS 状态栏与手势条。
   - **iPhone 15/16 仿真器**：393px × 852px，钛金属质感直边圆角、交互式“灵动岛”（Dynamic Island）与 iOS 状态栏。
   - 支持视口实时缩放（100%、90%、80%、75%、60%、50%）。

2. **独创 `output` 程序输出代码块特化**：
   - 支持识别 ````output` 语言标识。
   - 自动特化渲染为“程序执行结果 / 控制台终端卡片”，包含专属终端标头条、状态小圆点、STDOUT 标签、独立终端配色底色与前缀提示符（`>` / `$` / `>>>`）。
   - 与普通语法高亮代码块显著区分，完美适配技术博主展示代码运行结果的场景。

3. **语法级精细化可视化主题定制**：
   - **覆盖维度**：
     - **版面字体**：字体族、正文字号、行高、段间距、字间距、色值、背景色、对齐方式。
     - **各级标题 (H1~H6)**：独立配置字号、字重、文字色、对齐、上/下间距、底边分割线、色块背景、**左侧修饰色条 (Prefix Bar)**。
     - **引用块 (Blockquote)**：左侧边框颜色与宽度、背景底色、文字颜色、圆角、内边距。
     - **表格与列表**：表头底色、表头字色、边框色、斑马纹奇偶底色、有序列表序号色、无序列表项目符号色。
     - **行内强调**：粗体颜色、斜体、高亮背景与字色 (`<mark>`)、超链接颜色与下划线。
     - **代码体系**：Shiki 语法高亮主题（GitHub Dark/Light, Tokyo Night, One Dark Pro）、Mac 风格红黄绿视窗圆点（彩色/单色）、行内代码样式。
     - **output 输出块专属定制**：终端标头文字、标头底色/字色、终端背景、荧光文字前景色、外边框与行前缀提示符。
   - **5 款内置精选预设**：
     - **微信雅致绿**：经典微信生态翠绿点缀，柔和护眼，呼吸感排版。
     - **经典学术蓝**：严谨海军蓝阶梯标题与经典排版，适合技术长文与论文报告。
     - **极客赛博夜**：暗黑基底与荧光终端霓虹色调，炫酷科技风。
     - **知乎现代蓝**：经典知乎蓝主调，清新明亮高可读性。
     - **暖阳活力橙**：温暖活力橙红，杂志感与现代设计风范。
   - **导入/导出/持久化**：
     - 支持主题配置一键导出为 `.json` 文件。
     - 支持从本地上传并导入自定义主题 JSON。
     - 自动持久化至本地存储，支持一键重置为预设初值。

4. **一键无损复制富文本 (Juice CSS Inliner)**：
   - 采用 `juice` 引擎将所有主题样式完全编译内联进每一个 HTML 节点的 `style="..."` 属性中。
   - 彻底避免微信公众号或第三方富文本编辑器剥离 `<style>` 标签的问题。
   - 写入剪贴板 `ClipboardItem` 混合包（`text/html` 和 `text/plain`），点击即可直接无损粘贴到微信公众号后台、知乎文章、语雀、掘金等平台！
   - 支持导出独立自包含的离线 `.html` 文件、导出 `.md` 文件及复制内联 HTML 源码。

---

## 🛠️ 项目结构

```
markdown2html/
├── electron/
│   ├── main.ts             # Electron 主进程 (窗口管理、原生系统交互)
│   └── preload.ts          # Electron 预加载脚本 (安全 contextBridge API)
├── src/
│   ├── components/
│   │   ├── devices/
│   │   │   ├── PcFrame.vue       # PC 宽屏及阅读视图仿真
│   │   │   ├── Xiaomi14Frame.vue # 小米 14 直屏金属外框与微孔单摄仿真
│   │   │   └── IphoneFrame.vue   # iPhone 灵动岛与 iOS 视口仿真
│   │   ├── settings/
│   │   │   └── ThemeDrawer.vue   # 细化到所有语法的抽屉式主题配置面板
│   │   ├── EditorPane.vue        # Markdown 源码编辑区与快捷排版工具条
│   │   ├── HeaderBar.vue         # 顶部操作栏 (主题切换、设备视口、缩放、一键复制)
│   │   ├── PreviewPane.vue       # 实时画板容器 (动态 CSS 注入与设备缩放)
│   │   └── Toast.vue             # 优雅的消息通知组件
│   ├── engine/
│   │   ├── cssGenerator.ts       # 主题配置编译为 CSS 规则字符串
│   │   ├── inliner.ts            # Juice 样式全内联化与独立 HTML 导出
│   │   ├── markdown.ts           # Unified/Remark/Rehype AST 解析与 output 块特化
│   │   └── shiki.ts              # Shiki 代码语法高亮引擎单例
│   ├── stores/
│   │   ├── editorStore.ts        # Markdown 内容管理与示例文档
│   │   ├── themeStore.ts         # 主题状态、响应式定制与 JSON 导入导出
│   │   └── viewportStore.ts      # 设备视图与缩放比例管理
│   ├── themes/
│   │   ├── presets/              # 5 款内置官方预设主题
│   │   └── types.ts              # 细化到每个语法的完整 TypeScript 接口模型
│   ├── App.vue                   # 主页面与双栏排版布局
│   ├── main.ts                   # Vue 3 应用挂载入口
│   └── style.css                 # Tailwind CSS 导入与滚动条样式
├── tests/
│   └── verify.ts                 # 自动化测试套件 (5 大测试组验证)
├── vite.config.ts                # Vite 与 Electron 双重支持配置
└── package.json
```

---

## 🚀 启动与运行

### 1. 启动 Web 开发预览模式
```bash
pnpm run dev
```
打开浏览器访问 `http://localhost:5173`。

### 2. 启动 Electron 桌面客户端原生模式
```bash
pnpm run electron:dev
```

### 3. 运行完整自动化测试套件
```bash
pnpm run test
```

### 4. 项目打包与构建
```bash
pnpm run build
```
