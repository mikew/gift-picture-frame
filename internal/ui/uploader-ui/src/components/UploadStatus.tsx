import './UploadStatus.css'

interface UploadStatusProps {
  message: string
  type: 'success' | 'error' | 'info'
  show: boolean
}

export default function UploadStatus(props: UploadStatusProps) {
  return (
    <div class={`upload-status ${props.type} ${props.show ? 'show' : ''}`}>
      {props.message}
    </div>
  )
}
