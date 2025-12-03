import type { Component} from 'solid-js';
import { onCleanup, onMount } from 'solid-js'

import { useMediaContext } from '#src/media/mediaContext.tsx'

const KeyboardHandler: Component = () => {
  const { goToPrevious, goToNext, togglePlayPause } = useMediaContext()

  onMount(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
        case ' ':
          goToNext()
          break
        case 'p':
        case 'P':
          togglePlayPause()
          break
        // case 'r':
        // case 'R':
        //   props.onReload()
        //   break
      }
    }

    document.addEventListener('keydown', handleKeydown)

    onCleanup(() => {
      document.removeEventListener('keydown', handleKeydown)
    })
  })

  return null
}

export default KeyboardHandler
