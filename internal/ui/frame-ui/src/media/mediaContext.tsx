import type { MediaItem } from 'shared/types.js'
import type { ParentComponent } from 'solid-js'
import {
  createContext,
  createEffect,
  onCleanup,
  onMount,
  useContext,
} from 'solid-js'
import { createStore } from 'solid-js/store'

import AppConfig from '#src/appConfig.ts'
import { useSettingsContext } from '#src/settings/settingsContext.tsx'

export interface MediaState {
  media: MediaItem[]
  currentIndex: number
  isPlaying: boolean
}

export interface MediaContext {
  state: MediaState

  goToNext: () => void
  goToPrevious: () => void

  togglePlayPause: () => void
}

const mediaContext = createContext<MediaContext>()

export const MediaProvider: ParentComponent = (props) => {
  const { settings } = useSettingsContext()

  const [state, setState] = createStore<MediaState>({
    media: [],
    currentIndex: 0,
    isPlaying: false,
  })

  const contextValue: MediaContext = {
    state,

    goToNext: () => {
      setState((prev) => {
        if (state.media.length === 0) {
          return prev
        }

        return {
          currentIndex: (prev.currentIndex + 1) % state.media.length,
        }
      })
    },
    goToPrevious: () => {
      setState((prev) => {
        if (state.media.length === 0) {
          return prev
        }

        return {
          currentIndex:
            prev.currentIndex === 0
              ? state.media.length - 1
              : prev.currentIndex - 1,
        }
      })
    },

    togglePlayPause: () => {
      setState('isPlaying', (playing) => !playing)
    },
  }

  const loadMedia = async () => {
    try {
      const response = await fetch(`${AppConfig.apiBase}/api/media`)
      if (!response.ok) {
        throw new Error('Failed to fetch media')
      }

      const newMedia = await response.json()

      if (JSON.stringify(newMedia) !== JSON.stringify(state.media)) {
        setState('media', newMedia)

        if (
          state.media.length > 0
          && state.currentIndex >= state.media.length
        ) {
          setState('currentIndex', Math.max(0, state.media.length - 1))
        }
      }
    } catch (error) {
      console.error('Failed to load media:', error)
    }
  }

  let slideTimeout: ReturnType<typeof setTimeout> | undefined
  createEffect(() => {
    // HACK need to run this effect when either isPlaying or currentIndex
    // changes, but nothing actually uses currentIndex in the effect.
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- see above
    state.currentIndex

    if (slideTimeout) {
      clearTimeout(slideTimeout)
    }

    if (state.isPlaying) {
      slideTimeout = setTimeout(() => {
        contextValue.goToNext()
      }, settings.slideDuration)
    }

    onCleanup(() => {
      if (slideTimeout) {
        clearTimeout(slideTimeout)
      }
    })
  })

  onMount(() => {
    loadMedia()

    const storedValue = localStorage.getItem('media')
    if (storedValue) {
      try {
        const parsedSettings = JSON.parse(storedValue)
        setState((prev) => ({
          ...prev,
          ...parsedSettings,
        }))
      } catch {
        // Ignore parsing errors and use default settings
      }
    } else {
      setState('isPlaying', true)
    }

    const refreshInterval = setInterval(loadMedia, 5_000)

    onCleanup(() => {
      clearInterval(refreshInterval)
    })
  })

  createEffect(() => {
    localStorage.setItem(
      'media',
      JSON.stringify({
        isPlaying: state.isPlaying,
        currentIndex: state.currentIndex,
      }),
    )
  })

  return (
    <mediaContext.Provider value={contextValue}>
      {props.children}
    </mediaContext.Provider>
  )
}

export const useMediaContext = () => {
  const context = useContext(mediaContext)

  if (!context) {
    throw new Error('useMediaContext must be used within a MediaProvider')
  }

  return context
}
