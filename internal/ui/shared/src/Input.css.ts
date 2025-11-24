import { style } from '@vanilla-extract/css'
import { sprinkles } from './theme/sprinkles.css'

export const inputClasses = {
  root: style([
    sprinkles({
      borderRadius: 'default',
      paddingX: 'x2',
      paddingY: 'x1',
    }),
    {
      border: '1px solid color-mix(in srgb, currentColor 50%, transparent)',
    },
  ]),
}
