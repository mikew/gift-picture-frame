import type { MediaItem } from 'shared/types'
import { createSignal, onMount } from 'solid-js'

import FileUploadTab from './FileUploadTab.tsx'
import Header from './Header.tsx'
import RecentUploads from './RecentUploads.tsx'
import TextUploadTab from './TextUploadTab.tsx'
import UploadStatus from './UploadStatus.tsx'
import UploadTabs from './UploadTabs.tsx'

import './App.css'

declare global {
  interface Window {
    PICTURE_FRAME_CONFIG: {
      mode: 'development' | 'production'
    }
  }
}

const UPLOAD_SERVER_BASE =
  window.PICTURE_FRAME_CONFIG.mode === 'development'
    ? 'http://localhost:8080'
    : ''

export default function App() {
  const [activeTab, setActiveTab] = createSignal<'file' | 'text'>('file')
  const [selectedFiles, setSelectedFiles] = createSignal<File[]>([])
  const [recentUploads, setRecentUploads] = createSignal<MediaItem[]>([])
  const [statusMessage, setStatusMessage] = createSignal('')
  const [statusType, setStatusType] = createSignal<
    'success' | 'error' | 'info'
  >('info')
  const [showStatus, setShowStatus] = createSignal(false)

  const frameId = window.location.pathname.split('/')[1] || ''

  const showStatusMessage = (
    message: string,
    type: 'success' | 'error' | 'info',
  ) => {
    setStatusMessage(message)
    setStatusType(type)
    setShowStatus(true)
    setTimeout(() => setShowStatus(false), 5000)
  }

  const loadRecentUploads = async () => {
    try {
      const response = await fetch(`${UPLOAD_SERVER_BASE}/${frameId}/media`)
      if (!response.ok) throw new Error('Failed to load recent uploads')

      const media = await response.json()
      setRecentUploads(media)
    } catch (error) {
      console.error('Failed to load recent uploads:', error)
      setRecentUploads([])
    }
  }

  const uploadFiles = async () => {
    const files = selectedFiles()
    if (files.length === 0) return

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file) continue

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(
          `${UPLOAD_SERVER_BASE}/${frameId}/upload`,
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
      loadRecentUploads()
    } catch (error) {
      if (error instanceof Error) {
        showStatusMessage(`Upload failed: ${error.message}`, 'error')
      }
      console.error(error)
    }
  }

  const uploadText = async (textData: {
    content: string
    color: string
    background: string
    fontSize: string
  }) => {
    if (!textData.content.trim()) {
      showStatusMessage('Please enter some text', 'error')
      return
    }

    try {
      const formData = new FormData()
      formData.append('text', JSON.stringify(textData))

      const response = await fetch(`${UPLOAD_SERVER_BASE}/${frameId}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      showStatusMessage('Text message uploaded successfully!', 'success')
      loadRecentUploads()
    } catch (error) {
      if (error instanceof Error) {
        showStatusMessage(`Upload failed: ${error.message}`, 'error')
      }
      console.error(error)
    }
  }

  onMount(() => {
    loadRecentUploads()
  })

  return (
    <div class="container">
      <Header frameId={frameId} />

      <div class="upload-section">
        <UploadTabs activeTab={activeTab()} onTabChange={setActiveTab} />

        {activeTab() === 'file' && (
          <FileUploadTab
            selectedFiles={selectedFiles()}
            onFilesChange={setSelectedFiles}
            onUpload={uploadFiles}
          />
        )}

        {activeTab() === 'text' && <TextUploadTab onUpload={uploadText} />}
      </div>

      <UploadStatus
        message={statusMessage()}
        type={statusType()}
        show={showStatus()}
      />

      <RecentUploads uploads={recentUploads()} frameId={frameId} />
    </div>
  )
}
