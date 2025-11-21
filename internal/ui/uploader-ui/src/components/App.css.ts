import { globalStyle, style } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.js'
import { sprinkles } from 'shared/theme/sprinkles.css.js'

export const container = style([
  sprinkles({
    padding: 'x2',
  }),
  {
    maxWidth: '600px',
    margin: '0 auto',
  },
])

export const uploadSection = style([
  sprinkles({
    backgroundColor: 'surface',
    borderRadius: 'default',
    padding: 'x2',
    marginY: 'x2',
  }),
])

globalStyle('body', {
  backgroundColor: themeContract.color.background,
  color: themeContract.color.textPrimary,
  fontFamily: 'system-ui, sans-serif',
})
