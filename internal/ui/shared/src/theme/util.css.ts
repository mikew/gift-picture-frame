import { globalStyle, style } from '@vanilla-extract/css'

export const fullSize = style({
  width: '100%',
  height: '100%',
})

export const textEllipsis = style({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const iconContainer = style({})

globalStyle(`${iconContainer} svg`, {
  width: '1em',
  height: '1em',
  fontSize: '1.5em',
})
