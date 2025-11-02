import { createSignal, onCleanup } from 'solid-js'
// import './Controls.css'

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
      onpointermove={() => {
        bump()
      }}
      ontouchstart={() => {
        bump()
      }}
      onmousedown={() => {
        bump()
      }}
      class={`${styles.container} ${showUi() ? styles.containerVisible : ''}`}
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
      >
        S
      </button>
      <button class={styles.controlButton} title="Next" onClick={props.onNext}>
        N
      </button>
    </div>
  )
}
