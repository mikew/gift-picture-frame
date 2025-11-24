import { style } from '@vanilla-extract/css'
import { sprinkles } from './theme/sprinkles.css'

export const iconButtonClasses = {
  root: style([
    sprinkles({
      display: 'flexRow',
      flexAlign: 'centerAll',
      aspectRatio: 'square',
      cursor: 'pointer',
      borderRadius: 'circle',
      color: 'inherit',
      padding: 'x1',
    }),
    {
      width: '48px',
      display: 'inline-flex',
      borderTop: '1px solid color-mix(in srgb, #fff 40%, transparent)',
    },
  ]),
}
