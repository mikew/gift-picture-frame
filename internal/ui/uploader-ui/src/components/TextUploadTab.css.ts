import { style } from '@vanilla-extract/css'
import { sprinkles } from 'shared/theme/sprinkles.css.js'

export const textPreview = style([
  sprinkles({
    display: 'flexColumn',
    borderRadius: 'default',
    marginBottom: 'x2',
    overflow: 'hidden',
    backgroundColor: 'background',
  }),
  {
    minHeight: '150px',
    // border: '1px solid #dee2e6',
  },
])
