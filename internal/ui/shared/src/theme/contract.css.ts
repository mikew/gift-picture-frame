import { createThemeContract } from '@vanilla-extract/css'

export const themeContract = createThemeContract({
  color: {
    primary: {
      light: null,
      main: null,
      dark: null,
    },

    secondary: {
      light: null,
      main: null,
      dark: null,
    },

    success: {
      light: null,
      main: null,
      dark: null,
    },
    warning: {
      light: null,
      main: null,
      dark: null,
    },
    error: {
      light: null,
      main: null,
      dark: null,
    },
    info: {
      light: null,
      main: null,
      dark: null,
    },

    background: null,
    surface: null,

    textPrimary: null,
    textSecondary: null,

    white: null,
    black: null,
  },

  spacing: {
    x1: null,
    x2: null,
    x3: null,
    x4: null,
  },

  radii: {
    default: null,
    round: null,
    infinite: null,
  },

  easing: {
    inOut: null,
    out: null,
    in: null,
    sharp: null,
  },

  duration: {
    shortest: null,
    shorter: null,
    short: null,
    standard: null,
    complex: null,
    entering: null,
    leaving: null,
  },
})
