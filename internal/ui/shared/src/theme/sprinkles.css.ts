import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import { themeContract } from './contract.css.ts'

const spacing = {
  x1: themeContract.spacing.x1,
  x2: themeContract.spacing.x2,
  x3: themeContract.spacing.x3,
  x4: themeContract.spacing.x4,
}

const colors = {
  'primary.main': themeContract.color.primary.main,
  'primary.light': themeContract.color.primary.light,
  'primary.dark': themeContract.color.primary.dark,
  'primary.contrastText': themeContract.color.primary.contrastText,

  'secondary.main': themeContract.color.secondary.main,
  'secondary.light': themeContract.color.secondary.light,
  'secondary.dark': themeContract.color.secondary.dark,
  'secondary.contrastText': themeContract.color.secondary.contrastText,

  'info.main': themeContract.color.info.main,
  'info.light': themeContract.color.info.light,
  'info.dark': themeContract.color.info.dark,
  'info.contrastText': themeContract.color.info.contrastText,

  'success.main': themeContract.color.success.main,
  'success.light': themeContract.color.success.light,
  'success.dark': themeContract.color.success.dark,
  'success.contrastText': themeContract.color.success.contrastText,

  'warning.main': themeContract.color.warning.main,
  'warning.light': themeContract.color.warning.light,
  'warning.dark': themeContract.color.warning.dark,
  'warning.contrastText': themeContract.color.warning.contrastText,

  'error.main': themeContract.color.error.main,
  'error.light': themeContract.color.error.light,
  'error.dark': themeContract.color.error.dark,
  'error.contrastText': themeContract.color.error.contrastText,

  'background': themeContract.color.background,
  'surface': themeContract.color.surface,

  'text.primary': themeContract.color.textPrimary,
  'text.secondary': themeContract.color.textSecondary,

  'white': themeContract.color.white,
  'black': themeContract.color.black,

  'transparent': 'transparent',
  'inherit': 'inherit',
}

const properties = defineProperties({
  properties: {
    display: {
      flexRow: {
        display: 'flex',
        flexDirection: 'row',
      },

      flexColumn: {
        display: 'flex',
        flexDirection: 'column',
      },

      grid: {
        display: 'grid',
      },

      block: {
        display: 'block',
      },

      none: {
        display: 'none',
      },
    },

    flexWrap: ['wrap', 'nowrap'],

    overflow: ['hidden', 'auto', 'scroll'],

    position: ['relative', 'absolute', 'fixed', 'sticky'],

    cursor: ['pointer', 'default', 'not-allowed', 'none'],

    gap: spacing,

    paddingTop: spacing,
    paddingBottom: spacing,
    paddingLeft: spacing,
    paddingRight: spacing,

    marginTop: spacing,
    marginBottom: spacing,
    marginLeft: spacing,
    marginRight: spacing,

    aspectRatio: {
      square: '1 / 1',
      r16by9: '16 / 9',
      r4by3: '4 / 3',
      r3by2: '3 / 2',
      r21by9: '21 / 9',
      r9by16: '9 / 16',
    },

    backgroundColor: colors,
    color: colors,
    borderColor: colors,

    borderRadius: {
      default: themeContract.radii.default,
      round: themeContract.radii.round,
      circle: themeContract.radii.round,
      infinite: themeContract.radii.infinite,
    },

    flexAlign: {
      centerAll: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      centerY: {
        alignItems: 'center',
      },
      centerX: {
        justifyContent: 'center',
      },
      spaceBetween: {
        justifyContent: 'space-between',
      },
    },

    width: {
      fitContent: 'fit-content',
      full: '100%',
    },

    height: {
      fitContent: 'fit-content',
      full: '100%',
    },
  },

  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],

    margin: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
  },
})

export const sprinkles = createSprinkles(properties)
export type Sprinkles = Parameters<typeof sprinkles>[0]
