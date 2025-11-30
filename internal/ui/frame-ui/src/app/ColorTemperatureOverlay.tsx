import { useSettingsContext } from '#src/settings/settingsContext.tsx'

const ColorTemperatureOverlay = () => {
  const { settings } = useSettingsContext()

  return (
    <div
      style={{
        'position': 'absolute',
        'inset': '0',
        'pointer-events': 'none',

        'background-color': '#ff9933',
        'opacity': settings.colorTemperature / 100,
        'mix-blend-mode': 'multiply',
      }}
    />
  )
}

export default ColorTemperatureOverlay
