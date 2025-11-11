import { globalStyle, style } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.js'

export const container = style({
  maxWidth: '600px',
  margin: '0 auto',
  padding: themeContract.spacing.x2,
})

export const uploadSection = style({
  background: themeContract.color.surface,
  borderRadius: themeContract.radii.default,
  padding: themeContract.spacing.x2,
  margin: `${themeContract.spacing.x2} 0`,
})

globalStyle('body', {
  backgroundColor: themeContract.color.background,
  color: themeContract.color.textPrimary,
  fontFamily: 'system-ui, sans-serif',
})
