import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'

import { clsx } from './clsx.ts'
import { selectClasses } from './Select.css.ts'
import type { Sprinkles } from './theme/sprinkles.css.ts'
import { sprinkles } from './theme/sprinkles.css.ts'

export type SelectProps = JSX.HTMLElementTags['select'] & {
  sx?: Sprinkles
}

const Select: Component<SelectProps> = (props) => {
  const [styleProps, rest] = splitProps(props, ['sx', 'class'])

  return (
    <select
      {...rest}
      class={clsx(
        selectClasses.root,
        styleProps.sx ? sprinkles(styleProps.sx) : undefined,
        styleProps.class,
      )}
    />
  )
}

export default Select
