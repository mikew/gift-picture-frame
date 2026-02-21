import { isomorphicWindow } from 'shared/isomorphicWindow.js'
import type { Component } from 'solid-js'
import { onMount } from 'solid-js'

const AutoRefresh: Component = () => {
  // Reload the page every hour, helps with video.
  onMount(() => {
    isomorphicWindow()?.setTimeout(
      () => {
        window.location.reload()
      },
      60 * 60 * 1000,
    )
  })

  return null
}

export default AutoRefresh
