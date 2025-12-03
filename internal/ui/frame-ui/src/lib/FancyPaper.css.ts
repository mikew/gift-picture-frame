import { style } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.js'
import { sprinkles } from 'shared/theme/sprinkles.css.js'

export const fancyPaperClasses = {
  root: style([
    sprinkles({
      borderRadius: 'default',
    }),
    {
      backdropFilter: 'blur(10px)',
      // Make  `themeContract.color.surface` transparent with color-mix
      backgroundColor: `color-mix(in srgb, ${themeContract.color.surface} 80%, transparent)`,
    },
  ]),
}
