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
      <div class="media-counter" id="media-counter">
        {getCounterText()}
      </div>
    </div>
  )
}
