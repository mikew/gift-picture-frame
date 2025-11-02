import { createThemeContract } from '@vanilla-extract/css'

export const themeContract = createThemeContract({
  color: {
    primary: null,
    primaryLight: null,
    primaryDark: null,

    secondary: null,
    secondaryLight: null,
    secondaryDark: null,

    background: null,
    surface: null,

    textPrimary: null,
    textSecondary: null,

    success: null,
    warning: null,
    error: null,
    info: null,

    white: null,
    black: null,
  },
  spacing: {
    px: null,
    sm: null,
    md: null,
    lg: null,
  },
  radii: {
    sm: null,
    md: null,
  },
})
