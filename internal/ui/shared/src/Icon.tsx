import { JSX, ParentComponent } from 'solid-js'

import { clsx } from './clsx.ts'
import { iconClassess } from './Icon.css.ts'

const Icon: ParentComponent<JSX.HTMLElementTags['span']> = ({
  children,
  ...props
}) => {
  return (
    <span {...props} class={clsx(iconClassess.root, props.class)}>
      {children}
    </span>
  )
}

export default Icon
