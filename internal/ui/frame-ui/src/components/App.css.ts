import { style } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.js'
import * as util from 'shared/theme/util.css.ts'

export const container = style([
  util.overflowHidden,
  util.flexColumn,
  util.flexCenterContent,
  {
    width: '100vw',
    height: '100vh',
    backgroundColor: themeContract.color.background,
  },
])
