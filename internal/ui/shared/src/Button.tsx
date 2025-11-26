import { splitProps } from 'solid-js'
import type { Component, JSX } from 'solid-js'

import type { ButtonRecipeProps } from './Button.css.ts'
import { buttonRecipe } from './Button.css.ts'
import { clsx } from './clsx.ts'
import { sprinkles } from './theme/sprinkles.css.ts'
import type { Sprinkles } from './theme/sprinkles.css.ts'

export type ButtonProps = ButtonRecipeProps
  & JSX.HTMLElementTags['button'] & {
    sx?: Sprinkles
  }

const Button: Component<ButtonProps> = (props) => {
  const [recipeProps, styleProps, rest] = splitProps(
    props,
    buttonRecipe.variants(),
    ['sx', 'class'],
  )

  return (
    <button
      {...rest}
      class={clsx(
        buttonRecipe(recipeProps),
        styleProps.sx ? sprinkles(styleProps.sx) : undefined,
        styleProps.class,
      )}
    />
  )
}

export default Button
