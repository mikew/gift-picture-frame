import './Controls.css'

interface ControlsProps {
  onPrevious: () => void
  onNext: () => void
  onTogglePlayPause: () => void
  isPlaying: boolean
}

export default function Controls(props: ControlsProps) {
  return (
    <div class="controls" id="controls">
      <button 
        class="control-btn" 
        id="prev-btn" 
        title="Previous"
        onClick={props.onPrevious}
      >
        ‹
      </button>
      <button 
        class="control-btn" 
        id="play-pause-btn" 
        title={props.isPlaying ? 'Pause' : 'Play'}
        onClick={props.onTogglePlayPause}
      >
        {props.isPlaying ? '⏸' : '▶'}
      </button>
      <button 
        class="control-btn" 
        id="next-btn" 
        title="Next"
        onClick={props.onNext}
      >
        ›
      </button>
    </div>
  )
}