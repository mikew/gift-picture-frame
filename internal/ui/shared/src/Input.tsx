import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { clsx } from './clsx.ts'
import { inputClasses } from './Input.css.ts'
import type { Sprinkles } from './theme/sprinkles.css.ts'
import { sprinkles } from './theme/sprinkles.css.ts'

export type InputProps = JSX.HTMLElementTags['input'] & {
  sx?: Sprinkles
}

const Input: Component<InputProps> = (props) => {
  const [styleProps, rest] = splitProps(props, ['sx', 'class', 'children'])

  return (
    <Dynamic
      {...rest}
      component="input"
      class={clsx(
        inputClasses.root,
        styleProps.sx ? sprinkles(styleProps.sx) : undefined,
        styleProps.class,
      )}
    />
  )
}

export default Input
