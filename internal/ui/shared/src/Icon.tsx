import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'

import { clsx } from './clsx.ts'
import { iconClasses } from './Icon.css.ts'
import type { Sprinkles } from './theme/sprinkles.css.ts'
import { sprinkles } from './theme/sprinkles.css.ts'

export type IconProps = JSX.HTMLElementTags['span'] & {
  sx?: Sprinkles
}

const Icon: Component<IconProps> = (props) => {
  const [styleProps, rest] = splitProps(props, ['sx', 'class'])

  return (
    <span
      {...rest}
      class={clsx(
        iconClasses.root,
        styleProps.sx ? sprinkles(styleProps.sx) : undefined,
        styleProps.class,
      )}
    />
  )
}

export default Icon
