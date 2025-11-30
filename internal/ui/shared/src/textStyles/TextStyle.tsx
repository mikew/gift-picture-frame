import type { ParentComponent } from 'solid-js'

import { clsx } from '../clsx.ts'

import { normalizeStyleName } from './normalizeStyleName'
import * as textStyles from './theme.css.ts'

interface TextStyleProps {
  textStyle: string
}

const TextStyle: ParentComponent<TextStyleProps> = (props) => {
  return (
    <div
      class={clsx(
        textStyles.themeClass,
        textStyles.messageStyles[normalizeStyleName(props.textStyle)],
      )}
    >
      {props.children}
    </div>
  )
}

export default TextStyle
