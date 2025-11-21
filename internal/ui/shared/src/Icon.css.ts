import { globalStyle, style } from '@vanilla-extract/css'

export const iconClasses = {
  root: style({}),
}

globalStyle(`${iconClasses.root} svg`, {
  width: '1em',
  height: '1em',
  fontSize: '1.5em',
  verticalAlign: 'middle',
})
