import { JSX, ParentComponent } from 'solid-js'

import { clsx } from './clsx.ts'
import { iconClasses } from './Icon.css.ts'

const Icon: ParentComponent<JSX.HTMLElementTags['span']> = ({
  children,
  ...props
}) => {
  return (
    <span {...props} class={clsx(iconClasses.root, props.class)}>
      {children}
    </span>
  )
}

export default Icon
