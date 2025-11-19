import { globalStyle, style } from '@vanilla-extract/css'

export const iconClassess = {
  root: style({}),
}

globalStyle(`${iconClassess.root} svg`, {
  width: '1em',
  height: '1em',
  fontSize: '1.5em',
  verticalAlign: 'middle',
})
