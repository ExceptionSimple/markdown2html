import type { ThemeConfig } from '../types'
import { wechatTheme } from './wechat'
import { academicTheme } from './academic'
import { geekTheme } from './geek'
import { zhihuTheme } from './zhihu'
import { warmTheme } from './warm'

export const PRESET_THEMES: ThemeConfig[] = [
  wechatTheme,
  academicTheme,
  geekTheme,
  zhihuTheme,
  warmTheme
]

export const DEFAULT_THEME_ID = 'wechat-default'

export function getThemeById(id: string): ThemeConfig {
  const found = PRESET_THEMES.find(t => t.id === id)
  if (found) {
    // Return deep cloned copy so customizations don't mutate preset
    return JSON.parse(JSON.stringify(found))
  }
  return JSON.parse(JSON.stringify(wechatTheme))
}

export * from './wechat'
export * from './academic'
export * from './geek'
export * from './zhihu'
export * from './warm'
