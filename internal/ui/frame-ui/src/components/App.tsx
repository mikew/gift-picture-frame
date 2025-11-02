import type { MediaItem } from 'shared/types.ts'
import { createSignal, createEffect, onMount, onCleanup } from 'solid-js'

import AppConfig from '#src/appConfig.ts'

import Controls from './Controls.tsx'
import FrameInfo from './FrameInfo.tsx'
import MediaDisplay from './MediaDisplay.tsx'
import ProgressBar from './ProgressBar.tsx'

import './App.css'

export default function App() {
  const [media, setMedia] = createSignal<MediaItem[]>([])
  const [currentIndex, setCurrentIndex] = createSignal(0)
  const [isPlaying, setIsPlaying] = createSignal(true)
  const [slideInterval, setSlideInterval] = createSignal<ReturnType<
    typeof setInterval
  > | null>(null)
  const slideDuration = 30_000

  let cursorTimeout: ReturnType<typeof setTimeout>

  const loadMedia = async () => {
    try {
      const response = await fetch(`${AppConfig.apiBase}/api/media`)
      if (!response.ok) throw new Error('Failed to fetch media')

      const newMedia = await response.json()

      if (JSON.stringify(newMedia) !== JSON.stringify(media())) {
        setMedia(newMedia)
        setCurrentIndex(Math.min(currentIndex(), newMedia.length - 1))
      }
    } catch (error) {
      console.error('Failed to load media:', error)
      setMedia([])
    }
  }

  const nextSlide = () => {
    if (media().length === 0) return

    setCurrentIndex((prev) => (prev + 1) % media().length)

    if (isPlaying()) {
      resetSlideshow()
    }
  }

  const previousSlide = () => {
    if (media().length === 0) return

    setCurrentIndex((prev) => (prev === 0 ? media().length - 1 : prev - 1))

    if (isPlaying()) {
      resetSlideshow()
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying())
  }

  const startSlideshow = () => {
    if (media().length <= 1) return

    setIsPlaying(true)
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media().length)
    }, slideDuration)
    setSlideInterval(interval)
  }

  const pauseSlideshow = () => {
    setIsPlaying(false)
    const interval = slideInterval()
    if (interval) {
      clearInterval(interval)
      setSlideInterval(null)
    }
  }

  const resetSlideshow = () => {
    const interval = slideInterval()
    if (interval) {
      clearInterval(interval)
    }
    startSlideshow()
  }

  const setupCursorHiding = () => {
    const showCursor = () => {
      document.body.style.cursor = 'default'
      clearTimeout(cursorTimeout)
      cursorTimeout = setTimeout(() => {
        document.body.style.cursor = 'none'
      }, 3000)
    }

    document.addEventListener('mousemove', showCursor)
    document.addEventListener('click', showCursor)

    cursorTimeout = setTimeout(() => {
      document.body.style.cursor = 'none'
    }, 3000)

    onCleanup(() => {
      document.removeEventListener('mousemove', showCursor)
      document.removeEventListener('click', showCursor)
      clearTimeout(cursorTimeout)
    })
  }

  const setupKeyboardControls = () => {
    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          previousSlide()
          break
        case 'ArrowRight':
        case ' ':
          nextSlide()
          break
        case 'p':
        case 'P':
          togglePlayPause()
          break
        case 'r':
        case 'R':
          loadMedia()
          break
      }
    }

    document.addEventListener('keydown', handleKeydown)
    onCleanup(() => document.removeEventListener('keydown', handleKeydown))
  }

  const setupTouchControls = () => {
    let startX = 0
    let startY = 0

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0]?.clientX || 0
      startY = e.touches[0]?.clientY || 0
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0]?.clientX || 0
      const endY = e.changedTouches[0]?.clientY || 0
      const diffX = startX - endX
      const diffY = startY - endY

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          nextSlide()
        } else {
          previousSlide()
        }
      }
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)

    onCleanup(() => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    })
  }

  // Effects
  createEffect(() => {
    if (isPlaying()) {
      startSlideshow()
    } else {
      pauseSlideshow()
    }
  })

  onMount(() => {
    loadMedia()
    setupCursorHiding()
    setupKeyboardControls()
    setupTouchControls()

    // Refresh media every 30 seconds
    const refreshInterval = setInterval(loadMedia, 30000)

    onCleanup(() => {
      clearInterval(refreshInterval)
      const interval = slideInterval()
      if (interval) clearInterval(interval)
    })
  })

  return (
    <div class="frame-container">
      <MediaDisplay media={media()} currentIndex={currentIndex()} />

      <FrameInfo media={media()} currentIndex={currentIndex()} />

      <Controls
        onPrevious={previousSlide}
        onNext={nextSlide}
        onTogglePlayPause={togglePlayPause}
        isPlaying={isPlaying()}
      />

      <ProgressBar
        isPlaying={isPlaying()}
        mediaLength={media().length}
        slideDuration={slideDuration}
      />
    </div>
  )
}
