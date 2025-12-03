import type { Component } from 'solid-js'
import { For, Show } from 'solid-js'

import { useMediaContext } from '#src/media/mediaContext.tsx'

import MediaItemComponent from './MediaItem.tsx'

const MediaDisplay: Component = () => {
  const { state } = useMediaContext()

  return (
    <For each={state.media}>
      {(item, index) => (
        <Show when={index() === state.currentIndex}>
          <MediaItemComponent item={item} />
        </Show>
      )}
    </For>
  )
}

export default MediaDisplay
