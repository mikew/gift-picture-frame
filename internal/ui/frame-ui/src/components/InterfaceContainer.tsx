import type * as Solid from 'solid-js'
import { createSignal, onCleanup } from 'solid-js'

import * as styles from './InterfaceContainer.css.ts'

const InterfaceCntainer: Solid.ParentComponent = (props) => {
  const [showUi, setShowUi] = createSignal(false)
  let hideTimer: number | undefined

  const bump = () => {
    if (hideTimer) {
      clearTimeout(hideTimer)
    }

    setShowUi(true)
    hideTimer = window.setTimeout(() => setShowUi(false), 2_000)
  }

  onCleanup(() => {
    if (hideTimer) {
      clearTimeout(hideTimer)
    }
  })

  return (
    <div
      class={styles.container}
      classList={{
        [styles.container]: true,
        [styles.containerVisible]: showUi(),
      }}
      onpointermove={() => {
        bump()
      }}
      ontouchstart={() => {
        bump()
      }}
      onmousedown={() => {
        bump()
      }}
    >
      {props.children}
    </div>
  )
}

export default InterfaceCntainer
