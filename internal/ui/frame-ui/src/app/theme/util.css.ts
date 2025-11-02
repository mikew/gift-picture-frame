import { style } from '@vanilla-extract/css'

import { themeContract } from './contract.css.ts'

export const flexColumn = style({
  display: 'flex',
  flexDirection: 'column',
})

export const flexRow = style({
  display: 'flex',
  flexDirection: 'row',
})

export const fullSize = style({
  width: '100%',
  height: '100%',
})

export const flexCenterContent = style({
  justifyContent: 'center',
  alignItems: 'center',
})

export const flexSpaceBetween = style({
  justifyContent: 'space-between',
})

export const flexWrap = style({
  flexWrap: 'wrap',
})

export const flexNoWrap = style({
  flexWrap: 'nowrap',
})

export const overflowHidden = style({
  overflow: 'hidden',
})

export const overflowAuto = style({
  overflow: 'auto',
})

export const pointerCursor = style({
  cursor: 'pointer',
})

export const positionRelative = style({
  position: 'relative',
})

export const positionAbsolute = style({
  position: 'absolute',
})

export const textEllipsis = style({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const gapPx = style({
  gap: themeContract.spacing.px,
})

export const gapSm = style({
  gap: themeContract.spacing.sm,
})

export const gapMd = style({
  gap: themeContract.spacing.md,
})

export const gapLg = style({
  gap: themeContract.spacing.lg,
})

export const aspectRatioSquare = style({
  aspectRatio: '1 / 1',
})

export const aspectRatio16by9 = style({
  aspectRatio: '16 / 9',
})

export const aspectRatio4by3 = style({
  aspectRatio: '4 / 3',
})

export const aspectRatio3by2 = style({
  aspectRatio: '3 / 2',
})

export const aspectRatio21by9 = style({
  aspectRatio: '21 / 9',
})

export const aspectRatio9by16 = style({
  aspectRatio: '9 / 16',
})
