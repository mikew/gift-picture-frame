import { clsx } from 'shared/clsx.js'
import { isomorphicWindow } from 'shared/isomorphicWindow.ts'
import BrightnessHigh from 'shared/svgs/brightness_high.svg?component-solid'
import Menu from 'shared/svgs/menu.svg?component-solid'
import RotateLeft from 'shared/svgs/rotate_left.svg?component-solid'
import RotateRight from 'shared/svgs/rotate_right.svg?component-solid'
import { sprinkles } from 'shared/theme/sprinkles.css.js'
import * as util from 'shared/theme/util.css.js'
import type { MediaItem } from 'shared/types.ts'
import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'

import AppConfig from '#src/appConfig.ts'

import * as styles from './FrameInfo.css.ts'

interface FrameInfoProps {
  media: MediaItem[]
  currentIndex: number
}

const OnlineStatusIndicator: Component<{ size: string }> = (props) => {
  const [isOnline, setIsOnline] = createSignal(navigator.onLine)

  isomorphicWindow()?.addEventListener('online', () => setIsOnline(true))
  isomorphicWindow()?.addEventListener('offline', () => setIsOnline(false))

  return (
    <div
      class={clsx(
        sprinkles({
          borderRadius: 'circle',
          aspectRatio: 'square',
          backgroundColor: isOnline() ? 'success' : 'error',
        }),
      )}
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

  return (
    <div class={styles.container}>
      <button
        popovertarget="menu"
        class={clsx(util.iconContainer)}
        style={{ 'anchor-name': '--menu-anchor' }}
      >
        <Menu />
      </button>

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
        <div class={clsx(styles.menu)}>
          <OnlineStatusIndicator size="1em" />

          <div>Rotate Display</div>
          <button
            class={clsx(util.iconContainer)}
            onclick={async () => {
              await fetch(`${AppConfig.apiBase}/api/rotate`, {
                method: 'POST',
                body: JSON.stringify({ direction: 'counterclockwise' }),
              })
            }}
          >
            <RotateLeft />
          </button>

          <button
            class={clsx(util.iconContainer)}
            onclick={async () => {
              await fetch(`${AppConfig.apiBase}/api/rotate`, {
                method: 'POST',
                body: JSON.stringify({ direction: 'clockwise' }),
              })
            }}
          >
            <RotateRight />
          </button>

          <div>Brightness</div>
          <button
            class={clsx(util.iconContainer)}
            onclick={async () => {
              await fetch(`${AppConfig.apiBase}/api/brightness/decrease`, {
                method: 'POST',
              })
            }}
          >
            <BrightnessHigh style={{ 'font-size': '1em' }} />
          </button>

          <button
            class={clsx(util.iconContainer)}
            onclick={async () => {
              await fetch(`${AppConfig.apiBase}/api/brightness/increase`, {
                method: 'POST',
              })
            }}
          >
            <BrightnessHigh />
          </button>
        </div>
      </div>

      {getCounterText()}
    </div>
  )
}
