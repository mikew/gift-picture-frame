import { createTheme } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.ts'

export const lightThemeClass = createTheme(themeContract, {
  color: {
    primary: {
      light: '#63a4ff',
      main: '#1976d2',
      dark: '#115293',
    },

    secondary: {
      light: '#d05ce3',
      main: '#9c27b0',
      dark: '#6a0080',
    },

    success: {
      light: '#81c784',
      main: '#4caf50',
      dark: '#388e3c',
    },
    warning: {
      light: '#ffb74d',
      main: '#ff9800',
      dark: '#f57c00',
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
    },
    info: {
      light: '#64b5f6',
      main: '#2196f3',
      dark: '#1976d2',
    },

    background: '#000',
    surface: '#333',

    textPrimary: '#0f1720',
    textSecondary: '#475569',

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
    default: '8px',
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
