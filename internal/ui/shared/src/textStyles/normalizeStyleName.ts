import type { MessageStyle } from './theme.css.ts'
import { allStyleNames } from './theme.css.ts'

export function isValidStyleName(name: string): name is MessageStyle {
  for (const styleName of allStyleNames) {
    if (name === styleName) {
      return true
    }
  }

  return false
}

export function normalizeStyleName(name: string): MessageStyle {
  if (isValidStyleName(name)) {
    return name
  }

  return 'normal'
}
