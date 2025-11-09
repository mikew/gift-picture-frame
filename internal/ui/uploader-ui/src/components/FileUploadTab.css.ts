import { style } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.js'
import * as util from 'shared/theme/util.css.ts'

export const container = style([
  util.pointerCursor,
  {
    // TODO border color should be in theme as separator color or divider color
    // or something.
    // TODO Some of these exist as utils.
    border: `2px dashed #dee2e6`,
    borderRadius: themeContract.radii.default,
    padding: themeContract.spacing.x3,
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
