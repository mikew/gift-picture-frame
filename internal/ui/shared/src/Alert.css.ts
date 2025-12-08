import type { RecipeVariants } from '@vanilla-extract/recipes'
import { recipe } from '@vanilla-extract/recipes'

import { sprinkles } from './theme/sprinkles.css.ts'

export const alertRecipe = recipe({
  base: sprinkles({
    borderRadius: 'default',
    padding: 'x1',
  }),

  variants: {
    severity: {
      info: sprinkles({
        backgroundColor: 'info.main',
        color: 'info.contrastText',
      }),
      success: sprinkles({
        backgroundColor: 'success.main',
        color: 'success.contrastText',
      }),
      warning: sprinkles({
        backgroundColor: 'warning.main',
        color: 'warning.contrastText',
      }),
      error: sprinkles({
        backgroundColor: 'error.main',
        color: 'error.contrastText',
      }),
    },
  },

  defaultVariants: {
    severity: 'info',
  },
})

export type AlertRecipeProps = RecipeVariants<typeof alertRecipe>
