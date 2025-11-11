import type * as Solid from 'solid-js'
import { createEffect, createSignal, onCleanup } from 'solid-js'

import * as styles from './InterfaceContainer.css.ts'

const InterfaceCntainer: Solid.ParentComponent = (props) => {
  const [showUi, setShowUi] = createSignal(false)
  let hideTimer: ReturnType<typeof setTimeout> | undefined

  const bump = () => {
    if (hideTimer) {
      clearTimeout(hideTimer)
    }

    setShowUi(true)
    hideTimer = setTimeout(() => setShowUi(false), 2_000)
  }

  onCleanup(() => {
    if (hideTimer) {
      clearTimeout(hideTimer)
    }
  })

  createEffect(() => {
    if (showUi()) {
      document.body.style.cursor = 'default'
    } else {
      document.body.style.cursor = 'none'
    }
  })

  return (
    <div
      class={styles.container}
      classList={{
        [styles.container]: true,
        visible: showUi(),
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
