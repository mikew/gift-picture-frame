import { children, Component, JSX, splitProps } from 'solid-js'

import { clsx } from './clsx.ts'
import { iconClasses } from './Icon.css.ts'
import { sprinkles, Sprinkles } from './theme/sprinkles.css.ts'

export type IconProps = JSX.HTMLElementTags['span'] & {
  sx?: Sprinkles
}

const Icon: Component<IconProps> = (props) => {
  const [styleProps, childrenProps, rest] = splitProps(
    props,
    ['sx', 'class'],
    ['children'],
  )

  const child = children(() => childrenProps.children)

  return (
    <span
      {...rest}
      class={clsx(
        iconClasses.root,
        styleProps.sx ? sprinkles(styleProps.sx) : undefined,
        styleProps.class,
      )}
    >
      {child()}
    </span>
  )
}

export default Icon
