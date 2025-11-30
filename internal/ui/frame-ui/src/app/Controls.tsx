import Pause from 'shared/svgs/pause.svg?component-solid'
import Play from 'shared/svgs/play.svg?component-solid'
import SkipNext from 'shared/svgs/skip_next.svg?component-solid'
import SkipPrevious from 'shared/svgs/skip_previous.svg?component-solid'
import type { Component } from 'solid-js'

import { useMediaContext } from '#src/media/mediaContext.tsx'

import * as styles from './Controls.css.ts'

const Controls: Component = () => {
  const { state, goToNext, goToPrevious, togglePlayPause } = useMediaContext()

  return (
    <div class={styles.container}>
      <button
        class={styles.controlButton}
        title="Previous"
        onClick={() => {
          goToPrevious()
        }}
      >
        <SkipPrevious />
      </button>

      <button
        class={styles.controlButtonLarge}
        title="Play / Pause"
        onClick={() => {
          togglePlayPause()
        }}
      >
        {state.isPlaying ? <Pause /> : <Play />}
      </button>

      <button
        class={styles.controlButton}
        title="Next"
        onClick={() => {
          goToNext()
        }}
      >
        <SkipNext />
      </button>
    </div>
  )
}

export default Controls
