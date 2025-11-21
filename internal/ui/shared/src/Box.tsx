import { ParentComponent } from 'solid-js'
import { sprinkles, Sprinkles } from './theme/sprinkles.css.ts'

export interface BoxProps extends Sprinkles {}

export const Box: ParentComponent<BoxProps> = ({
  children,
  ...sprinklesProps
}) => {
  return <div class={sprinkles(sprinklesProps)}>{children}</div>
}
