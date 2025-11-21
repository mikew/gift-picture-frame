import type { MediaItem } from 'shared/types.ts'
import { createSignal, createEffect, onMount, onCleanup } from 'solid-js'

import AppConfig from '#src/appConfig.ts'

import * as styles from './App.css.ts'
import { ColorTemperatureProvider } from './colorTemperatureContext.tsx'
import ColorTemperatureOverlay from './ColorTemperatureOverlay.tsx'
import Controls from './Controls.tsx'
import FrameInfo from './FrameInfo.tsx'
import InterfaceCntainer from './InterfaceContainer.tsx'
import MediaDisplay from './MediaDisplay.tsx'

export default function App() {
  const [media, setMedia] = createSignal<MediaItem[]>([])
  const [currentIndex, setCurrentIndex] = createSignal(0)
  const [isPlaying, setIsPlaying] = createSignal(true)
  const slideDuration = 60_000
  let slideTimeout: ReturnType<typeof setTimeout> | undefined

  const loadMedia = async () => {
    try {
      const response = await fetch(`${AppConfig.apiBase}/api/media`)
      if (!response.ok) throw new Error('Failed to fetch media')

      const newMedia = await response.json()

      if (JSON.stringify(newMedia) !== JSON.stringify(media())) {
        setMedia(newMedia)

        if (media().length > 0 && currentIndex() >= media().length) {
          setCurrentIndex(Math.max(0, media().length - 1))
        }
      }
    } catch (error) {
      console.error('Failed to load media:', error)
    }
  }

  const nextSlide = () => {
    if (media().length === 0) return
    setCurrentIndex((prev) => (prev + 1) % media().length)
  }

  const previousSlide = () => {
    if (media().length === 0) return
    setCurrentIndex((prev) => (prev === 0 ? media().length - 1 : prev - 1))
  }

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev)
  }

  createEffect(() => {
    // HACK need to run this effect when either isPlaying or currentIndex
    // changes, but nothing actually uses currentIndex in the effect.
    currentIndex()

    if (slideTimeout) {
      clearTimeout(slideTimeout)
    }

    if (isPlaying()) {
      slideTimeout = setTimeout(() => {
        nextSlide()
      }, slideDuration)
    }

    onCleanup(() => {
      if (slideTimeout) {
        clearTimeout(slideTimeout)
      }
    })
  })

  onMount(() => {
    loadMedia()
  })

  onMount(() => {
    const refreshInterval = setInterval(loadMedia, 5_000)

    onCleanup(() => {
      clearInterval(refreshInterval)
    })
  })

  return (
    <ColorTemperatureProvider>
      <div class={styles.container}>
        <KeyboardHandler
          onNext={nextSlide}
          onPrevious={previousSlide}
          onTogglePlayPause={togglePlayPause}
          onReload={loadMedia}
        />
        <SwipeHandler onNext={nextSlide} onPrevious={previousSlide} />
        <MediaDisplay media={media()} currentIndex={currentIndex()} />

        <InterfaceCntainer>
          <FrameInfo media={media()} currentIndex={currentIndex()} />

          <Controls
            onPrevious={previousSlide}
            onNext={nextSlide}
            onTogglePlayPause={togglePlayPause}
            isPlaying={isPlaying()}
          />
        </InterfaceCntainer>

        <ColorTemperatureOverlay />
      </div>
    </ColorTemperatureProvider>
  )
}

interface KeyboardHandlerProps {
  onNext: () => void
  onPrevious: () => void
  onTogglePlayPause: () => void
  onReload: () => void
}

function KeyboardHandler(props: KeyboardHandlerProps) {
  onMount(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          props.onPrevious()
          break
        case 'ArrowRight':
        case ' ':
          props.onNext()
          break
        case 'p':
        case 'P':
          props.onTogglePlayPause()
          break
        case 'r':
        case 'R':
          props.onReload()
          break
      }
    }

    document.addEventListener('keydown', handleKeydown)
    onCleanup(() => document.removeEventListener('keydown', handleKeydown))
  })

  return null
}

interface SwipeHandlerProps {
  onNext: () => void
  onPrevious: () => void
}

function SwipeHandler(props: SwipeHandlerProps) {
  onMount(() => {
    let startX = 0
    let startY = 0

    const handleTouchStart = (e: PointerEvent) => {
      startX = e.clientX
      startY = e.clientY
    }

    const handleTouchEnd = (e: PointerEvent) => {
      const endX = e.clientX
      const endY = e.clientY
      const diffX = startX - endX
      const diffY = startY - endY

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          props.onNext()
        } else {
          props.onPrevious()
        }
      }
    }

    document.addEventListener('pointerdown', handleTouchStart)
    document.addEventListener('pointerup', handleTouchEnd)

    onCleanup(() => {
      document.removeEventListener('pointerdown', handleTouchStart)
      document.removeEventListener('pointerup', handleTouchEnd)
    })
  })

  return null
}
