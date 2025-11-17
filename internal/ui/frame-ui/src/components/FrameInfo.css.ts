import { style } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.js'
import * as util from 'shared/theme/util.css.ts'

export const surface = style({
  backgroundColor: themeContract.color.surface,
  padding: themeContract.spacing.x2,
})

export const container = style([
  util.positionAbsolute,
  util.flexRow,
  util.flexCenterContent,
  surface,
  {
    top: themeContract.spacing.x2,
    left: themeContract.spacing.x2,
    borderRadius: themeContract.radii.infinite,
  },
])

export const menu = style([
  surface,
  {
    borderRadius: themeContract.radii.default,
  },
])
