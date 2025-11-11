import { MessageStyle, allStyleNames } from './theme.css.ts'

export function isValidStyleName(name: string): name is MessageStyle {
  return allStyleNames.includes(name as MessageStyle)
}

export function normalizeStyleName(name: string): MessageStyle {
  if (isValidStyleName(name)) {
    return name
  }

  return 'normal'
}
