import type { MediaItem } from 'shared/types'

import './FrameInfo.css'

interface FrameInfoProps {
  media: MediaItem[]
  currentIndex: number
}

export default function FrameInfo(props: FrameInfoProps) {
  const getCounterText = () => {
    if (props.media.length === 0) {
      return '0 / 0'
    }
    return `${props.currentIndex + 1} / ${props.media.length}`
  }

  return (
    <div class="frame-info" id="frame-info">
      <div class="frame-id">Frame: {frameConfig.frameId}</div>
      <div class="media-counter" id="media-counter">
        {getCounterText()}
      </div>
      <div class="upload-hint">
        Upload photos at:
        <span class="upload-url">
          {frameConfig.serverUrl}/{frameConfig.frameId}
        </span>
      </div>
    </div>
  )
}
