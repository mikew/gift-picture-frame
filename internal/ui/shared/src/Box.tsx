import { Component, JSX, splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { sprinkles, Sprinkles } from './theme/sprinkles.css.ts'
import { clsx } from './clsx.ts'

export type BoxProps = JSX.HTMLElementTags['div'] & Sprinkles

const Box: Component<BoxProps> = (props) => {
  const [styleProps, sxProps, rest] = splitProps(
    props,
    ['class'],
    Array.from(sprinkles.properties),
  )

  return <div {...rest} class={clsx(sprinkles(sxProps), styleProps.class)} />
}

export default Box
