import { Component, createEffect, JSX, splitProps } from 'solid-js'
import { sprinkles, Sprinkles } from './theme/sprinkles.css.ts'
import { clsx } from './clsx.ts'
import { inputClasses } from './Input.css.ts'
import { Dynamic } from 'solid-js/web'

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
