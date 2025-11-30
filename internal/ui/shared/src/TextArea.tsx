import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'

import { clsx } from './clsx.ts'
import { textAreaClasses } from './TextArea.css.ts'
import type { Sprinkles } from './theme/sprinkles.css.ts'
import { sprinkles } from './theme/sprinkles.css.ts'

export type TextAreaProps = JSX.HTMLElementTags['textarea'] & {
  sx?: Sprinkles
}

const TextArea: Component<TextAreaProps> = (props) => {
  const [styleProps, rest] = splitProps(props, ['sx', 'class'])

  return (
    <textarea
      {...rest}
      class={clsx(
        textAreaClasses.root,
        styleProps.sx ? sprinkles(styleProps.sx) : undefined,
        styleProps.class,
      )}
    />
  )
}

export default TextArea
