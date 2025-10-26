import './NoMediaMessage.css'

export default function NoMediaMessage() {
  return (
    <div class="no-media-message">
      <h2>📸 No Photos Yet</h2>
      <p>Your picture frame is ready and waiting for memories!</p>
      <div class="upload-instructions">
        <p>To add photos, videos, or messages:</p>
        <span class="upload-url">
          {frameConfig.serverUrl}/{frameConfig.frameId}
        </span>
      </div>
    </div>
  )
}
