import { style } from '@vanilla-extract/css'

import { themeContract } from '#src/app/theme/contract.css.ts'
import {
  aspectRatioSquare,
  flexCenterContent,
  flexRow,
  gapSm,
  pointerCursor,
  positionAbsolute,
} from '#src/app/theme/util.css.ts'

export const container = style([
  positionAbsolute,
  flexRow,
  flexCenterContent,
  gapSm,
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
  pointerCursor,
  flexRow,
  flexCenterContent,
  aspectRatioSquare,
  {
    background: 'rgba(0, 0, 0, 0.6)',
    border: 'none',
    color: themeContract.color.white,
    width: '60px',
    // height: '60px',

    selectors: {
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.2)',
        transform: 'scale(1.1)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
    },

    // TODO Vars or another util class for these
    borderRadius: '50%',
    backdropFilter: 'blur(10px)',
    transition: 'var(--tr-scale)',
    fontSize: '2rem',
  },
])
