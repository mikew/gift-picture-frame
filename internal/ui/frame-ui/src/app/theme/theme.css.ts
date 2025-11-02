import { createTheme } from '@vanilla-extract/css'

import { themeContract } from './contract.css.ts'

export const lightThemeClass = createTheme(themeContract, {
  color: {
    primary: '#1976d2',
    primaryLight: '#63a4ff',
    primaryDark: '#115293',

    secondary: '#9c27b0',
    secondaryLight: '#d05ce3',
    secondaryDark: '#6a0080',

    background: '#ffffff',
    surface: '#f5f5f5',

    textPrimary: '#0f1720',
    textSecondary: '#475569',

    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',

    white: '#ffffff',
    black: '#000000',
  },

  spacing: {
    px: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
  },

  radii: {
    sm: '6px',
    md: '8px',
    round: '50%',
    infinite: '9999px',
  },
})
