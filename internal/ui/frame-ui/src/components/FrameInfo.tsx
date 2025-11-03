import type { MediaItem } from 'shared/types.ts'

import * as styles from './FrameInfo.css.ts'

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

  return <div class={styles.container}>{getCounterText()}</div>
}
