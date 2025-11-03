import { createSignal, For } from 'solid-js'
import './FileUploadTab.css'

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
      return <div class="video-icon">🎬</div>
    }
  }

  return (
    <div class="tab-content active">
      <div
        class={`upload-area ${isDragOver() ? 'dragover' : ''}`}
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

      <div class="file-list">
        <For each={props.selectedFiles}>
          {(file, index) => (
            <div class="file-item">
              <div class="file-preview">{createFilePreview(file)}</div>
              <div class="file-info">
                <div class="file-name">{file.name}</div>
                <div class="file-size">{formatFileSize(file.size)}</div>
              </div>
              <button class="remove-file" onClick={() => removeFile(index())}>
                Remove
              </button>
            </div>
          )}
        </For>
      </div>

      <button
        class="upload-btn"
        disabled={props.selectedFiles.length === 0}
        onClick={props.onUpload}
      >
        Upload Files
      </button>
    </div>
  )
}
