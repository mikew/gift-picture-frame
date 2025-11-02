import { createSignal, onCleanup } from 'solid-js'

import * as styles from './Controls.css.ts'

interface ControlsProps {
  onPrevious: () => void
  onNext: () => void
  onTogglePlayPause: () => void
  isPlaying: boolean
}

export default function Controls(props: ControlsProps) {
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
      <button
        class={styles.controlButton}
        title="Previous"
        onClick={props.onPrevious}
      >
        P
      </button>
      <button
        class={styles.controlButton}
        title="Play / Pause"
        onClick={props.onTogglePlayPause}
        style={{ width: '100px' }}
      >
        S
      </button>
      <button class={styles.controlButton} title="Next" onClick={props.onNext}>
        N
      </button>
    </div>
  )
}
