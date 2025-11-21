import { isomorphicWindow } from 'shared/isomorphicWindow.js'
import type { Accessor, ParentComponent } from 'solid-js'
import { createContext, createSignal, useContext } from 'solid-js'

type ColorTemperatureContextValue = [
  Accessor<number>,
  { setTemperature: (temperature: number) => void },
]

const ColorTemperatureContext = createContext<ColorTemperatureContextValue>()

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export const ColorTemperatureProvider: ParentComponent = (props) => {
  const [temperature, setTemperature] = createSignal(
    clampValue(
      Number(isomorphicWindow()?.localStorage.getItem('colorTemperature') || 0),
      0,
      100,
    ),
  )

  const contextValue: ColorTemperatureContextValue = [
    temperature,
    {
      setTemperature(temperature) {
        temperature = clampValue(temperature, 0, 100)

        isomorphicWindow()?.localStorage.setItem(
          'colorTemperature',
          temperature.toString(),
        )

        setTemperature(temperature)
      },
    },
  ]

  return (
    <ColorTemperatureContext.Provider value={contextValue}>
      {props.children}
    </ColorTemperatureContext.Provider>
  )
}

export const useColorTemperatureContext = () => {
  const context = useContext(ColorTemperatureContext)

  if (!context) {
    throw new Error(
      'useColorTemperatureContext must be used within a ColorTemperatureProvider',
    )
  }

  return context
}
