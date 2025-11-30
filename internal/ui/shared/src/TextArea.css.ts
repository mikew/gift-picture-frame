import { style } from '@vanilla-extract/css'

import { sprinkles } from './theme/sprinkles.css'

export const textAreaClasses = {
  root: style([
    sprinkles({
      borderRadius: 'default',
      paddingX: 'x2',
      paddingY: 'x1',
    }),
    {
      'border': '1px solid color-mix(in srgb, currentColor 30%, transparent)',

      ':focus': {
        borderColor: 'color-mix(in srgb, currentColor 80%, transparent)',
      },
    },
  ]),
}
