import { style } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.ts'
import * as util from 'shared/theme/util.css.ts'

export const container = style([
  util.positionAbsolute,
  util.flexRow,
  util.flexCenterContent,
  util.gapx3,
  {
    bottom: themeContract.spacing.x4,
    left: '50%',
    transform: 'translateX(-50%)',
  },
])

export const controlButton = style([
  util.pointerCursor,
  util.flexRow,
  util.flexCenterContent,
  util.aspectRatioSquare,
  util.iconContainer,
  {
    'background': 'rgba(50, 50, 50, 0.4)',
    'border': 'none',
    'color': themeContract.color.white,
    'width': '60px',

    ':hover': {
      background: 'rgba(50, 50, 50, 0.6)',
      transform: 'scale(1.1)',
    },
    ':active': {
      transform: 'scale(0.95)',
    },

    // TODO Vars or another util class for these
    'borderRadius': '50%',
    'backdropFilter': 'blur(10px)',
    'transition': 'var(--tr-scale)',
    'fontSize': '2rem',
  },
])

export const controlButtonLarge = style([
  controlButton,
  {
    width: '100px',
    fontSize: '3rem',
  },
])
