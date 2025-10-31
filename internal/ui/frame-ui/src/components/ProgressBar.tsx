import { createSignal, createEffect, onCleanup } from 'solid-js'
import './ProgressBar.css'

interface ProgressBarProps {
  isPlaying: boolean
  mediaLength: number
  slideDuration: number
}

export default function ProgressBar(props: ProgressBarProps) {
  const [progress, setProgress] = createSignal(0)
  let progressInterval: ReturnType<typeof setInterval> | null = null

  createEffect(() => {
    if (props.isPlaying && props.mediaLength > 1) {
      setProgress(0)
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (props.slideDuration / 100))
          return newProgress >= 100 ? 0 : newProgress
        })
      }, 100)
    } else {
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
      }
      setProgress(0)
    }
  })

  onCleanup(() => {
    if (progressInterval) {
      clearInterval(progressInterval)
    }
  })

  return (
    <div class={`progress-bar ${props.isPlaying && props.mediaLength > 1 ? 'active' : ''}`}>
      <div 
        class="progress-fill" 
        style={{ width: `${progress()}%` }}
      />
    </div>
  )
}