<template>
  <div
    v-if="isOpen"
    class="theme-customization-drawer fixed inset-y-0 left-0 w-full max-w-[500px] bg-slate-900 border-r-[5px] border-slate-800 shadow-2xl z-50 flex flex-col transition-all duration-300 select-none"
    style="max-width: 500px; border-right-width: 5px;"
  >
    <!-- Drawer Header -->
    <div class="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 backdrop-blur-md">
      <div class="flex items-center gap-2.5">
        <Sliders class="w-5 h-5 text-emerald-400" />
        <div>
          <h2 class="text-sm font-bold text-slate-100">精细化主题定制</h2>
          <p class="text-2xs text-slate-400">使用 Tab 标签卡分类定制各项排版规则</p>
        </div>
      </div>
      <button
        @click="$emit('close')"
        class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Category Groups (Top Level Category Tabs) -->
    <div class="theme-drawer-tabs px-3 py-2 border-b border-slate-800 bg-slate-950/80 flex items-center gap-1 overflow-x-auto text-xs" style="scrollbar-width: auto;">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectCategory(cat.id)"
        class="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-2xs font-medium whitespace-nowrap transition-all cursor-pointer"
        :class="activeCategory === cat.id ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
      >
        <component :is="cat.icon" class="w-3 h-3" />
        <span>{{ cat.label }}</span>
      </button>
    </div>

    <!-- Component Tab Cards (Second Level Tab Cards) -->
    <div class="theme-drawer-tabs px-3 py-2 border-b border-slate-800/80 bg-slate-900/90 flex items-center gap-1.5 overflow-x-auto text-xs" style="scrollbar-width: auto;">
      <button
        v-for="tab in visibleTabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer border"
        :class="activeTab === tab.id
          ? 'bg-slate-800 text-emerald-400 border-emerald-500/50 shadow-md shadow-emerald-950/40'
          : 'bg-slate-800/40 text-slate-400 border-slate-700/50 hover:text-slate-200 hover:bg-slate-800'"
      >
        <component :is="tab.icon" class="w-3.5 h-3.5" :class="activeTab === tab.id ? 'text-emerald-400' : 'text-slate-400'" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Scrollable Tab Content -->
    <div class="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-200">
      <!-- 1. 基础排版 (Typography) -->
      <div v-if="activeTab === 'typography'" class="space-y-4">
        <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Type class="w-4 h-4" />
          <span>全局版式与字体</span>
        </h3>

        <div class="space-y-1.5">
          <label class="text-slate-400 font-medium">基准字体族 (Font Family)</label>
          <select
            v-model="theme.typography.fontFamily"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
          >
            <option value='-apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'>默认无衬线 (PingFang / Microsoft YaHei)</option>
            <option value='"Noto Serif SC", "Source Han Serif SC", Georgia, "Times New Roman", SimSun, serif'>经典衬线体 (Noto Serif / 宋体)</option>
            <option value='"JetBrains Mono", "Fira Code", Consolas, monospace'>科技等宽体 (JetBrains Mono / 代码风)</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-slate-400 font-medium">正文字号</label>
            <input
              type="text"
              v-model="theme.typography.fontSize"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs"
              placeholder="15px"
            />
          </div>
          <div class="space-y-1">
            <label class="text-slate-400 font-medium">行高 (Line Height)</label>
            <input
              type="text"
              v-model="theme.typography.lineHeight"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs"
              placeholder="1.75"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-slate-400 font-medium">段间距 (Margin Bottom)</label>
            <input
              type="text"
              v-model="theme.typography.paragraphMargin"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs"
              placeholder="16px"
            />
          </div>
          <div class="space-y-1">
            <label class="text-slate-400 font-medium">字间距 (Letter Spacing)</label>
            <input
              type="text"
              v-model="theme.typography.letterSpacing"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs"
              placeholder="0.5px"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-slate-400 font-medium">首行缩进 (Text Indent)</label>
            <select
              v-model="theme.typography.textIndent"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="0">无缩进 (0)</option>
              <option value="2em">首行空两格 (2em 中文标准)</option>
              <option value="1em">轻度缩进 (1em)</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-slate-400 font-medium">段落对齐 (Text Align)</label>
            <select
              v-model="theme.typography.textAlign"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="justify">两端对齐 (公众号推荐)</option>
              <option value="left">左对齐 (居左)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <ColorInput
            label="正文文字颜色"
            v-model="theme.typography.color"
            allow-transparent
          />
          <ColorInput
            label="全局背景底色"
            v-model="theme.typography.backgroundColor"
            allow-transparent
          />
        </div>

        <!-- Typography Custom CSS -->
        <div class="pt-2 border-t border-slate-800 space-y-1.5">
          <label class="text-slate-400 font-medium flex items-center justify-between">
            <span>正文段落自定义 CSS 规则</span>
            <span class="text-2xs text-slate-500">内联至 p 标签</span>
          </label>
          <textarea
            v-model="theme.typography.customCss"
            rows="2"
            class="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="例如: text-shadow: 0 1px 2px rgba(0,0,0,0.1);"
          ></textarea>
        </div>
      </div>

      <!-- 2. 各级标题 (Headings) -->
      <div v-if="activeTab === 'headings'" class="space-y-4">
        <!-- Global Heading Numbering & Icon Prefix -->
        <div class="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs font-semibold text-slate-200">正文标题自动编号</div>
              <div class="text-2xs text-slate-400">对正文各级标题生成统一层级编号</div>
            </div>
            <select
              v-model="theme.headings.bodyNumbering"
              class="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="none">无编号 (默认)</option>
              <option value="number">数字层级编号 (1. / 1.1 / 1.1.1)</option>
              <option value="chapter">中文章节编号 (第一章, 1.1, 1.2...)</option>
            </select>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-700/60">
            <div>
              <div class="text-xs font-semibold text-slate-200">标题前缀图标</div>
              <div class="text-2xs text-slate-400">统一前置 Emoji 或符号</div>
            </div>
            <input
              type="text"
              v-model="theme.headings.iconPrefix"
              placeholder="例如 ✦  或 📌  或 留空"
              class="w-36 bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-right"
            />
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-700/60">
            <div>
              <div class="text-xs font-semibold text-slate-200">文首 H1 视为主标题</div>
              <div class="text-2xs text-slate-400">若文首存在单个 H1 则视作文章总标题，正文从 H2 开始作为第一章</div>
            </div>
            <input
              type="checkbox"
              v-model="theme.headings.treatFirstH1AsTitle"
              class="accent-emerald-500 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Heading class="w-4 h-4" />
            <span>各级标题定制 (H1 ~ H6)</span>
          </h3>
          <!-- Level selector -->
          <div class="flex gap-1 bg-slate-800 p-1 rounded-lg">
            <button
              v-for="lvl in (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const)"
              :key="lvl"
              @click="selectedHeadingLevel = lvl"
              class="px-2.5 py-1 rounded text-2xs font-bold uppercase transition-all cursor-pointer"
              :class="selectedHeadingLevel === lvl ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'"
            >
              {{ lvl }}
            </button>
          </div>
        </div>

        <div class="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-3.5">
          <div class="text-xs font-semibold text-slate-300 border-b border-slate-700 pb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span>当前正在配置:</span>
              <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs uppercase">{{ selectedHeadingLevel }}</span>
              <span class="text-2xs text-slate-400 font-normal">
                {{ selectedHeadingLevel === 'h2' ? '（公众号主要大标题 · 推荐）' : selectedHeadingLevel === 'h3' ? '（公众号常用小标题）' : selectedHeadingLevel === 'h1' ? '（文首文章总标题 / 独立大章）' : '（分支标题）' }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-slate-400">标题字号</label>
              <input type="text" v-model="currentHeading.fontSize" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs" />
            </div>
            <div class="space-y-1">
              <label class="text-slate-400">字重 (Font Weight)</label>
              <select v-model="currentHeading.fontWeight" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs">
                <option value="400">400 (常规)</option>
                <option value="600">600 (半粗)</option>
                <option value="700">700 (粗体)</option>
                <option value="800">800 (特粗)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <ColorInput
              label="文字颜色"
              v-model="currentHeading.color"
              allow-transparent
            />
            <div class="space-y-1">
              <label class="text-slate-400">对齐方式</label>
              <select v-model="currentHeading.textAlign" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs">
                <option value="left">居左对齐</option>
                <option value="center">居中对齐</option>
                <option value="right">居右对齐</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-slate-400">上外边距 (Margin Top)</label>
              <input type="text" v-model="currentHeading.marginTop" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs" />
            </div>
            <div class="space-y-1">
              <label class="text-slate-400">下外边距 (Margin Bottom)</label>
              <input type="text" v-model="currentHeading.marginBottom" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-slate-400">底边框 (Border Bottom)</label>
              <input type="text" v-model="currentHeading.borderBottom" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs" placeholder="例如 1px solid #eee" />
            </div>
            <ColorInput
              label="背景底色"
              v-model="currentHeading.backgroundColor"
              allow-transparent
              placeholder="transparent"
            />
          </div>

          <!-- Prefix Bar -->
          <div class="pt-2 border-t border-slate-700 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-slate-300 font-medium">左侧竖标修饰条 (Prefix Bar)</span>
              <input
                type="checkbox"
                v-model="currentHeadingPrefixBar.enabled"
                class="accent-emerald-500 w-4 h-4 cursor-pointer"
              />
            </div>
            <div v-if="currentHeadingPrefixBar.enabled" class="grid grid-cols-2 gap-3 pt-1">
              <ColorInput
                label="竖条颜色"
                v-model="currentHeadingPrefixBar.color"
                allow-transparent
              />
              <div class="space-y-1">
                <label class="text-slate-400">竖条宽度</label>
                <input type="text" v-model="currentHeadingPrefixBar.width" class="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs" placeholder="4px" />
              </div>
            </div>
          </div>

          <!-- Heading Custom CSS -->
          <div class="pt-2 border-t border-slate-700 space-y-1">
            <label class="text-slate-400 font-medium flex items-center justify-between">
              <span>{{ selectedHeadingLevel.toUpperCase() }} 自定义 CSS 规则</span>
              <span class="text-2xs text-slate-500">内联至当前标题标签</span>
            </label>
            <textarea
              v-model="currentHeading.customCss"
              rows="2"
              class="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="例如: letter-spacing: 1px; border-left: 4px solid #07c160;"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 3. 行内元素与按键 (Inline) -->
      <div v-if="activeTab === 'inline'" class="space-y-4">
        <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Baseline class="w-4 h-4" />
          <span>行内强调、高亮与按键</span>
        </h3>

        <div class="grid grid-cols-2 gap-3">
          <ColorInput
            label="粗体强调色 (Strong)"
            v-model="theme.inline.boldColor"
          />
          <ColorInput
            label="斜体文字色 (Italic)"
            v-model="theme.inline.italicColor"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <ColorInput
            label="高亮背景色 (==文本==)"
            v-model="theme.inline.markBackground"
            allow-transparent
          />
          <ColorInput
            label="高亮字色 (Mark Color)"
            v-model="theme.inline.markColor"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <ColorInput
            label="超链接文字色"
            v-model="theme.inline.linkColor"
          />
          <ColorInput
            label="删除线颜色 (Del / S)"
            v-model="theme.inline.strikeColor"
            placeholder="#9ca3af"
          />
        </div>

        <div class="space-y-1">
          <label class="text-slate-400">超链接下划线</label>
          <select v-model="theme.inline.linkUnderline" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs">
            <option value="none">无下划线</option>
            <option value="underline">显示下划线</option>
          </select>
        </div>

        <!-- Kbd settings -->
        <div v-if="theme.inline.kbd" class="p-3 bg-slate-800/40 rounded-lg space-y-2.5 border border-slate-700/50">
          <div class="text-xs font-semibold text-slate-300">键盘按键 (&lt;kbd&gt;) 实体风格</div>
          <div class="grid grid-cols-3 gap-2">
            <ColorInput
              label="按键背景"
              v-model="theme.inline.kbd.backgroundColor"
              allow-transparent
              compact
            />
            <ColorInput
              label="按键文字"
              v-model="theme.inline.kbd.textColor"
              compact
            />
            <ColorInput
              label="按键边框"
              v-model="theme.inline.kbd.borderColor"
              compact
            />
          </div>
        </div>

        <div class="pt-2 border-t border-slate-800 space-y-1">
          <label class="text-slate-400 font-medium">行内样式自定义 CSS</label>
          <textarea
            v-model="theme.inline.customCss"
            rows="2"
            class="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="例如: a { font-weight: bold; }"
          ></textarea>
        </div>
      </div>

      <!-- 4. 引用块 (Blockquote) -->
      <div v-if="activeTab === 'blockquote'" class="space-y-4">
        <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Quote class="w-4 h-4" />
          <span>引用块定制 (Blockquote)</span>
        </h3>

        <div class="space-y-1">
          <label class="text-slate-400 font-medium">前置装饰引用图标 (Quote Icon)</label>
          <input
            type="text"
            v-model="theme.blockquote.icon"
            placeholder="例如 ❝ 或 💬 或 💡 或 留空"
            class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <ColorInput
            label="左边框颜色"
            v-model="theme.blockquote.borderLeftColor"
            allow-transparent
          />
          <div class="space-y-1">
            <label class="text-slate-400">左边框宽度</label>
            <input type="text" v-model="theme.blockquote.borderLeftWidth" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs" placeholder="4px" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <ColorInput
            label="背景颜色"
            v-model="theme.blockquote.backgroundColor"
            allow-transparent
          />
          <ColorInput
            label="文字颜色"
            v-model="theme.blockquote.color"
            allow-transparent
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-slate-400">圆角 (Radius)</label>
            <input type="text" v-model="theme.blockquote.borderRadius" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs" placeholder="4px" />
          </div>
          <div class="space-y-1">
            <label class="text-slate-400">斜体显示</label>
            <select v-model="theme.blockquote.fontStyle" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs">
              <option value="normal">常规字体 (Normal)</option>
              <option value="italic">斜体字 (Italic)</option>
            </select>
          </div>
        </div>

        <!-- Blockquote Custom CSS -->
        <div class="pt-2 border-t border-slate-800 space-y-1">
          <label class="text-slate-400 font-medium flex items-center justify-between">
            <span>引用块自定义 CSS 规则</span>
            <span class="text-2xs text-slate-500">内联至 blockquote 容器</span>
          </label>
          <textarea
            v-model="theme.blockquote.customCss"
            rows="2"
            class="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="例如: box-shadow: inset 0 0 4px rgba(0,0,0,0.05);"
          ></textarea>
        </div>
      </div>

      <!-- 5. 提示卡片 (Alerts) -->
      <div v-if="activeTab === 'alerts'" class="space-y-4">
        <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <AlertCircle class="w-4 h-4" />
          <span>Alert 提示卡片 (GitHub & Typora)</span>
        </h3>

        <div class="space-y-1">
          <label class="text-slate-400">提示卡片圆角 (Radius)</label>
          <input type="text" v-model="theme.alerts.borderRadius" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs" placeholder="8px" />
        </div>

        <div class="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/50 space-y-3">
          <div class="text-xs font-semibold text-slate-300">五大 Alert 卡片主色调</div>

          <div class="grid grid-cols-2 gap-3">
            <ColorInput
              label="[!NOTE] 信息提示色"
              v-model="theme.alerts.noteColor"
              compact
            />
            <ColorInput
              label="[!TIP] 技巧提示色"
              v-model="theme.alerts.tipColor"
              compact
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <ColorInput
              label="[!WARNING] 警示提示色"
              v-model="theme.alerts.warningColor"
              compact
            />
            <ColorInput
              label="[!IMPORTANT] 重要提示色"
              v-model="theme.alerts.importantColor"
              compact
            />
          </div>

          <div class="space-y-1">
            <ColorInput
              label="[!CAUTION] 严重注意事项色"
              v-model="theme.alerts.cautionColor"
              compact
            />
          </div>
        </div>

        <div class="pt-2 border-t border-slate-800 space-y-1">
          <label class="text-slate-400 font-medium">Alert 自定义 CSS</label>
          <textarea
            v-model="theme.alerts.customCss"
            rows="2"
            class="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="例如: box-shadow: 0 4px 16px rgba(0,0,0,0.06);"
          ></textarea>
        </div>
      </div>

      <!-- 6. 智能目录 (TOC) -->
      <div v-if="activeTab === 'toc'" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Menu class="w-4 h-4" />
            <span>智能目录卡片 ([TOC])</span>
          </h3>
          <span class="px-2 py-0.5 rounded text-2xs bg-emerald-500/20 text-emerald-300 font-mono">[TOC] 语法支持</span>
        </div>

        <div class="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-700/60">
            <div>
              <div class="text-xs font-semibold text-slate-200">启用智能目录</div>
              <div class="text-2xs text-slate-400">在文档中支持目录卡片与快速锚点跳转</div>
            </div>
            <input
              type="checkbox"
              v-model="theme.toc.enabled"
              class="accent-emerald-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div class="flex items-center justify-between pb-2 border-b border-slate-700/60">
            <div>
              <div class="text-xs font-semibold text-slate-200">未书写 [TOC] 时自动生成</div>
              <div class="text-2xs text-slate-400">若正文中未手动书写 [TOC] 标记，将在文首自动生成目录</div>
            </div>
            <input
              type="checkbox"
              v-model="theme.toc.autoInsert"
              class="accent-emerald-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div class="space-y-1">
            <label class="text-slate-400 font-medium">目录前缀编号模式</label>
            <select
              v-model="theme.toc.prefixStyle"
              class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs cursor-pointer"
            >
              <option value="none">默认无前缀（纯标题名称）</option>
              <option value="number">数字层级编号 (1, 1.1, 1.2, 2.1...)</option>
              <option value="chapter">中文章节编号 (第一章, 1.1, 1.2...)</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-slate-400 font-medium">起始层级 (Min Level)</label>
              <select v-model="theme.toc.minLevel" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs cursor-pointer">
                <option :value="1">智能自适应（从正文最高标题开始 · 推荐）</option>
                <option :value="2">从 H2 二级标题开始（排除文首 H1 大标题）</option>
                <option :value="3">从 H3 三级标题开始</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-slate-400 font-medium">最深层级 (Max Level)</label>
              <select v-model="theme.toc.maxLevel" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs">
                <option :value="2">仅到 H2 二级标题</option>
                <option :value="3">到 H3 三级标题 (推荐)</option>
                <option :value="4">到 H4 四级标题</option>
                <option :value="6">全部层级 (H1~H6)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <ColorInput
              label="目录底色"
              v-model="theme.toc.backgroundColor"
              allow-transparent
            />
            <ColorInput
              label="目录边框色"
              v-model="theme.toc.borderColor"
              allow-transparent
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <ColorInput
              label="链接文字颜色"
              v-model="theme.toc.textColor"
            />
            <ColorInput
              label="目录左侧强调色"
              v-model="theme.toc.accentColor"
            />
          </div>

          <!-- TOC Custom CSS -->
          <div class="pt-2 border-t border-slate-700 space-y-1">
            <label class="text-slate-400 font-medium flex items-center justify-between">
              <span>目录卡片自定义 CSS</span>
              <span class="text-2xs text-slate-500">内联至 .m2h-toc-card</span>
            </label>
            <textarea
              v-model="theme.toc.customCss"
              rows="2"
              class="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="例如: box-shadow: 0 2px 8px rgba(0,0,0,0.05);"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 7. 外链与脚注 (Footnotes) -->
      <div v-if="activeTab === 'footnotes'" class="space-y-4">
        <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <ExternalLink class="w-4 h-4" />
          <span>微信外链转文末脚注 (Reference Links)</span>
        </h3>

        <div class="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs font-semibold text-slate-200">启用外链转脚注</div>
              <div class="text-2xs text-slate-400">正文外部链接自动提取为上标并在文末汇总</div>
            </div>
            <input
              type="checkbox"
              v-model="theme.footnotes.linkToFootnote"
              class="accent-emerald-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div class="space-y-1 pt-2 border-t border-slate-700/60">
            <label class="text-slate-400">文末卡片标头标题</label>
            <input
              type="text"
              v-model="theme.footnotes.title"
              placeholder="参考链接 / 引用文献"
              class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-slate-400">脚注字体字号</label>
              <input
                type="text"
                v-model="theme.footnotes.fontSize"
                placeholder="12px"
                class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs"
              />
            </div>
            <ColorInput
              label="引用字色"
              v-model="theme.footnotes.textColor"
              placeholder="#6b7280"
            />
          </div>

          <div class="pt-2 border-t border-slate-700/60 space-y-1">
            <label class="text-slate-400">脚注卡片自定义 CSS</label>
            <textarea
              v-model="theme.footnotes.customCss"
              rows="2"
              class="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="例如: background: #f9fafb; border-radius: 8px;"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 8. 图片与图注 (Image) -->
      <div v-if="activeTab === 'image'" class="space-y-4">
        <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Image class="w-4 h-4" />
          <span>图片与图注排版 (Image & Caption)</span>
        </h3>

        <div class="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-slate-400">图片圆角 (Radius)</label>
              <input type="text" v-model="theme.image.borderRadius" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs" placeholder="8px" />
            </div>
            <div class="space-y-1">
              <label class="text-slate-400">图片外边框 (Border)</label>
              <input type="text" v-model="theme.image.border" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs" placeholder="none 或 1px solid #eee" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-slate-400">卡片阴影 (Box Shadow)</label>
            <input type="text" v-model="theme.image.boxShadow" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs" placeholder="0 4px 12px rgba(0,0,0,0.08)" />
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-700/60">
            <div>
              <div class="text-xs font-semibold text-slate-300">自动显示居中图注</div>
              <div class="text-2xs text-slate-400">自动从 ![图注文本](url) 提取生成图注</div>
            </div>
            <input type="checkbox" v-model="theme.image.showCaption" class="accent-emerald-500 w-4 h-4 cursor-pointer" />
          </div>

          <div v-if="theme.image.showCaption" class="grid grid-cols-2 gap-3 pt-1">
            <div class="space-y-1">
              <label class="text-slate-400">图注字号</label>
              <input type="text" v-model="theme.image.captionFontSize" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs" placeholder="12px" />
            </div>
            <ColorInput
              label="图注颜色"
              v-model="theme.image.captionColor"
              placeholder="#888888"
            />
          </div>

          <div class="pt-2 border-t border-slate-700/60 space-y-1">
            <label class="text-slate-400">图片自定义 CSS</label>
            <textarea v-model="theme.image.customCss" rows="2" class="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="例如: filter: drop-shadow(0 2px 8px rgba(0,0,0,0.1));"></textarea>
          </div>
        </div>
      </div>

      <!-- 9. 文章分割线 (Divider) -->
      <div v-if="activeTab === 'divider'" class="space-y-4">
        <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Minus class="w-4 h-4" />
          <span>文章分割线装饰 (Divider)</span>
        </h3>

        <div class="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-3">
          <div class="space-y-1">
            <label class="text-slate-400 font-medium">分割线视觉风格</label>
            <select v-model="theme.divider.style" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs cursor-pointer">
              <option value="symbol">居中符号线 (✦ ✦ ✦ / ***)</option>
              <option value="gradient">双侧微渐变消失线 (现代感)</option>
              <option value="dashed">经典虚线 (Dashed)</option>
              <option value="solid">极简实线 (Solid)</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <ColorInput
              label="线条颜色"
              v-model="theme.divider.color"
              allow-transparent
            />
            <div class="space-y-1">
              <label class="text-slate-400">线条粗细 / 高度</label>
              <input type="text" v-model="theme.divider.height" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs" placeholder="1px" />
            </div>
          </div>

          <div v-if="theme.divider.style === 'symbol'" class="space-y-1">
            <label class="text-slate-400">居中装饰符号</label>
            <input type="text" v-model="theme.divider.symbol" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono" placeholder="✦ ✦ ✦ 或 *** 或 ❖" />
          </div>

          <div class="space-y-1">
            <label class="text-slate-400">上下间距 (Margin)</label>
            <input type="text" v-model="theme.divider.margin" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs" placeholder="28px 0" />
          </div>

          <div class="pt-2 border-t border-slate-700/60 space-y-1">
            <label class="text-slate-400">分割线自定义 CSS</label>
            <textarea v-model="theme.divider.customCss" rows="2" class="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="例如: opacity: 0.8;"></textarea>
          </div>
        </div>
      </div>

      <!-- 10. 数据表格 (Table) -->
      <div v-if="activeTab === 'table'" class="space-y-4">
        <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Table class="w-4 h-4" />
          <span>数据表格定制 (Table)</span>
        </h3>

        <div class="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <ColorInput
              label="表头背景色"
              v-model="theme.table.headerBackground"
              allow-transparent
            />
            <ColorInput
              label="表头字色"
              v-model="theme.table.headerColor"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <ColorInput
              label="斑马纹行底色"
              v-model="theme.table.zebraBackground"
              allow-transparent
            />
            <ColorInput
              label="边框颜色"
              v-model="theme.table.borderColor"
              allow-transparent
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-slate-400">表格圆角 (Radius)</label>
              <input type="text" v-model="theme.table.borderRadius" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs" placeholder="6px" />
            </div>
            <div class="space-y-1">
              <label class="text-slate-400">表格阴影 (Shadow)</label>
              <input type="text" v-model="theme.table.boxShadow" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs" placeholder="0 2px 8px rgba(0,0,0,0.04)" />
            </div>
          </div>

          <div class="pt-2 border-t border-slate-700 space-y-1">
            <label class="text-slate-400 font-medium">表格自定义 CSS</label>
            <textarea
              v-model="theme.table.customCss"
              rows="2"
              class="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="例如: border-radius: 6px; overflow: hidden;"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 11. 列表样式 (List) -->
      <div v-if="activeTab === 'list'" class="space-y-4">
        <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <List class="w-4 h-4" />
          <span>列表清单样式 (Lists)</span>
        </h3>

        <div class="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <ColorInput
              label="有序列表编号色"
              v-model="theme.list.orderedColor"
            />
            <ColorInput
              label="无序列表符号色"
              v-model="theme.list.unorderedBulletColor"
            />
          </div>

          <div class="pt-2 border-t border-slate-700 space-y-1">
            <label class="text-slate-400 font-medium">列表自定义 CSS</label>
            <textarea
              v-model="theme.list.customCss"
              rows="2"
              class="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="例如: line-height: 1.8;"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 12. 普通代码块 (Code) -->
      <div v-if="activeTab === 'code'" class="space-y-4">
        <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Code class="w-4 h-4" />
          <span>标准代码高亮块 (Code)</span>
        </h3>

        <div class="space-y-1.5">
          <label class="text-slate-400 font-medium">Shiki 语法高亮主题配色</label>
          <select
            v-model="theme.code.block.shikiTheme"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs cursor-pointer"
          >
            <option value="github-dark">GitHub Dark (经典暗黑)</option>
            <option value="github-light">GitHub Light (极简纯白)</option>
            <option value="tokyo-night">Tokyo Night (东京之夜紫蓝)</option>
            <option value="one-dark-pro">One Dark Pro (Atom 流行配色)</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <ColorInput
            label="代码块背景底色"
            v-model="theme.code.block.backgroundColor"
            allow-transparent
          />
          <div class="space-y-1">
            <label class="text-slate-400">圆角 (Radius)</label>
            <input type="text" v-model="theme.code.block.borderRadius" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs" />
          </div>
        </div>

        <div class="p-3 bg-slate-800/40 rounded-lg space-y-2 border border-slate-700/50">
          <div class="flex items-center justify-between">
            <span class="text-slate-300 font-medium">Mac 风格红黄绿视窗圆点</span>
            <input type="checkbox" v-model="theme.code.block.showMacDots" class="accent-emerald-500 w-4 h-4 cursor-pointer" />
          </div>
          <div v-if="theme.code.block.showMacDots" class="flex items-center gap-3 pt-1">
            <label class="text-slate-400">圆点风格:</label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" value="colored" v-model="theme.code.block.macDotsStyle" class="accent-emerald-500" />
              <span>经典彩色</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" value="monochrome" v-model="theme.code.block.macDotsStyle" class="accent-emerald-500" />
              <span>低调灰度</span>
            </label>
          </div>
        </div>

        <!-- Line Numbers Setting -->
        <div class="p-3 bg-slate-800/40 rounded-lg space-y-2 border border-slate-700/50">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-slate-300 font-medium block">代码块行号显示</span>
              <span class="text-2xs text-slate-400">在代码左侧展示对齐行号（默认不显示）</span>
            </div>
            <input type="checkbox" v-model="theme.code.block.showLineNumbers" class="accent-emerald-500 w-4 h-4 cursor-pointer" />
          </div>
          <div v-if="theme.code.block.showLineNumbers" class="pt-1 border-t border-slate-700/40">
            <ColorInput
              label="行号字体颜色"
              v-model="theme.code.block.lineNumberColor"
              placeholder="#64748b"
            />
          </div>
        </div>

        <div class="pt-2 border-t border-slate-800 space-y-1">
          <label class="text-slate-400 font-medium">代码块自定义 CSS</label>
          <textarea
            v-model="theme.code.block.customCss"
            rows="2"
            class="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="例如: border: 1px solid rgba(255,255,255,0.1);"
          ></textarea>
        </div>
      </div>

      <!-- 13. output 特化代码块 (Output) -->
      <div v-if="activeTab === 'output'" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal class="w-4 h-4" />
            <span>程序输出 (output) 特化样式</span>
          </h3>
          <span class="px-2 py-0.5 rounded text-2xs bg-emerald-500/20 text-emerald-300 font-mono font-bold">output 块</span>
        </div>

        <div class="space-y-1">
          <label class="text-slate-400 font-medium">卡片标头标题文字</label>
          <input
            type="text"
            v-model="theme.outputBlock.title"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500"
            placeholder="OUTPUT / 执行结果"
          />
        </div>

        <div class="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
          <span class="text-slate-300 font-medium">显示终端标头条</span>
          <input type="checkbox" v-model="theme.outputBlock.showTerminalHeader" class="accent-emerald-500 w-4 h-4 cursor-pointer" />
        </div>

        <div v-if="theme.outputBlock.showTerminalHeader" class="grid grid-cols-2 gap-3 p-2.5 bg-slate-800/30 rounded-lg border border-slate-700/40">
          <ColorInput
            label="标头条底色"
            v-model="theme.outputBlock.headerBackground"
            allow-transparent
          />
          <ColorInput
            label="标头条字色"
            v-model="theme.outputBlock.headerColor"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <ColorInput
            label="输出终端背景色"
            v-model="theme.outputBlock.backgroundColor"
            allow-transparent
          />
          <ColorInput
            label="输出结果文字颜色"
            v-model="theme.outputBlock.textColor"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <ColorInput
            label="边框颜色"
            v-model="theme.outputBlock.borderColor"
            allow-transparent
          />
          <div class="space-y-1">
            <label class="text-slate-400">边框宽度</label>
            <input type="text" v-model="theme.outputBlock.borderWidth" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs" placeholder="1px" />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-slate-400 font-medium">每行前缀提示符 (Prefix Prompt)</label>
          <input
            type="text"
            v-model="theme.outputBlock.prefixPrompt"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono"
            placeholder="例如 > 或 $ 或 留空"
          />
        </div>

        <div class="pt-2 border-t border-slate-800 space-y-1">
          <label class="text-slate-400 font-medium">output 卡片自定义 CSS</label>
          <textarea
            v-model="theme.outputBlock.customCss"
            rows="2"
            class="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="例如: box-shadow: 0 8px 24px rgba(0,0,0,0.3);"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Drawer Footer Actions -->
    <div class="p-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between gap-2">
      <button
        @click="handleReset"
        class="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
        title="恢复为预设初值"
      >
        <RotateCcw class="w-4 h-4" />
        <span>重置预设</span>
      </button>

      <div class="flex items-center gap-2">
        <button
          @click="handleExport"
          class="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
          title="导出当前主题为 JSON"
        >
          <Upload class="w-4 h-4" />
          <span>导出主题</span>
        </button>

        <label
          class="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-lg shadow-emerald-950 text-xs"
          title="从 JSON 导入主题"
        >
          <Download class="w-4 h-4" />
          <span>导入主题</span>
          <input type="file" accept=".json" @change="handleImportFile" class="hidden" />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { storeToRefs } from "pinia"
import {
  Sliders,
  X,
  RotateCcw,
  Download,
  Upload,
  Type,
  Heading,
  Baseline,
  Quote,
  AlertCircle,
  Menu,
  ExternalLink,
  Image,
  Minus,
  Table,
  List,
  Code,
  Terminal,
  Compass,
  MessageSquareQuote,
  Layers
} from "@lucide/vue"
import { useThemeStore } from "../../stores/themeStore"
import { downloadFile } from "../../utils/clipboard"
import type { HeadingStyle, ThemeConfig } from "../../themes/types"
import ColorInput from "./ColorInput.vue"

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "toast", msg: string, type?: "success" | "error"): void
}>()

const themeStore = useThemeStore()
const { activeTheme: theme } = storeToRefs(themeStore)

// Helper to ensure nested objects are always populated for any loaded/switched theme
function ensureThemeDefaults(t: ThemeConfig) {
  if (!t) return
  if (!t.image) {
    t.image = {
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      border: "none",
      showCaption: true,
      captionColor: "#6b7280",
      captionFontSize: "12px"
    }
  }
  if (!t.divider) {
    t.divider = {
      style: "symbol",
      color: "#cbd5e1",
      height: "1px",
      margin: "28px 0",
      symbol: "✦ ✦ ✦"
    }
  }
  if (!t.footnotes) {
    t.footnotes = {
      linkToFootnote: true,
      title: "参考链接 / 引用文献",
      fontSize: "12px",
      textColor: "#6b7280"
    }
  }
  if (!t.alerts) {
    t.alerts = {
      noteColor: "#0969da",
      tipColor: "#1a7f37",
      warningColor: "#9a6700",
      importantColor: "#8250df",
      cautionColor: "#cf222e",
      borderRadius: "8px"
    }
  }
  if (!t.inline) {
    ;(t as any).inline = {}
  }
  if (!t.inline.kbd) {
    t.inline.kbd = {
      backgroundColor: "#f1f5f9",
      textColor: "#334155",
      borderColor: "#cbd5e1"
    }
  }
  if (!t.toc) {
    t.toc = {
      enabled: true,
      autoInsert: false,
      title: "文章导读 · 目录",
      minLevel: 1,
      maxLevel: 3,
      prefixStyle: "none",
      backgroundColor: "#f0fdf4",
      borderColor: "#bbf7d0",
      textColor: "#166534",
      accentColor: "#07c160",
      borderRadius: "8px"
    }
  }
}

watch(
  () => theme.value,
  (current) => {
    if (current) {
      ensureThemeDefaults(current)
    }
  },
  { immediate: true, deep: true }
)

// 1. Top-Level Categories
const categories = [
  { id: "all", label: "全部组件", icon: Layers },
  { id: "text", label: "基础排版", icon: Type },
  { id: "media", label: "导读与媒体", icon: Compass },
  { id: "callout", label: "引用与提示", icon: MessageSquareQuote },
  { id: "data", label: "表格与列表", icon: Table },
  { id: "code", label: "代码与终端", icon: Terminal }
]

const activeCategory = ref("all")

// 2. All Individual Component Tabs
const allTabs = [
  { id: "typography", label: "版面字体", icon: Type, category: "text" },
  { id: "headings", label: "各级标题", icon: Heading, category: "text" },
  { id: "inline", label: "行内元素", icon: Baseline, category: "text" },
  { id: "toc", label: "智能目录", icon: Menu, category: "media" },
  { id: "footnotes", label: "外链脚注", icon: ExternalLink, category: "media" },
  { id: "image", label: "图片图注", icon: Image, category: "media" },
  { id: "divider", label: "文章分割线", icon: Minus, category: "media" },
  { id: "blockquote", label: "引用块", icon: Quote, category: "callout" },
  { id: "alerts", label: "提示卡片", icon: AlertCircle, category: "callout" },
  { id: "table", label: "数据表格", icon: Table, category: "data" },
  { id: "list", label: "列表样式", icon: List, category: "data" },
  { id: "code", label: "普通代码", icon: Code, category: "code" },
  { id: "output", label: "output 块", icon: Terminal, category: "code" }
]

const visibleTabs = computed(() => {
  if (activeCategory.value === "all") {
    return allTabs
  }
  return allTabs.filter(t => t.category === activeCategory.value)
})

const activeTab = ref("typography")

function selectCategory(catId: string) {
  activeCategory.value = catId
  const matching = catId === "all" ? allTabs : allTabs.filter(t => t.category === catId)
  if (matching.length > 0 && !matching.some(t => t.id === activeTab.value)) {
    activeTab.value = matching[0].id
  }
}

// Default to 'h2' because in WeChat/Zhihu articles, H2 is the primary section heading
const selectedHeadingLevel = ref<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">("h2")

const currentHeading = computed<HeadingStyle>(() => {
  return theme.value.headings[selectedHeadingLevel.value]
})

const currentHeadingPrefixBar = computed(() => {
  if (!currentHeading.value.prefixBar) {
    currentHeading.value.prefixBar = {
      enabled: false,
      color: currentHeading.value.color,
      width: "4px"
    }
  }
  return currentHeading.value.prefixBar
})

function handleReset() {
  themeStore.resetToPreset()
  emit("toast", "已重置为预设默认样式", "success")
}

function handleExport() {
  const json = themeStore.exportThemeJson()
  downloadFile(json, `${theme.value.id || "theme"}-config.json`, "application/json")
  emit("toast", "主题配置已成功导出为 JSON", "success")
}

function handleImportFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const success = themeStore.importThemeJson(content)
      if (success) {
        emit("toast", "主题配置文件导入成功", "success")
      } else {
        emit("toast", "无效的主题 JSON 格式", "error")
      }
    } catch {
      emit("toast", "读取主题文件失败", "error")
    }
  }
  reader.readAsText(file)
}
</script>

<style scoped>
.theme-customization-drawer {
  max-width: 500px;
  border-right-width: 5px;
}
.theme-drawer-tabs {
  scrollbar-width: auto;
}
.theme-drawer-tabs::-webkit-scrollbar {
  height: 5px;
}
.theme-drawer-tabs::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 9999px;
}
.theme-drawer-tabs::-webkit-scrollbar-thumb:hover {
  background: rgba(52, 211, 153, 0.6);
}
</style>
