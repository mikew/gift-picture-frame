import { style } from '@vanilla-extract/css'
import { sprinkles } from 'shared/theme/sprinkles.css.js'

export const container = style([
  sprinkles({
    cursor: 'pointer',
    borderRadius: 'default',
    padding: 'x3',
  }),
  {
    // TODO border color should be in theme as separator color or divider color
    // or something.
    // TODO Some of these exist as utils.
    border: `2px dashed #dee2e6`,
    textAlign: 'center',
    // cursor: 'pointer',
    transition: `var(--tr-base)`,

    selectors: {
      '&:hover, &.dragover': {
        backgroundColor: '#f0f',
      },
    },
  },
])

export const fileListRoot = style({})

export const fileInfo = style({
  flexGrow: '1',
})

export const fileListItemRoot = style([
  sprinkles({
    display: 'flexRow',
    gap: 'x1',
    flexAlign: 'centerY',
  }),
])

export const filePreview = style([
  // util.aspectRatioSquare,
  {
    width: '50px',
  },
])
