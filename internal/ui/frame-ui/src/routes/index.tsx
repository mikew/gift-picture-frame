import { createFileRoute } from '@tanstack/solid-router'
import { onMount } from 'solid-js'

import * as styles from '#src/app/App.css.ts'
import ColorTemperatureOverlay from '#src/app/ColorTemperatureOverlay.tsx'
import Controls from '#src/app/Controls.tsx'
import FrameInfo from '#src/app/FrameInfo.tsx'
import InterfaceContainer from '#src/app/InterfaceContainer.tsx'
import KeyboardHandler from '#src/app/KeyboardHandler.tsx'
import MediaDisplay from '#src/app/MediaDisplay.tsx'
import SwipeHandler from '#src/app/SwipeHandler.tsx'
import AppConfig from '#src/appConfig.ts'
import { MediaProvider } from '#src/media/mediaContext.tsx'
import { SettingsProvider } from '#src/settings/settingsContext.tsx'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  onMount(() => {
    fetch(`${AppConfig.apiBase}/api/ready`, { method: 'POST' })
  })

  return (
    <>
      <SettingsProvider>
        <MediaProvider>
          <div class={styles.container}>
            <KeyboardHandler />
            <SwipeHandler />
            <MediaDisplay />

            <InterfaceContainer>
              <FrameInfo />

              <Controls />
            </InterfaceContainer>
            <ColorTemperatureOverlay />
          </div>
        </MediaProvider>
      </SettingsProvider>
    </>
  )
}
