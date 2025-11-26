import Button from 'shared/Button.jsx'
import { clsx } from 'shared/clsx.ts'
import Icon from 'shared/Icon.jsx'
import IconButton from 'shared/IconButton.tsx'
import RemoveCircle from 'shared/svgs/remove_circle.svg?component-solid'
import VideoFile from 'shared/svgs/video_file.svg?component-solid'
import { sprinkles } from 'shared/theme/sprinkles.css.js'
import { createSignal, For } from 'solid-js'

// import './FileUploadTab.css'
import * as styles from './FileUploadTab.css.ts'

interface FileUploadTabProps {
  selectedFiles: File[]
  onFilesChange: (files: File[]) => void
  onUpload: () => void
}

export default function FileUploadTab(props: FileUploadTabProps) {
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

  return (
    <>
      <div
        class={clsx(styles.container, isDragOver() && 'dragover')}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef?.click()}
      >
        <div class="upload-icon">📁</div>
        <p>Drag and drop files here or click to browse</p>
        <p class="file-types">Supported: JPG, PNG, GIF, MP4, AVI, MOV, WEBM</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          onChange={handleFileSelect}
        />
      </div>

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
              <IconButton
                class={sprinkles({
                  color: 'error.main',
                })}
                onClick={() => removeFile(index())}
              >
                <RemoveCircle />
              </IconButton>
            </div>
          )}
        </For>
      </div>

      <Button
        disabled={props.selectedFiles.length === 0}
        onClick={props.onUpload}
        size="large"
        color="primary"
        sx={{ width: 'full', marginTop: 'x1' }}
      >
        Upload Files
      </Button>
    </>
  )
}
