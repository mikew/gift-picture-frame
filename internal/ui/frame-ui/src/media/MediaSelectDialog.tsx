import Box from 'shared/Box.jsx'
import Button from 'shared/Button.jsx'
import { themeContract } from 'shared/theme/contract.css.js'
import type { MediaItem } from 'shared/types.js'
import type { Component } from 'solid-js'
import { createEffect, createSignal, For, Show } from 'solid-js'

import AppConfig from '#src/appConfig.ts'
import {
  IntersectionObserverContainer,
  IntersectionObserverItem,
} from '#src/lib/IntersectionObserver.tsx'

import { useMediaContext } from './mediaContext'

const MediaSelectDialog: Component<{
  open: boolean
  onClose: () => void
}> = (props) => {
  let dialogRef: HTMLDialogElement | undefined = undefined
  const { getMedia, bulkDelete, bulkRestore, loadMedia, state } =
    useMediaContext()

  async function refetch() {
    const media = await getMedia(true)
    const selectedIds = media.filter((x) => !x.deleted).map((x) => x.id)

    setMedia(media)
    setSelected(selectedIds)
  }

  const [selected, setSelected] = createSignal<string[]>([])
  const [media, setMedia] = createSignal<MediaItem[]>([])

  createEffect(() => {
    if (props.open) {
      refetch()
    }
  })

  createEffect(() => {
    if (dialogRef) {
      if (props.open) {
        try {
          dialogRef.showModal()
        } catch (e) {
          console.error('Failed to open dialog:', e)
        }
      } else {
        dialogRef.close()
      }
    }
  })

  async function handleOkClick() {
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

    props.onClose()
  }

  return (
    <>
      <dialog
        ref={(el) => {
          dialogRef = el
        }}
        style={{
          'z-index': 1,
          'width': '100%',
          'height': '100%',
          'margin': 0,
          'max-width': 'none',
          'max-height': 'none',
        }}
        onclose={() => {
          props.onClose()
        }}
      >
        <Show when={props.open}>
          <Box
            cursor="initial"
            backgroundColor="background"
            display="flexColumn"
            height="full"
          >
            <Box display="flexRow" flexWrap="wrap" overflow="auto">
              <IntersectionObserverContainer>
                <For each={media()}>
                  {(item, index) => {
                    const url = `${AppConfig.apiBase}/files/${item.filename}`

                    return (
                      <Box
                        margin="x1"
                        padding="x1"
                        borderRadius="default"
                        aspectRatio="r16by9"
                        backgroundColor={
                          !selected().includes(item.id)
                            ? undefined
                            : 'primary.main'
                        }
                        cursor="pointer"
                        style={{
                          width: `calc(25% - calc(${themeContract.spacing.x1} * 2))`,
                          outline:
                            state.media[state.currentIndex]?.id === item.id
                              ? `2px solid ${themeContract.color.white}`
                              : undefined,
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
            </Box>

            <Box
              display="flexRow"
              flexAlign="centerAll"
              backgroundColor="surface"
              padding="x2"
              gap="x2"
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

              <Button
                color="secondary"
                sx={{
                  width: 'full',
                }}
                onClick={() => {
                  props.onClose()
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Show>
      </dialog>
    </>
  )
}

export default MediaSelectDialog
