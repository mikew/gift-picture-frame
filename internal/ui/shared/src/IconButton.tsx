import type { Component, JSX} from 'solid-js';
import { splitProps } from 'solid-js'

import { clsx } from './clsx.ts'
import Icon from './Icon.tsx'
import type { IconButtonRecipeProps } from './IconButton.css.ts';
import { iconButtonRecipe } from './IconButton.css.ts'
import type { Sprinkles } from './theme/sprinkles.css.ts';
import { sprinkles } from './theme/sprinkles.css.ts'

export type IconButtonProps = IconButtonRecipeProps
  & JSX.HTMLElementTags['button'] & {
    sx?: Sprinkles
  }

const IconButton: Component<IconButtonProps> = (props) => {
  const [recipeProps, styleProps, childrenProps, rest] = splitProps(
    props,
    iconButtonRecipe.variants(),
    ['sx', 'class'],
    ['children'],
  )

  return (
    <button
      {...rest}
      class={clsx(
        iconButtonRecipe(recipeProps),
        styleProps.sx ? sprinkles(styleProps.sx) : undefined,
        styleProps.class,
      )}
    >
      <Icon>{childrenProps.children}</Icon>
    </button>
  )
}

export default IconButton
