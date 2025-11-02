import { style } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.ts'
import * as util from 'shared/theme/util.css.ts'

export const container = style([
  util.positionAbsolute,
  util.flexRow,
  util.flexCenterContent,
  util.gapx1,
  {
    color: themeContract.color.white,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    opacity: 0,

    transition: 'var(--tr-fade-out)',
  },
])

export const containerVisible = style({
  transition: 'var(--tr-fade-in)',
  opacity: 1,
  pointerEvents: 'auto',
})

export const controlButton = style([
  util.pointerCursor,
  util.flexRow,
  util.flexCenterContent,
  util.aspectRatioSquare,
  {
    'background': 'rgba(0, 0, 0, 0.6)',
    'border': 'none',
    'color': themeContract.color.white,
    'width': '60px',

    ':hover': {
      background: 'rgba(255, 255, 255, 0.2)',
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
