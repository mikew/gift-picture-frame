import { style } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.js'
import { sprinkles } from 'shared/theme/sprinkles.css.js'

export const surface = style([
  sprinkles({
    backgroundColor: 'surface',
  }),
])

export const container = style([
  surface,
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
  surface,
  sprinkles({
    borderRadius: 'default',
    padding: 'x2',
  }),
])
