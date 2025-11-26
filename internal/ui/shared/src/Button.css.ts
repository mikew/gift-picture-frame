import { style } from '@vanilla-extract/css'
import type { RecipeVariants } from '@vanilla-extract/recipes'
import { recipe } from '@vanilla-extract/recipes'

import { themeContract } from './theme/contract.css.ts'
import { sprinkles } from './theme/sprinkles.css.ts'

export const buttonRecipe = recipe({
  base: sprinkles({
    borderRadius: 'infinite',
    cursor: 'pointer',
    display: 'flexRow',
    flexAlign: 'centerAll',
  }),

  variants: {
    color: {
      primary: sprinkles({
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
      }),
      secondary: sprinkles({
        backgroundColor: 'secondary.main',
        color: 'secondary.contrastText',
      }),
      error: sprinkles({
        backgroundColor: 'error.main',
        color: 'error.contrastText',
      }),
      success: sprinkles({
        backgroundColor: 'success.main',
        color: 'success.contrastText',
      }),
      info: sprinkles({
        backgroundColor: 'info.main',
        color: 'info.contrastText',
      }),
      warning: sprinkles({
        backgroundColor: 'warning.main',
        color: 'warning.contrastText',
      }),
    },

    size: {
      small: {
        padding: `calc(${themeContract.spacing.x1} / 2) ${themeContract.spacing.x1}`,
        fontSize: '0.875em',
      },
      medium: style([
        sprinkles({
          paddingY: 'x1',
          paddingX: 'x2',
        }),
        {
          fontSize: '1em',
        },
      ]),
      large: style([
        sprinkles({
          paddingY: 'x2',
          paddingX: 'x3',
        }),
        {
          fontSize: '1.125em',
        },
      ]),
    },
  },

  defaultVariants: {
    color: 'primary',
    size: 'medium',
  },
})

export type ButtonRecipeProps = RecipeVariants<typeof buttonRecipe>
