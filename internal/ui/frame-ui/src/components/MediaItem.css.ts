import { globalStyle, style } from '@vanilla-extract/css'
import * as util from 'shared/theme/util.css.ts'

export const container = style([
  util.positionAbsolute,
  util.flexColumn,
  util.flexCenterContent,
  {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
])

globalStyle(`${container} > img, ${container} > video`, {
  width: '99%',
  height: '99%',
  objectFit: 'contain',
})
