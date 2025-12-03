import type { ParentComponent } from 'solid-js'
import { createContext, createEffect, onMount, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

import AppConfig from '#src/appConfig.ts'

export interface Settings {
  colorTemperature: number
  slideDuration: number
}

export interface SettingsContext {
  settings: Settings

  increaseColorTemperature: () => void
  decreaseColorTemperature: () => void

  setSlideDuration: (duration: number) => void

  increaseBrightness: () => void
  decreaseBrightness: () => void

  rotateClockwise: () => void
  rotateCounterClockwise: () => void
}

const settingsContext = createContext<SettingsContext>()

const DEFAULT_SETTINGS: Settings = {
  colorTemperature: 40,
  slideDuration: 60_000,
}

export const SettingsProvider: ParentComponent = (props) => {
  const [settings, setSettings] = createStore<Settings>(DEFAULT_SETTINGS)

  const contextValue: SettingsContext = {
    settings,

    increaseColorTemperature: () => {
      setSettings('colorTemperature', (temp) => Math.min(temp + 20, 100))
    },
    decreaseColorTemperature: () => {
      setSettings('colorTemperature', (temp) => Math.max(temp - 20, 0))
    },

    setSlideDuration: (duration: number) => {
      setSettings('slideDuration', duration)
    },

    increaseBrightness: () => {
      fetch(`${AppConfig.apiBase}/api/brightness/increase`, {
        method: 'POST',
      })
    },
    decreaseBrightness: () => {
      fetch(`${AppConfig.apiBase}/api/brightness/decrease`, {
        method: 'POST',
      })
    },

    rotateClockwise: () => {
      fetch(`${AppConfig.apiBase}/api/rotate`, {
        method: 'POST',
        body: JSON.stringify({ direction: 'clockwise' }),
      })
    },
    rotateCounterClockwise: () => {
      fetch(`${AppConfig.apiBase}/api/rotate`, {
        method: 'POST',
        body: JSON.stringify({ direction: 'counterclockwise' }),
      })
    },
  }

  onMount(() => {
    const storedValue = localStorage.getItem('settings')
    if (storedValue) {
      try {
        const parsedSettings = JSON.parse(storedValue)
        setSettings((prev) => ({ ...prev, ...parsedSettings }))
      } catch {
        // Ignore parsing errors and use default settings
      }
    }
  })

  createEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings))
  })

  return (
    <>
      <settingsContext.Provider value={contextValue}>
        {props.children}
      </settingsContext.Provider>
    </>
  )
}

export const useSettingsContext = () => {
  const context = useContext(settingsContext)

  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider')
  }

  return context
}
