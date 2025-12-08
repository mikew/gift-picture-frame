import { style } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.js'
import { sprinkles } from 'shared/theme/sprinkles.css.js'

export const container = style([
  sprinkles({
    position: 'fixed',
  }),
  {
    color: themeContract.color.white,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    opacity: 0,

    transition: 'var(--tr-fade-out)',

    selectors: {
      '&.visible': {
        transition: 'var(--tr-fade-in)',
        opacity: 1,
        pointerEvents: 'auto',
      },
    },
  },
])
