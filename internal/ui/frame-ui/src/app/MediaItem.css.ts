import { globalStyle, style } from '@vanilla-extract/css'
import { sprinkles } from 'shared/theme/sprinkles.css.js'

export const container = style([
  sprinkles({
    position: 'absolute',
    display: 'flexColumn',
    flexAlign: 'centerAll',
  }),
  {
    inset: 0,
  },
])

globalStyle(`${container} > img, ${container} > video`, {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
})
