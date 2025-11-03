import type { MediaItem } from 'shared/types.ts'
import { For, Show } from 'solid-js'

import MediaItemComponent from './MediaItem.tsx'

interface MediaDisplayProps {
  media: MediaItem[]
  currentIndex: number
}

export default function MediaDisplay(props: MediaDisplayProps) {
  return (
    <For each={props.media}>
      {(item, index) => (
        <Show when={index() === props.currentIndex}>
          <MediaItemComponent item={item} />
        </Show>
      )}
    </For>
  )
}
