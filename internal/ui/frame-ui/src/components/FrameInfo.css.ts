import { style } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.js'
import { sprinkles } from 'shared/theme/sprinkles.css.js'

import { fancyPaperClasses } from './FancyPaper.css.ts'

export const container = style([
  fancyPaperClasses.root,
  sprinkles({
    position: 'absolute',
    display: 'flexRow',
    flexAlign: 'centerAll',
    borderRadius: 'infinite',
    paddingX: 'x2',
    paddingY: 'x1',
  }),
  {
    top: themeContract.spacing.x2,
    left: themeContract.spacing.x2,
  },
])

export const menu = style([
  fancyPaperClasses.root,
  sprinkles({
    borderRadius: 'default',
    padding: 'x2',
  }),
  {
    width: '250px',
  },
])
