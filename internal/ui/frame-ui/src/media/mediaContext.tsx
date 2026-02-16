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

  loadMedia: () => Promise<void>
  getMedia: (includeDeleted?: boolean) => Promise<MediaItem[]>

  goToNext: () => void
  goToPrevious: () => void

  togglePlayPause: () => void
  bulkDelete: (ids: string[]) => Promise<void>
  bulkRestore: (ids: string[]) => Promise<void>
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

    bulkDelete: async (ids) => {
      if (ids.length === 0) {
        return
      }

      try {
        const response = await fetch(`${AppConfig.apiBase}/api/media/delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids }),
        })

        if (!response.ok) {
          throw new Error('Failed to delete media')
        }

        // Reload media to get updated list
        // await contextValue.loadMedia()

        // // Adjust current index if needed
        // if (
        //   state.currentIndex >= state.media.length
        //   && state.media.length > 0
        // ) {
        //   setState('currentIndex', Math.max(0, state.media.length - 1))
        // }
      } catch (error) {
        console.error('Failed to delete multiple media:', error)
      }
    },

    bulkRestore: async (ids) => {
      if (ids.length === 0) {
        return
      }

      try {
        const response = await fetch(`${AppConfig.apiBase}/api/media/restore`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids }),
        })

        if (!response.ok) {
          throw new Error('Failed to restore media')
        }

        // Reload media to get updated list
        // await contextValue.loadMedia()
      } catch (error) {
        console.error('Failed to restore multiple media:', error)
      }
    },

    loadMedia: async () => {
      try {
        const newMedia = await contextValue.getMedia()

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
    },

    getMedia: async (includeDeleted = false) => {
      try {
        const response = await fetch(
          `${AppConfig.apiBase}/api/media?includeDeleted=${includeDeleted}`,
        )
        if (!response.ok) {
          throw new Error('Failed to fetch media')
        }

        const media = await response.json()
        return media
      } catch (error) {
        console.error('Failed to get media:', error)
        return []
      }
    },
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
    contextValue.loadMedia()

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

    const refreshInterval = setInterval(contextValue.loadMedia, 5_000)

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
