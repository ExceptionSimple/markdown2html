import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { ThemeConfig } from '../themes/types'
import { PRESET_THEMES, DEFAULT_THEME_ID, getThemeById } from '../themes/presets'

const STORAGE_KEY = 'm2h_active_theme_config'
const THEME_ID_KEY = 'm2h_active_theme_id'

export const useThemeStore = defineStore('theme', () => {
  const currentThemeId = ref<string>(localStorage.getItem(THEME_ID_KEY) || DEFAULT_THEME_ID)
  
  // Custom theme storage
  const activeTheme = ref<ThemeConfig>(initTheme())

  function initTheme(): ThemeConfig {
    const defaultTheme = getThemeById(currentThemeId.value)
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.id && parsed.typography) {
          // Deep merge to ensure all new fields (toc, alerts, image, divider, footnotes, customCss) are populated
          const isOldZhihuCode = parsed.id === 'zhihu-modern' && parsed.code?.block?.shikiTheme === 'github-light'
          const resolvedCodeBlock = isOldZhihuCode
            ? defaultTheme.code.block
            : { ...defaultTheme.code.block, ...(parsed.code?.block || {}) }
          const resolvedCodeInline = isOldZhihuCode
            ? defaultTheme.code.inline
            : { ...defaultTheme.code.inline, ...(parsed.code?.inline || {}) }
          const resolvedOutputBlock = isOldZhihuCode
            ? defaultTheme.outputBlock
            : { ...defaultTheme.outputBlock, ...(parsed.outputBlock || {}) }

          return {
            ...defaultTheme,
            ...parsed,
            typography: { ...defaultTheme.typography, ...(parsed.typography || {}) },
            headings: {
              ...defaultTheme.headings,
              bodyNumbering: parsed.headings?.bodyNumbering ?? defaultTheme.headings.bodyNumbering,
              iconPrefix: parsed.headings?.iconPrefix ?? defaultTheme.headings.iconPrefix,
              h1: { ...defaultTheme.headings.h1, ...(parsed.headings?.h1 || {}) },
              h2: { ...defaultTheme.headings.h2, ...(parsed.headings?.h2 || {}) },
              h3: { ...defaultTheme.headings.h3, ...(parsed.headings?.h3 || {}) },
              h4: { ...defaultTheme.headings.h4, ...(parsed.headings?.h4 || {}) },
              h5: { ...defaultTheme.headings.h5, ...(parsed.headings?.h5 || {}) },
              h6: { ...defaultTheme.headings.h6, ...(parsed.headings?.h6 || {}) }
            },
            blockquote: { ...defaultTheme.blockquote, ...(parsed.blockquote || {}) },
            table: { ...defaultTheme.table, ...(parsed.table || {}) },
            list: { ...defaultTheme.list, ...(parsed.list || {}) },
            inline: {
              ...defaultTheme.inline,
              ...(parsed.inline || {}),
              kbd: { ...defaultTheme.inline.kbd, ...(parsed.inline?.kbd || {}) }
            },
            code: {
              inline: resolvedCodeInline,
              block: resolvedCodeBlock
            },
            image: { ...defaultTheme.image, ...(parsed.image || {}) },
            divider: { ...defaultTheme.divider, ...(parsed.divider || {}) },
            footnotes: { ...defaultTheme.footnotes, ...(parsed.footnotes || {}) },
            outputBlock: resolvedOutputBlock,
            toc: { ...defaultTheme.toc, ...(parsed.toc || {}) },
            alerts: { ...defaultTheme.alerts, ...(parsed.alerts || {}) }
          }
        }
      } catch (e) {
        console.error('Failed to parse saved theme from localStorage:', e)
      }
    }
    return JSON.parse(JSON.stringify(defaultTheme))
  }

  // Persist whenever activeTheme changes
  watch(
    activeTheme,
    (newTheme) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTheme))
      } catch (e) {
        console.error('Failed to persist theme:', e)
      }
    },
    { deep: true }
  )

  // Switch to preset
  function selectPreset(id: string) {
    const preset = getThemeById(id)
    currentThemeId.value = id
    localStorage.setItem(THEME_ID_KEY, id)
    activeTheme.value = JSON.parse(JSON.stringify(preset))
  }

  // Reset current theme to original preset
  function resetToPreset() {
    activeTheme.value = JSON.parse(JSON.stringify(getThemeById(currentThemeId.value)))
  }

  // Export current theme as JSON
  function exportThemeJson(): string {
    return JSON.stringify(activeTheme.value, null, 2)
  }

  // Import theme from JSON
  function importThemeJson(jsonStr: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonStr)
      if (!parsed || !parsed.typography || !parsed.headings) {
        return { success: false, error: '无效的主题配置 JSON 结构' }
      }
      parsed.isBuiltin = false
      if (!parsed.id) parsed.id = 'custom-' + Date.now()
      const defaultTheme = getThemeById(DEFAULT_THEME_ID)
      const merged: ThemeConfig = {
        ...defaultTheme,
        ...parsed,
        typography: { ...defaultTheme.typography, ...(parsed.typography || {}) },
        headings: {
          ...defaultTheme.headings,
          bodyNumbering: parsed.headings?.bodyNumbering ?? defaultTheme.headings.bodyNumbering,
          iconPrefix: parsed.headings?.iconPrefix ?? defaultTheme.headings.iconPrefix,
          h1: { ...defaultTheme.headings.h1, ...(parsed.headings?.h1 || {}) },
          h2: { ...defaultTheme.headings.h2, ...(parsed.headings?.h2 || {}) },
          h3: { ...defaultTheme.headings.h3, ...(parsed.headings?.h3 || {}) },
          h4: { ...defaultTheme.headings.h4, ...(parsed.headings?.h4 || {}) },
          h5: { ...defaultTheme.headings.h5, ...(parsed.headings?.h5 || {}) },
          h6: { ...defaultTheme.headings.h6, ...(parsed.headings?.h6 || {}) }
        },
        blockquote: { ...defaultTheme.blockquote, ...(parsed.blockquote || {}) },
        table: { ...defaultTheme.table, ...(parsed.table || {}) },
        list: { ...defaultTheme.list, ...(parsed.list || {}) },
        inline: {
          ...defaultTheme.inline,
          ...(parsed.inline || {}),
          kbd: { ...defaultTheme.inline.kbd, ...(parsed.inline?.kbd || {}) }
        },
        code: {
          inline: { ...defaultTheme.code.inline, ...(parsed.code?.inline || {}) },
          block: { ...defaultTheme.code.block, ...(parsed.code?.block || {}) }
        },
        image: { ...defaultTheme.image, ...(parsed.image || {}) },
        divider: { ...defaultTheme.divider, ...(parsed.divider || {}) },
        footnotes: { ...defaultTheme.footnotes, ...(parsed.footnotes || {}) },
        outputBlock: { ...defaultTheme.outputBlock, ...(parsed.outputBlock || {}) },
        toc: { ...defaultTheme.toc, ...(parsed.toc || {}) },
        alerts: { ...defaultTheme.alerts, ...(parsed.alerts || {}) }
      }
      currentThemeId.value = parsed.id
      activeTheme.value = merged
      return { success: true }
    } catch (e: any) {
      return { success: false, error: e.message || 'JSON 解析失败' }
    }
  }

  return {
    currentThemeId,
    activeTheme,
    presetThemes: PRESET_THEMES,
    selectPreset,
    resetToPreset,
    exportThemeJson,
    importThemeJson
  }
})
