import { isomorphicWindow } from 'shared/isomorphicWindow.js'
import type { Component } from 'solid-js'
import { onCleanup, onMount } from 'solid-js'

import { useMediaContext } from '#src/media/mediaContext.tsx'

const SwipeHandler: Component = () => {
  const { goToPrevious, goToNext } = useMediaContext()

  let startX = 0
  let startY = 0

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches[0]) {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (e.changedTouches[0]) {
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      processSwipe(endX, endY)
    }
  }

  const handleMouseDown = (e: MouseEvent) => {
    startX = e.clientX
    startY = e.clientY
  }

  const handleMouseUp = (e: MouseEvent) => {
    processSwipe(e.clientX, e.clientY)
  }

  const processSwipe = (endX: number, endY: number) => {
    const diffX = startX - endX
    const diffY = startY - endY

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToNext()
      } else {
        goToPrevious()
      }
    }
  }

  onMount(() => {
    isomorphicWindow()?.addEventListener('touchstart', handleTouchStart)
    isomorphicWindow()?.addEventListener('touchend', handleTouchEnd)
    isomorphicWindow()?.addEventListener('mousedown', handleMouseDown)
    isomorphicWindow()?.addEventListener('mouseup', handleMouseUp)

    onCleanup(() => {
      isomorphicWindow()?.removeEventListener('touchstart', handleTouchStart)
      isomorphicWindow()?.removeEventListener('touchend', handleTouchEnd)
      isomorphicWindow()?.removeEventListener('mousedown', handleMouseDown)
      isomorphicWindow()?.removeEventListener('mouseup', handleMouseUp)
    })
  })

  return null
}

export default SwipeHandler
