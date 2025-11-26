import type { Component, JSX} from 'solid-js';
import { splitProps } from 'solid-js'

import { clsx } from './clsx'
import { paperClasses } from './Paper.css'
import type { Sprinkles } from './theme/sprinkles.css';
import { sprinkles } from './theme/sprinkles.css'

export type PaperProps = JSX.HTMLElementTags['div'] & {
  sx?: Sprinkles
}

const Paper: Component<PaperProps> = (props) => {
  const [styleProps, rest] = splitProps(props, ['sx', 'class'])

  return (
    <div
      {...rest}
      class={clsx(
        paperClasses.root,
        styleProps.sx ? sprinkles(styleProps.sx) : undefined,
        styleProps.class,
      )}
    />
  )
}

export default Paper
