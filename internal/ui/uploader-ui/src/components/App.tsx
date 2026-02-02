import Alert from 'shared/Alert.tsx'
import Box from 'shared/Box.jsx'
import { isomorphicWindow } from 'shared/isomorphicWindow.ts'
import type { Component } from 'solid-js'
import { createEffect, createSignal, onMount, Show } from 'solid-js'

import AppConfig from '#src/appConfig.ts'

import * as styles from './App.css.ts'
import FileUploadTab from './FileUploadTab.tsx'
import type { FrameInfo } from './FrameSelect.tsx'
import FrameSelect from './FrameSelect.tsx'
import TextUploadTab from './TextUploadTab.tsx'
import UploadTabs from './UploadTabs.tsx'

interface AppProps {
  frameId?: string
}

const App: Component<AppProps> = (props) => {
  const [frames, setFrames] = createSignal<FrameInfo[]>([])
  const [currentFrame, setCurrentFrame] = createSignal<
    FrameInfo['name'] | null
  >(props.frameId || null)
  const [activeTab, setActiveTab] = createSignal<'file' | 'text'>('file')

  const [selectedFiles, setSelectedFiles] = createSignal<File[]>([])
  const [isUploading, setIsUploading] = createSignal(false)

  const [statusMessage, setStatusMessage] = createSignal('')
  const [statusType, setStatusType] = createSignal<
    'success' | 'error' | 'info'
  >('info')
  const [showStatus, setShowStatus] = createSignal(false)

  onMount(async () => {
    if (props.frameId) {
      return
    }

    const previousFrame =
      isomorphicWindow()?.localStorage.getItem('lastUsedFrame')

    const frameInfoResponse = await fetch(`${AppConfig.apiBase}/frames`)

    if (frameInfoResponse.ok) {
      const frames: FrameInfo[] = await frameInfoResponse.json()

      setFrames(frames)

      if (frames.length > 0) {
        const foundFrame = frames.find((frame) => frame.name === previousFrame)
        setCurrentFrame(foundFrame ? foundFrame.name : frames[0]?.name || null)
      }
    }
  })

  createEffect(() => {
    const frame = currentFrame()
    if (frame) {
      isomorphicWindow()?.localStorage.setItem('lastUsedFrame', frame)
    }
  })

  const showStatusMessage = (
    message: string,
    type: 'success' | 'error' | 'info',
  ) => {
    setStatusMessage(message)
    setStatusType(type)
    setShowStatus(true)
    setTimeout(() => setShowStatus(false), 5000)
  }

  const uploadFiles = async () => {
    const files = selectedFiles()
    if (files.length === 0 || isUploading()) {
      return
    }

    setIsUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file) continue

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(
          `${AppConfig.apiBase}/${currentFrame()}/upload`,
          {
            method: 'POST',
            body: formData,
          },
        )

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Upload failed')
        }

        showStatusMessage(
          `Uploaded ${i + 1}/${files.length}: ${file.name}`,
          'info',
        )
      }

      showStatusMessage('All files uploaded successfully!', 'success')
      setSelectedFiles([])
    } catch (error) {
      if (error instanceof Error) {
        showStatusMessage(`Upload failed: ${error.message}`, 'error')
      }
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const uploadText = async (textData: {
    content: string
    textStyle: string
  }) => {
    if (!textData.content.trim()) {
      showStatusMessage('Please enter some text', 'error')
      return
    }

    try {
      const formData = new FormData()
      formData.append('text', JSON.stringify(textData))

      const response = await fetch(
        `${AppConfig.apiBase}/${currentFrame()}/upload`,
        {
          method: 'POST',
          body: formData,
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      showStatusMessage('Text message uploaded successfully!', 'success')
    } catch (error) {
      if (error instanceof Error) {
        showStatusMessage(`Upload failed: ${error.message}`, 'error')
      }
      console.error(error)
    }
  }

  return (
    <div class={styles.container}>
      <Box display="flexColumn" gap="x1">
        <Show when={!props.frameId}>
          <label>
            <div>Share to ...</div>

            <FrameSelect
              frames={frames()}
              value={currentFrame()}
              onChange={(value) => {
                setCurrentFrame(value.name)
              }}
            />
          </label>
        </Show>

        <UploadTabs activeTab={activeTab()} onTabChange={setActiveTab} />

        {activeTab() === 'file' && (
          <FileUploadTab
            selectedFiles={selectedFiles()}
            onFilesChange={setSelectedFiles}
            onUpload={uploadFiles}
            frame={currentFrame()}
            isUploading={isUploading()}
          />
        )}

        {activeTab() === 'text' && (
          <TextUploadTab onUpload={uploadText} frame={currentFrame()} />
        )}

        <Show when={showStatus()}>
          <Alert severity={statusType()}>{statusMessage()}</Alert>
        </Show>
      </Box>
    </div>
  )
}

export default App
