import { style } from '@vanilla-extract/css'
import type { RecipeVariants } from '@vanilla-extract/recipes'
import { recipe } from '@vanilla-extract/recipes'

import { themeContract } from './theme/contract.css'
import { sprinkles } from './theme/sprinkles.css'

export const iconButtonRecipe = recipe({
  base: style([
    sprinkles({
      display: 'flexRow',
      flexAlign: 'centerAll',
      aspectRatio: 'square',
      cursor: 'pointer',
      borderRadius: 'circle',
      // color: 'inherit',
      padding: 'x1',
    }),
    {
      // width: '48px',
      display: 'inline-flex',
      // Intentionally using white here and not the color, gives better
      // consistency.
      borderTop: '1px solid color-mix(in srgb, #fff 40%, transparent)',
    },
  ]),

  variants: {
    color: {
      primary: sprinkles({
        color: 'primary.main',
      }),
      secondary: sprinkles({
        color: 'secondary.main',
      }),
      error: sprinkles({
        color: 'error.main',
      }),
      success: sprinkles({
        color: 'success.main',
      }),
      info: sprinkles({
        color: 'info.main',
      }),
      warning: sprinkles({
        color: 'warning.main',
      }),
      inherit: sprinkles({
        color: 'inherit',
      }),
    },

    size: {
      small: {
        fontSize: '0.875em',
        width: '32px',
        padding: `calc(${themeContract.spacing.x1} / 2) ${themeContract.spacing.x1}`,
      },
      medium: style([
        sprinkles({ padding: 'x1' }),
        {
          fontSize: '1em',
          width: '48px',
        },
      ]),
      large: style([
        sprinkles({ padding: 'x2' }),
        {
          fontSize: '1.125em',
          width: '64px',
        },
      ]),
    },
  },

  defaultVariants: {
    color: 'inherit',
    size: 'medium',
  },
})

export type IconButtonRecipeProps = RecipeVariants<typeof iconButtonRecipe>
