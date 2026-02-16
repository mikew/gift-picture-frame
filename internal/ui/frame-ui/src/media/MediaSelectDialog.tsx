import Box from 'shared/Box.jsx'
import Button from 'shared/Button.jsx'
import type { MediaItem } from 'shared/types.js'
import type { Component } from 'solid-js'
import { createSignal, For, onMount, Show } from 'solid-js'

import AppConfig from '#src/appConfig.ts'
import {
  IntersectionObserverContainer,
  IntersectionObserverItem,
} from '#src/lib/IntersectionObserver.tsx'

import { useMediaContext } from './mediaContext'

const MediaSelectDialog: Component<{
  open: boolean
  onClose: () => void
}> = () => {
  const { getMedia, bulkDelete, bulkRestore, loadMedia } = useMediaContext()

  async function refetch() {
    const media = await getMedia(true)
    const selectedIds = media.filter((x) => !x.deleted).map((x) => x.id)

    setMedia(media)
    setSelected(selectedIds)
  }

  // TODO Clear / reset to only deleted media items when opening the dialog
  const [selected, setSelected] = createSignal<string[]>([])
  const [media, setMedia] = createSignal<MediaItem[]>([])
  // TODO should only happen when opening the dialog
  onMount(() => {
    refetch()
  })

  async function handleOkClick() {
    // Delete all media NOT in selected.
    //       const response = await fetch(
    //         `${AppConfig.apiBase}/api/media/${currentItem.id}`,
    //         {
    //           method: 'DELETE',
    //         },
    //       )

    // for (const item of state.media) {
    //   if (!selected().includes(item.id)) {
    //     try {
    //       await fetch(`${AppConfig.apiBase}/api/media/${item.id}`, {
    //         method: 'DELETE',
    //       })
    //     } catch (error) {
    //       console.error(`Failed to delete media item ${item.id}:`, error)
    //     }
    //   }
    // }

    // // TODO Show some success / error message?
    // await loadMedia()

    const toDelete = media()
      .filter((x) => !selected().includes(x.id))
      .map((x) => x.id)
    const toRestore = media()
      .filter((x) => selected().includes(x.id))
      .map((x) => x.id)

    await bulkDelete(toDelete)
    await bulkRestore(toRestore)
    await refetch()
    await loadMedia()
  }

  return (
    <>
      <Box
        position="absolute"
        cursor="initial"
        display="flexRow"
        flexWrap="wrap"
        overflow="auto"
        backgroundColor="background"
        style={{
          // 'position': 'absolute',
          'inset': 0,

          // 'cursor': 'initial',

          // 'display': 'flex',
          // 'flex-direction': 'row',
          // 'flex-wrap': 'wrap',

          // 'overflow-y': 'auto',

          // 'background': 'black',
          'padding-bottom': '60px',

          'z-index': 999,
        }}
      >
        <IntersectionObserverContainer>
          <For each={media()}>
            {(item, index) => {
              const url = `${AppConfig.apiBase}/files/${item.filename}`

              return (
                <Box
                  padding="x2"
                  aspectRatio="r16by9"
                  backgroundColor={
                    !selected().includes(item.id) ? undefined : 'primary.main'
                  }
                  cursor="pointer"
                  style={{
                    // 'padding': '8px',
                    width: '25%',
                    // 'aspect-ratio': '16 / 9',
                    // 'background': item.deleted ? undefined : 'blue',
                    // 'background': !selected().includes(item.id)
                    //   ? undefined
                    //   : 'blue',
                  }}
                  onClick={() => {
                    setSelected((prev) => {
                      if (prev.includes(item.id)) {
                        return prev.filter((id) => id !== item.id)
                      } else {
                        return [...prev, item.id]
                      }
                    })
                  }}
                >
                  <IntersectionObserverItem>
                    <Show when={item.type === 'image'}>
                      <img
                        src={url}
                        alt={item.filename}
                        style={{
                          'width': '100%',
                          'height': '100%',
                          'object-fit': 'contain',
                        }}
                      />
                    </Show>

                    <Show when={item.type === 'video'}>
                      <video
                        src={url}
                        controls
                        style={{
                          'width': '100%',
                          'height': '100%',
                          'object-fit': 'contain',
                        }}
                      />
                    </Show>

                    <Show when={item.type === 'text'}>
                      <Box
                        width="full"
                        height="full"
                        display="flexColumn"
                        flexAlign="centerAll"
                        padding="x2"
                        overflow="hidden"
                        style={{
                          'box-sizing': 'border-box',
                        }}
                      >
                        {item.content}
                      </Box>
                    </Show>
                  </IntersectionObserverItem>
                </Box>
              )
            }}
          </For>
        </IntersectionObserverContainer>

        <Box
          position="fixed"
          display="flexRow"
          flexAlign="centerAll"
          backgroundColor="surface"
          padding="x2"
          style={{
            // 'position': 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            // 'width': '100%',
            // height: '40px',
            // 'display': 'flex',
            // 'align-items': 'center',
            // 'justify-content': 'center',
            // 'background': '#333',
          }}
        >
          <Button
            color="primary"
            sx={{
              width: 'full',
            }}
            onClick={handleOkClick}
          >
            OK
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default MediaSelectDialog
