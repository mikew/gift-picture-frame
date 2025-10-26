import type { MediaItem } from 'shared/types'
import { For, Show, createEffect } from 'solid-js'

import MediaItemComponent from './MediaItem.tsx'
import NoMediaMessage from './NoMediaMessage.tsx'

import './MediaDisplay.css'

interface MediaDisplayProps {
  media: MediaItem[]
  currentIndex: number
}

export default function MediaDisplay(props: MediaDisplayProps) {
  createEffect(() => {
    // Pause all videos when switching slides
    const videos = document.querySelectorAll<HTMLVideoElement>('video')
    videos.forEach((video) => video.pause())

    // Play current video if it exists
    const currentVideo = document.querySelector<HTMLVideoElement>(
      `[data-index="${props.currentIndex}"] video`,
    )
    if (currentVideo) {
      currentVideo
        .play()
        .catch((e) => console.error('Failed to play video:', e))
    }
  })

  return (
    <div class="media-display" id="media-display">
      <Show when={props.media.length > 0} fallback={<NoMediaMessage />}>
        <For each={props.media}>
          {(item, index) => (
            <MediaItemComponent
              item={item}
              index={index()}
              isActive={index() === props.currentIndex}
            />
          )}
        </For>
      </Show>
    </div>
  )
}
