import { splitProps } from 'solid-js'
import type { Component, JSX } from 'solid-js'

import type { AlertRecipeProps } from './Alert.css.ts'
import { alertRecipe } from './Alert.css.ts'
import { clsx } from './clsx.ts'
import { sprinkles } from './theme/sprinkles.css.ts'
import type { Sprinkles } from './theme/sprinkles.css.ts'

export type AlertProps = AlertRecipeProps
  & JSX.HTMLElementTags['div'] & {
    sx?: Sprinkles
  }

const Alert: Component<AlertProps> = (props) => {
  const [recipeProps, styleProps, rest] = splitProps(
    props,
    alertRecipe.variants(),
    ['sx', 'class'],
  )

  return (
    <div
      {...rest}
      class={clsx(
        alertRecipe(recipeProps),
        styleProps.sx ? sprinkles(styleProps.sx) : undefined,
        styleProps.class,
      )}
    />
  )
}

export default Alert
