import TextStyle from 'shared/textStyles/TextStyle.tsx'
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
          playsinline
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
              class={sprinkles({
                display: 'flexColumn',
                width: 'full',
                height: 'full',
              })}
              style={{
                'font-size': '2.5em',
              }}
            >
              <TextStyle textStyle={textData.textStyle}>
                {textData.content}
              </TextStyle>
            </div>
          )
        })()}
      </Show>
    </div>
  )
}
