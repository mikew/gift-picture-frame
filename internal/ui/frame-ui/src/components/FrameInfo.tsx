import IconButton from 'shared/IconButton.tsx'
import { isomorphicWindow } from 'shared/isomorphicWindow.ts'
import BrightnessHigh from 'shared/svgs/brightness_high.svg?component-solid'
import Menu from 'shared/svgs/menu.svg?component-solid'
import RotateLeft from 'shared/svgs/rotate_left.svg?component-solid'
import RotateRight from 'shared/svgs/rotate_right.svg?component-solid'
import { sprinkles } from 'shared/theme/sprinkles.css.js'
import type { MediaItem } from 'shared/types.ts'
import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'

import AppConfig from '#src/appConfig.ts'

import { useColorTemperatureContext } from './colorTemperatureContext.tsx'
import * as styles from './FrameInfo.css.ts'
import NetworkDialog from './NetworkDialog.tsx'

interface FrameInfoProps {
  media: MediaItem[]
  currentIndex: number
}

const OnlineStatusIndicator: Component<{ size: string }> = (props) => {
  const [isOnline, setIsOnline] = createSignal(
    // Simply using `navigator.onLine` seems to only work a bit of the time,
    // maybe an SSR quirk?
    typeof window === 'undefined' ? true : navigator.onLine,
  )

  isomorphicWindow()?.addEventListener('online', () => setIsOnline(true))
  isomorphicWindow()?.addEventListener('offline', () => setIsOnline(false))

  // const intervalId = setInterval(() => {
  //   console.log(navigator.onLine)
  // }, 1_000)

  // onCleanup(() => {
  //   clearInterval(intervalId)
  // })

  return (
    <div
      class={sprinkles({
        borderRadius: 'circle',
        aspectRatio: 'square',
        backgroundColor: isOnline() ? 'success' : 'error',
      })}
      style={{
        width: props.size,
      }}
    />
  )
}

export default function FrameInfo(props: FrameInfoProps) {
  const getCounterText = () => {
    if (props.media.length === 0) {
      return '0 / 0'
    }
    return `${props.currentIndex + 1} / ${props.media.length}`
  }

  const [isNetworkDialogOpen, setIsNetworkDialogOpen] = createSignal(false)
  const [temperature, { setTemperature }] = useColorTemperatureContext()

  return (
    <>
      <NetworkDialog
        open={isNetworkDialogOpen()}
        onClose={() => {
          setIsNetworkDialogOpen(false)
        }}
      />

      <div class={styles.container}>
        <IconButton
          popovertarget="menu"
          style={{
            // @ts-expect-error TODO switching to a comoponent that lives in
            // shared/ broke the augmentations done in our .d.ts files.
            'anchor-name': '--menu-anchor',
          }}
        >
          <Menu />
        </IconButton>

        <div
          id="menu"
          popover
          style={{
            'position': 'absolute',
            'position-anchor': '--menu-anchor',
            'inset-block-start': 'anchor(--menu-anchor bottom)',
            'inset-inline-start': 'anchor(--menu-anchor left)',
          }}
        >
          <div class={styles.menu}>
            <div onclick={() => setIsNetworkDialogOpen(true)}>
              <OnlineStatusIndicator size="1em" />
            </div>

            <div>Rotate Display</div>
            <IconButton
              onclick={async () => {
                await fetch(`${AppConfig.apiBase}/api/rotate`, {
                  method: 'POST',
                  body: JSON.stringify({ direction: 'counterclockwise' }),
                })
              }}
            >
              <RotateLeft />
            </IconButton>

            <IconButton
              onclick={async () => {
                await fetch(`${AppConfig.apiBase}/api/rotate`, {
                  method: 'POST',
                  body: JSON.stringify({ direction: 'clockwise' }),
                })
              }}
            >
              <RotateRight />
            </IconButton>

            <div>Brightness</div>
            <IconButton
              onclick={async () => {
                await fetch(`${AppConfig.apiBase}/api/brightness/decrease`, {
                  method: 'POST',
                })
              }}
            >
              <BrightnessHigh style={{ 'font-size': '1em' }} />
            </IconButton>

            <IconButton
              onclick={async () => {
                await fetch(`${AppConfig.apiBase}/api/brightness/increase`, {
                  method: 'POST',
                })
              }}
            >
              <BrightnessHigh />
            </IconButton>

            <div>Color Temperature</div>
            <IconButton
              onclick={() => {
                setTemperature(temperature() - 20)
              }}
            >
              -
            </IconButton>

            <IconButton
              onclick={() => {
                setTemperature(temperature() + 20)
              }}
            >
              +
            </IconButton>
          </div>
        </div>

        {getCounterText()}
      </div>
    </>
  )
}
