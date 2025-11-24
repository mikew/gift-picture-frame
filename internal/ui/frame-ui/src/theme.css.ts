import { createTheme } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.ts'

export const lightThemeClass = createTheme(themeContract, {
  color: {
    primary: {
      light: '#63a4ff',
      main: '#1976d2',
      dark: '#115293',
      contrastText: '#ffffff',
    },

    secondary: {
      light: '#7e57c2',
      main: '#545454',
      dark: '#311b92',
      contrastText: '#ffffff',
    },

    success: {
      light: '#81c784',
      main: '#4caf50',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    warning: {
      light: '#ffb74d',
      main: '#ff9800',
      dark: '#f57c00',
      contrastText: '#ffffff',
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#ffffff',
    },
    info: {
      light: '#64b5f6',
      main: '#2196f3',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },

    background: '#000',
    surface: '#333',

    textPrimary: '#fff',
    textSecondary: 'rgba(255, 255, 255, 0.4)',

    white: '#ffffff',
    black: '#000000',
  },

  duration: {
    shortest: '150ms',
    shorter: '200ms',
    short: '250ms',
    standard: '300ms',
    complex: '375ms',
    entering: '225ms',
    leaving: '195ms',
  },

  spacing: {
    x1: '8px',
    x2: '16px',
    x3: '24px',
    x4: '32px',
  },

  radii: {
    default: '16px',
    round: '50%',
    infinite: '9999px',
  },

  easing: {
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    out: 'cubic-bezier(0.0, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
})
