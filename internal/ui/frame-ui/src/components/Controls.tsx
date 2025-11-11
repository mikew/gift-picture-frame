import Pause from 'shared/svgs/pause.svg?component-solid'
import Play from 'shared/svgs/play.svg?component-solid'
import SkipNext from 'shared/svgs/skip_next.svg?component-solid'
import SkipPrevious from 'shared/svgs/skip_previous.svg?component-solid'

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
        <SkipPrevious />
      </button>
      <button
        class={styles.controlButtonLarge}
        title="Play / Pause"
        onClick={props.onTogglePlayPause}
      >
        {props.isPlaying ? <Pause /> : <Play />}
      </button>
      <button class={styles.controlButton} title="Next" onClick={props.onNext}>
        <SkipNext />
      </button>
    </div>
  )
}
