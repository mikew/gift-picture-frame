import Box from 'shared/Box.jsx'
import Button from 'shared/Button.jsx'
import { clsx } from 'shared/clsx.ts'
import Icon from 'shared/Icon.jsx'
import IconButton from 'shared/IconButton.tsx'
import ContentPaste from 'shared/svgs/content_paste.svg?component-solid'
import RemoveCircle from 'shared/svgs/remove_circle.svg?component-solid'
import VideoFile from 'shared/svgs/video_file.svg?component-solid'
import { sprinkles } from 'shared/theme/sprinkles.css.js'
import { onCleanup, type Component } from 'solid-js'
import { createSignal, For, onMount } from 'solid-js'

import * as styles from './FileUploadTab.css.ts'

interface FileUploadTabProps {
  selectedFiles: File[]
  onFilesChange: (files: File[]) => void
  onUpload: () => void
  frame: string | null
  isUploading: boolean
}

const FileUploadTab: Component<FileUploadTabProps> = (props) => {
  const [isDragOver, setIsDragOver] = createSignal(false)
  let fileInputRef: HTMLInputElement | undefined

  const isValidFile = () => true

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer?.files || [])
    addFiles(files)
  }

  const handleFileSelect = (e: Event) => {
    const target = e.target
    if (target instanceof HTMLInputElement) {
      if (target.files) {
        const files = Array.from(target.files)
        addFiles(files)
      }
    }
  }

  const addFiles = (files: File[]) => {
    const validFiles = files.filter(isValidFile)
    props.onFilesChange([...props.selectedFiles, ...validFiles])
  }

  const removeFile = (index: number) => {
    const newFiles = [...props.selectedFiles]
    newFiles.splice(index, 1)
    props.onFilesChange(newFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  const createFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <img src={URL.createObjectURL(file)} alt={file.name} />
    } else {
      return (
        <Icon style={{ 'font-size': '1.5em' }}>
          <VideoFile />
        </Icon>
      )
    }
  }

  onMount(() => {
    async function handlePaste(event: ClipboardEvent) {
      const items = event.clipboardData?.items

      if (!items) {
        return
      }

      const files: File[] = []

      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file && isValidFile()) {
            files.push(file)
          }
        }
      }

      if (files.length > 0) {
        addFiles(files)
      }
    }

    document.addEventListener('paste', handlePaste)

    onCleanup(() => {
      document.removeEventListener('paste', handlePaste)
    })
  })

  return (
    <>
      <div
        class={clsx(styles.container, isDragOver() && 'dragover')}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef?.click()}
      >
        <Box marginBottom="x2">Drop files here or tap to browse</Box>

        <Box color="text.secondary" style={{ 'font-size': '0.825em' }}>
          Images, Videos, GIFs are supported
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          onChange={handleFileSelect}
        />
      </div>

      <Button
        color="secondary"
        sx={{ gap: 'x1' }}
        onClick={(event) => {
          event.preventDefault()

          // I know this is deprecated, but the modern clipboard API isn't
          // working in all browsers yet, meanwhile this works in iOS 26.
          if (!document.execCommand('paste')) {
            console.warn(
              'Paste command failed or is not supported in this browser.',
            )
          }
        }}
      >
        <Icon>
          <ContentPaste />
        </Icon>
        <span>Paste</span>
      </Button>

      <div class={styles.fileListRoot}>
        <For each={props.selectedFiles}>
          {(file, index) => (
            <div class={styles.fileListItemRoot}>
              <div class={styles.filePreview}>{createFilePreview(file)}</div>
              <div class={styles.fileInfo}>
                <div class="file-name">{file.name}</div>
                <div class={sprinkles({ color: 'text.secondary' })}>
                  {formatFileSize(file.size)}
                </div>
              </div>
              <IconButton color="error" onClick={() => removeFile(index())}>
                <RemoveCircle />
              </IconButton>
            </div>
          )}
        </For>
      </div>

      <Button
        disabled={props.selectedFiles.length === 0 || props.isUploading}
        onClick={props.onUpload}
        size="large"
        color="primary"
        sx={{ width: 'full', marginTop: 'x1' }}
      >
        {props.isUploading ? 'Uploading...' : `Send to ${props.frame}`}
      </Button>
    </>
  )
}

export default FileUploadTab
