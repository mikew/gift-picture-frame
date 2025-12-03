import Box from 'shared/Box.tsx'
import Button from 'shared/Button.jsx'
import IconButton from 'shared/IconButton.tsx'
import { isomorphicWindow } from 'shared/isomorphicWindow.ts'
import BrightnessHigh from 'shared/svgs/brightness_high.svg?component-solid'
import Menu from 'shared/svgs/menu.svg?component-solid'
import RotateLeft from 'shared/svgs/rotate_left.svg?component-solid'
import RotateRight from 'shared/svgs/rotate_right.svg?component-solid'
import { sprinkles } from 'shared/theme/sprinkles.css.js'
import type { Component } from 'solid-js'
import { createSignal, onCleanup, onMount } from 'solid-js'

import { useMediaContext } from '#src/media/mediaContext.tsx'
import NetworkDialog from '#src/settings/NetworkDialog.tsx'
import { useSettingsContext } from '#src/settings/settingsContext.tsx'

import * as styles from './FrameInfo.css.ts'

const OnlineStatusIndicator: Component<{ size: string }> = (props) => {
  const [isOnline, setIsOnline] = createSignal(
    // Simply using `navigator.onLine` seems to only work a bit of the time,
    // maybe an SSR quirk?
    typeof window === 'undefined' ? true : navigator.onLine,
  )

  function handleOnline() {
    setIsOnline(true)
  }

  function handleOffline() {
    setIsOnline(false)
  }

  onMount(() => {
    isomorphicWindow()?.addEventListener('online', handleOnline)
    isomorphicWindow()?.addEventListener('offline', handleOffline)

    onCleanup(() => {
      isomorphicWindow()?.removeEventListener('online', handleOnline)
      isomorphicWindow()?.removeEventListener('offline', handleOffline)
    })
  })

  return (
    <div
      class={sprinkles({
        borderRadius: 'circle',
        aspectRatio: 'square',
        backgroundColor: isOnline() ? 'success.main' : 'error.main',
      })}
      style={{
        width: props.size,
      }}
    />
  )
}

const FrameInfo: Component = () => {
  const {
    increaseBrightness,
    decreaseBrightness,
    rotateClockwise,
    rotateCounterClockwise,
    increaseColorTemperature,
    decreaseColorTemperature,
  } = useSettingsContext()

  const { state } = useMediaContext()

  const getCounterText = () => {
    if (state.media.length === 0) {
      return '0 / 0'
    }
    return `${state.currentIndex + 1} / ${state.media.length}`
  }

  const [isNetworkDialogOpen, setIsNetworkDialogOpen] = createSignal(false)

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
            <Button
              color="secondary"
              size="medium"
              onclick={() => {
                setIsNetworkDialogOpen(true)
              }}
              sx={{
                gap: 'x1',
                width: 'full',
              }}
            >
              <OnlineStatusIndicator size="1em" />
              <span>Network Settings ...</span>
            </Button>

            <div>Rotate Display</div>
            <Box display="flexRow" flexAlign="spaceBetween" marginBottom="x1">
              <IconButton
                onClick={() => {
                  rotateCounterClockwise()
                }}
              >
                <RotateLeft />
              </IconButton>

              <IconButton
                onclick={() => {
                  rotateClockwise()
                }}
              >
                <RotateRight />
              </IconButton>
            </Box>

            <div>Brightness</div>
            <Box display="flexRow" flexAlign="spaceBetween" marginBottom="x1">
              <IconButton
                onclick={() => {
                  decreaseBrightness()
                }}
              >
                <BrightnessHigh style={{ 'font-size': '1em' }} />
              </IconButton>

              <IconButton
                onclick={() => {
                  increaseBrightness()
                }}
              >
                <BrightnessHigh />
              </IconButton>
            </Box>

            <div>Color Temperature</div>
            <Box display="flexRow" flexAlign="spaceBetween">
              <IconButton
                onclick={() => {
                  decreaseColorTemperature()
                }}
              >
                -
              </IconButton>

              <IconButton
                onclick={() => {
                  increaseColorTemperature()
                }}
              >
                +
              </IconButton>
            </Box>
          </div>
        </div>

        {getCounterText()}
      </div>
    </>
  )
}

export default FrameInfo
