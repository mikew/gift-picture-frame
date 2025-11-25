import { Component, JSX, splitProps } from 'solid-js'
import Icon from './Icon.tsx'
import { iconButtonClasses } from './IconButton.css.ts'
import { clsx } from './clsx.ts'
import { sprinkles, Sprinkles } from './theme/sprinkles.css.ts'

export type IconButtonProps = JSX.HTMLElementTags['button'] & {
  sx?: Sprinkles
}

const IconButton: Component<IconButtonProps> = (props) => {
  const [styleProps, childrenProps, rest] = splitProps(
    props,
    ['sx', 'class'],
    ['children'],
  )

  return (
    <button
      {...rest}
      class={clsx(
        iconButtonClasses.root,
        styleProps.sx ? sprinkles(styleProps.sx) : undefined,
        styleProps.class,
      )}
    >
      <Icon>{childrenProps.children}</Icon>
    </button>
  )
}

export default IconButton
