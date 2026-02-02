import Icon from 'shared/Icon.jsx'
import VideoFile from 'shared/svgs/video_file.svg?component-solid'
import type { Component } from 'solid-js'
import { createSignal, onMount, Show } from 'solid-js'

interface FilePreviewProps {
  file: File
}

const FilePreview: Component<FilePreviewProps> = (props) => {
  const [previewUrl, setPreviewUrl] = createSignal<string | null>(null)
  const [error, setError] = createSignal<string | null>(null)
  const [isLoading, setIsLoading] = createSignal(true)

  onMount(() => {
    const readFileAsDataURL = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result

          if (result == null) {
            reject(new Error('FileReader result is null'))
          } else if (typeof result === 'string') {
            resolve(result)
          } else {
            reject(new Error('Unexpected FileReader result type'))
          }
        }

        reader.onerror = () => {
          reject(reader.error)
        }

        reader.readAsDataURL(file)
      })
    }

    if (props.file.type.startsWith('image/')) {
      readFileAsDataURL(props.file)
        .then((dataUrl) => {
          setPreviewUrl(dataUrl)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error(`Failed to read file ${props.file.name}:`, err)
          setError('Failed to load preview')
          setIsLoading(false)
        })
    } else {
      // For videos, we don't need to read the file
      setIsLoading(false)
    }
  })

  return (
    <Show
      when={!isLoading()}
      fallback={<div style={{ opacity: 0.5 }}>Loading...</div>}
    >
      <Show
        when={!error()}
        fallback={<div style={{ opacity: 0.5 }}>Error</div>}
      >
        <Show
          when={props.file.type.startsWith('image/') && previewUrl()}
          fallback={
            <Icon style={{ 'font-size': '1.5em' }}>
              <VideoFile />
            </Icon>
          }
        >
          {(url) => {
            return <img src={url()} alt={props.file.name} />
          }}
        </Show>
      </Show>
    </Show>
  )
}

export default FilePreview
