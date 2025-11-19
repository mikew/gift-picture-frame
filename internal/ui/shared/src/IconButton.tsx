import { JSX, ParentComponent } from 'solid-js'
import Icon from './Icon.tsx'
import { iconButtonClasses } from './IconButton.css.ts'
import { clsx } from './clsx.ts'

const IconButton: ParentComponent<JSX.HTMLElementTags['button']> = ({
  children,
  ...props
}) => {
  return (
    <button {...props} class={clsx(iconButtonClasses.root, props.class)}>
      <Icon>{children}</Icon>
    </button>
  )
}

export default IconButton
