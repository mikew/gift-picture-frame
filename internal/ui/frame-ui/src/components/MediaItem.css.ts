import { globalStyle, style } from '@vanilla-extract/css'
import * as util from 'shared/theme/util.css.ts'

export const container = style([
  util.positionAbsolute,
  {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
])

globalStyle(`${container} > img, ${container} > video`, {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
})
