import * as styles from './Controls.css.ts'

interface ControlsProps {
  onPrevious: () => void
  onNext: () => void
  onTogglePlayPause: () => void
  isPlaying: boolean
}

export default function Controls(props: ControlsProps) {
  return (
    <div class={styles.container}>
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
