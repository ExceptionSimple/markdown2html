<template>
  <div class="h-full flex flex-col bg-slate-900 border-r border-slate-800">
    <!-- Editor Top Toolbar -->
    <div class="h-10 px-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between overflow-x-auto scrollbar-none select-none">
      <div class="flex items-center gap-0.5 text-slate-300">
        <!-- Heading 1 -->
        <button
          @click="insertPrefix('# ')"
          class="p-1.5 rounded hover:bg-slate-800 text-xs font-bold hover:text-white cursor-pointer"
          title="一级标题"
        >
          H1
        </button>
        <!-- Heading 2 -->
        <button
          @click="insertPrefix('## ')"
          class="p-1.5 rounded hover:bg-slate-800 text-xs font-bold hover:text-white cursor-pointer"
          title="二级标题"
        >
          H2
        </button>
        <!-- Heading 3 -->
        <button
          @click="insertPrefix('### ')"
          class="p-1.5 rounded hover:bg-slate-800 text-xs font-bold hover:text-white cursor-pointer"
          title="三级标题"
        >
          H3
        </button>

        <div class="w-px h-4 bg-slate-800 mx-1"></div>

        <!-- Bold -->
        <button
          @click="insertSurround('**', '**')"
          class="p-1.5 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
          title="粗体"
        >
          <Bold class="w-3.5 h-3.5" />
        </button>
        <!-- Italic -->
        <button
          @click="insertSurround('*', '*')"
          class="p-1.5 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
          title="斜体"
        >
          <Italic class="w-3.5 h-3.5" />
        </button>
        <!-- Highlight ==text== -->
        <button
          @click="insertSurround('==', '==')"
          class="p-1.5 rounded hover:bg-slate-800 text-amber-300 hover:text-amber-200 cursor-pointer font-bold text-xs"
          title="高亮标记 (==高亮==)"
        >
          ==
        </button>

        <div class="w-px h-4 bg-slate-800 mx-1"></div>

        <!-- Quote -->
        <button
          @click="insertPrefix('> ')"
          class="p-1.5 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
          title="引用"
        >
          <Quote class="w-3.5 h-3.5" />
        </button>
        <!-- Unordered List -->
        <button
          @click="insertPrefix('- ')"
          class="p-1.5 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
          title="无序列表"
        >
          <List class="w-3.5 h-3.5" />
        </button>
        <!-- Task List -->
        <button
          @click="insertPrefix('- [ ] ')"
          class="p-1.5 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
          title="任务清单"
        >
          <CheckSquare class="w-3.5 h-3.5" />
        </button>
        <!-- Table -->
        <button
          @click="insertTable"
          class="p-1.5 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
          title="插入表格"
        >
          <Table class="w-3.5 h-3.5" />
        </button>
        <!-- Image Insert / Upload -->
        <button
          @click="triggerImageUpload"
          class="p-1.5 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
          title="插入图片 (支持本地选择、截图直接粘贴 Ctrl+V、拖入图片)"
        >
          <ImageIcon class="w-3.5 h-3.5" />
        </button>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileInputChange"
        />

        <div class="w-px h-4 bg-slate-800 mx-1"></div>

        <!-- Math Inline -->
        <button
          @click="insertSurround('$', '$')"
          class="px-1.5 py-1 rounded hover:bg-slate-800 text-sky-400 font-mono text-xs font-bold cursor-pointer"
          title="插入行内数学公式 ($E = mc^2$)"
        >
          $f(x)$
        </button>
        <!-- Math Block -->
        <button
          @click="insertMathBlock"
          class="px-1.5 py-1 rounded hover:bg-slate-800 text-sky-400 font-mono text-xs font-bold cursor-pointer"
          title="插入块级数学公式 ($$\\sum...$$)"
        >
          $$
        </button>
        <!-- TOC -->
        <button
          @click="insertTOC"
          class="px-1.5 py-1 rounded hover:bg-slate-800 text-emerald-400 font-mono text-xs font-bold cursor-pointer"
          title="插入 [TOC] 目录"
        >
          [TOC]
        </button>
        <!-- Alert -->
        <button
          @click="insertAlert"
          class="px-1.5 py-1 rounded hover:bg-slate-800 text-purple-400 text-xs font-medium cursor-pointer"
          title="插入 Alert 提示卡片"
        >
          提示框
        </button>
        <!-- Mermaid -->
        <button
          @click="insertMermaid"
          class="px-1.5 py-1 rounded hover:bg-slate-800 text-cyan-400 font-mono text-xs font-semibold cursor-pointer"
          title="插入 Mermaid 图表（自动转图片）"
        >
          图表
        </button>

        <div class="w-px h-4 bg-slate-800 mx-1"></div>

        <!-- SPECIAL: Output execution block -->
        <button
          @click="insertOutputBlock"
          class="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold transition-all ml-1 shadow-sm cursor-pointer"
          title="插入特化的 output 程序输出结果卡片代码块"
        >
          <Terminal class="w-3.5 h-3.5" />
          <span>+ output 块</span>
        </button>
      </div>
    </div>

    <!-- Textarea Input Area -->
    <div class="flex-1 relative">
      <textarea
        ref="textareaRef"
        v-model="editorStore.markdown"
        @keydown="handleKeydown"
        @paste="handlePaste"
        @drop.prevent="handleDrop"
        @dragover.prevent
        class="w-full h-full p-4 bg-slate-900 text-slate-100 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-slate-600 selection:bg-emerald-500/30 selection:text-white"
        placeholder="在此键入 Markdown 内容... (支持直接截图粘贴 Ctrl+V 或拖入图片/Markdown 文件)"
        spellcheck="false"
      ></textarea>
    </div>

    <!-- Editor Status Footer -->
    <div class="h-7 px-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-2xs text-slate-400 select-none">
      <div class="flex items-center gap-4">
        <span>字符: <strong class="text-slate-200">{{ charCount }}</strong></span>
        <span>词数: <strong class="text-slate-200">{{ wordCount }}</strong></span>
        <span>行数: <strong class="text-slate-200">{{ lineCount }}</strong></span>
      </div>

      <div class="flex items-center gap-2">
        <span v-if="editorStore.isRendering" class="text-emerald-400 animate-pulse flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          正在解析与内联...
        </span>
        <span v-else class="text-slate-400 flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          实时同步中
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Bold,
  Italic,
  Quote,
  List,
  CheckSquare,
  Table,
  ImageIcon,
  Terminal
} from '@lucide/vue'
import { useEditorStore } from '../stores/editorStore'

const editorStore = useEditorStore()
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const charCount = computed(() => editorStore.markdown.length)
const lineCount = computed(() => (editorStore.markdown ? editorStore.markdown.split('\n').length : 0))
const wordCount = computed(() => {
  const text = editorStore.markdown.trim()
  if (!text) return 0
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const en = (text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/\b\w+\b/g) || []).length
  return cjk + en
})

function insertPrefix(prefix: string) {
  const el = textareaRef.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  const val = editorStore.markdown
  const lineStart = val.lastIndexOf('\n', start - 1) + 1
  editorStore.markdown = val.slice(0, lineStart) + prefix + val.slice(lineStart)
  setTimeout(() => {
    el.focus()
    el.setSelectionRange(start + prefix.length, end + prefix.length)
  }, 0)
}

function insertSurround(before: string, after: string) {
  const el = textareaRef.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  const val = editorStore.markdown
  const selected = val.substring(start, end)
  const replacement = `${before}${selected || '文本'}${after}`
  editorStore.markdown = val.substring(0, start) + replacement + val.substring(end)
  setTimeout(() => {
    el.focus()
    if (selected) {
      el.setSelectionRange(start + before.length, end + before.length)
    } else {
      el.setSelectionRange(start + before.length, start + before.length + 2)
    }
  }, 0)
}

function insertTable() {
  const tableTemplate = `
| 表头 1 | 表头 2 | 表头 3 |
| :--- | :---: | ---: |
| 内容 A | 内容 B | 内容 C |
| 内容 D | 内容 E | 内容 F |
`
  insertPrefix(tableTemplate)
}

function insertMathBlock() {
  const mathTemplate = `
$$
\\int_{a}^{b} f(x) dx = F(b) - F(a)
$$
`
  insertPrefix(mathTemplate)
}

function insertTOC() {
  insertPrefix('\n[TOC]\n\n')
}

function insertAlert() {
  const alertTemplate = `
> [!NOTE]
> 这是一个优雅的高亮提示卡片。
`
  insertPrefix(alertTemplate)
}

function insertMermaid() {
  const mermaidTemplate = `
\`\`\`mermaid
graph TD
    A[开始] --> B{判断条件}
    B -->|是| C[执行操作]
    B -->|否| D[结束]
    C --> D
\`\`\`
`
  insertPrefix(mermaidTemplate)
}

function insertOutputBlock() {
  const outputTemplate = `
\`\`\`output
> npm run build
> vite build
✓ 142 modules transformed.
dist/index.html   0.45 kB
dist/assets/      120.5 kB
✓ built in 280ms
\`\`\`
`
  insertPrefix(outputTemplate)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    e.preventDefault()
    insertSurround('  ', '')
  }
}

const fileInputRef = ref<HTMLInputElement | null>(null)

function triggerImageUpload() {
  fileInputRef.value?.click()
}

function handleFileInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    insertImageFile(file)
  }
  target.value = ''
}

function insertAtCursor(text: string) {
  const el = textareaRef.value
  if (!el) {
    editorStore.markdown += text
    return
  }
  const start = el.selectionStart
  const end = el.selectionEnd
  const val = editorStore.markdown
  editorStore.markdown = val.substring(0, start) + text + val.substring(end)
  setTimeout(() => {
    el.focus()
    el.setSelectionRange(start + text.length, start + text.length)
  }, 0)
}

function insertImageFile(file: File) {
  if (!file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    const base64 = reader.result as string
    const alt = file.name.replace(/\.[^/.]+$/, '') || '图片'
    const imgMarkdown = `\n![${alt}](${base64})\n`
    insertAtCursor(imgMarkdown)
  }
  reader.readAsDataURL(file)
}

function handlePaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items
  if (!items) return

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.type.startsWith('image/')) {
      e.preventDefault()
      const file = item.getAsFile()
      if (file) {
        insertImageFile(file)
      }
      return
    }
  }
}

function handleDrop(e: DragEvent) {
  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file.type.startsWith('image/')) {
      insertImageFile(file)
    } else if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      const reader = new FileReader()
      reader.onload = () => {
        const content = reader.result as string
        insertAtCursor(content)
      }
      reader.readAsText(file)
    }
  }
}
</script>
