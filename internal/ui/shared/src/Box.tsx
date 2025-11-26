import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'

import { clsx } from './clsx.ts'
import type { Sprinkles } from './theme/sprinkles.css.ts'
import { sprinkles } from './theme/sprinkles.css.ts'

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
