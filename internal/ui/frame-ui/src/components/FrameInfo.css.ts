import { style } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.js'
import * as util from 'shared/theme/util.css.ts'

export const container = style([
  util.positionAbsolute,
  {
    top: themeContract.spacing.x2,
    left: themeContract.spacing.x2,
    padding: themeContract.spacing.x2,
    backgroundColor: themeContract.color.surface,
    borderRadius: themeContract.radii.infinite,
  },
])
