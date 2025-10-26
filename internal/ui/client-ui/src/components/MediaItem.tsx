import type { MediaItem, TextData } from 'shared/types'
import { Show } from 'solid-js'
import './MediaItem.css'

interface MediaItemProps {
  item: MediaItem
  index: number
  isActive: boolean
}

export default function MediaItemComponent(props: MediaItemProps) {
  const getMediaUrl = () =>
    `${frameConfig.serverUrl}/files/${frameConfig.frameId}/${props.item.filename}`

  const parseTextData = (): TextData => {
    try {
      return JSON.parse(props.item.content)
    } catch {
      return {
        content: props.item.content,
        color: '#ffffff',
        background: '#000000',
        fontSize: 36,
      }
    }
  }

  return (
    <div
      class={`media-item ${props.isActive ? 'active' : ''}`}
      data-index={props.index}
    >
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
          controls={false}
          onError={(e) => {
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
              class="text-message"
              style={{
                'color': textData.color,
                'background': textData.background,
                'font-size': `${textData.fontSize}px`,
              }}
            >
              {textData.content}
            </div>
          )
        })()}
      </Show>
    </div>
  )
}
