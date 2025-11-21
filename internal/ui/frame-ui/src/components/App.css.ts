import { globalStyle, style } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.js'
import { sprinkles } from 'shared/theme/sprinkles.css.js'

export const container = style([
  sprinkles({
    overflow: 'hidden',
    display: 'flexColumn',
    flexAlign: 'centerAll',
    backgroundColor: 'background',
  }),
  {
    width: '100vw',
    height: '100vh',
  },
])

globalStyle('body', {
  backgroundColor: themeContract.color.background,
  color: themeContract.color.textPrimary,
  fontFamily: 'system-ui, sans-serif',
})
