import { children, Component, JSX, splitProps } from 'solid-js'
import { sprinkles, Sprinkles } from './theme/sprinkles.css.ts'
import { clsx } from './clsx.ts'

export type BoxProps = JSX.HTMLElementTags['div'] & Sprinkles

const Box: Component<BoxProps> = (props) => {
  const [styleProps, sxProps, childrenProps, rest] = splitProps(
    props,
    ['class'],
    Array.from(sprinkles.properties),
    ['children'],
  )

  const child = children(() => childrenProps.children)

  return (
    <div {...rest} class={clsx(sprinkles(sxProps), styleProps.class)}>
      {child()}
    </div>
  )
}

export default Box
