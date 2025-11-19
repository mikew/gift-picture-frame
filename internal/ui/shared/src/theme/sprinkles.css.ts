import { themeContract } from './contract.css.ts'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

const spacing = {
  x1: themeContract.spacing.x1,
  x2: `calc(${themeContract.spacing.x1} * 2)`,
  x3: `calc(${themeContract.spacing.x1} * 3)`,
  x4: `calc(${themeContract.spacing.x1} * 4)`,
}

const colors = {
  primary: themeContract.color.primary.main,
  secondary: themeContract.color.secondary.main,

  info: themeContract.color.info.main,
  success: themeContract.color.success.main,
  warning: themeContract.color.warning.main,
  error: themeContract.color.error.main,

  background: themeContract.color.background,
  surface: themeContract.color.surface,

  textPrimary: themeContract.color.textPrimary,
  textSecondary: themeContract.color.textSecondary,

  white: themeContract.color.white,
  black: themeContract.color.black,
  transparent: 'transparent',
  inherit: 'inherit',
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
