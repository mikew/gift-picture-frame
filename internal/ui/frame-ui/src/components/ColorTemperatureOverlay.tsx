import { useColorTemperatureContext } from './colorTemperatureContext'

const ColorTemperatureOverlay = () => {
  const [wut] = useColorTemperatureContext()

  return (
    <div
      style={{
        'position': 'absolute',
        'inset': '0',
        'pointer-events': 'none',

        'background-color': '#ff8400',
        'opacity': wut() / 100,
        'mix-blend-mode': 'multiply',
      }}
    />
  )
}

export default ColorTemperatureOverlay
