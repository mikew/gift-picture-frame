import { clsx } from 'shared/clsx.ts'
import { normalizeStyleName } from 'shared/textStyles/normalizeStyleName.ts'
import { themeClass, messageStyles } from 'shared/textStyles/theme.css.ts'
import { sprinkles } from 'shared/theme/sprinkles.css.js'
import type { MediaItem, TextData } from 'shared/types.ts'
import { Show } from 'solid-js'

import AppConfig from '#src/appConfig.ts'

import * as styles from './MediaItem.css.ts'

interface MediaItemProps {
  item: MediaItem
}

export default function MediaItemComponent(props: MediaItemProps) {
  const getMediaUrl = () => {
    // Frame backend handles frame_id internally, UI just requests by filename
    const base = AppConfig.apiBase

    return `${base}/files/${props.item.filename}`
  }

  const parseTextData = (): TextData => {
    try {
      return JSON.parse(props.item.content)
    } catch {
      return {
        content: props.item.content,
        textStyle: 'normal',
      }
    }
  }

  return (
    <div class={styles.container}>
      <Show when={props.item.type === 'image'}>
        <img
          src={getMediaUrl()}
          alt={props.item.filename}
          onError={(e) => {
            console.error('Failed to load image:', props.item.filename)
            e.currentTarget.style.display = 'none'
          }}
        />
      </Show>

      <Show when={props.item.type === 'video'}>
        <video
          src={getMediaUrl()}
          muted
          loop
          autoplay
          controls={false}
          onloadedmetadata={(event) => {
            event.currentTarget.play()
          }}
          onerror={(e) => {
            console.error('Failed to load video:', props.item.filename)
            e.currentTarget.style.display = 'none'
          }}
        />
      </Show>

      <Show when={props.item.type === 'text'}>
        {(() => {
          const textData = parseTextData()
          return (
            <div
              class={clsx(themeClass, sprinkles({ display: 'flexColumn' }))}
              style={{ width: '100%', height: '100%' }}
            >
              <div
                class={messageStyles[normalizeStyleName(textData.textStyle)]}
              >
                {textData.content}
              </div>
            </div>
          )
        })()}
      </Show>
    </div>
  )
}
