import Select from 'shared/Select.tsx'
import type { Component } from 'solid-js'

export interface FrameInfo {
  name: string
}

export interface FrameSelectProps {
  frames: FrameInfo[]
  value: string | null | undefined
  onChange: (value: FrameInfo) => void
}

const FrameSelect: Component<FrameSelectProps> = (props) => {
  return (
    <Select
      value={props.value || ''}
      onChange={(event) => {
        const selectedFrame = props.frames.find(
          (frame) => frame.name === event.target.value,
        )

        if (selectedFrame) {
          props.onChange(selectedFrame)
        }
      }}
      sx={{ width: 'full' }}
    >
      <option value="" disabled>
        Select a frame
      </option>

      {props.frames.map((frame) => (
        <option value={frame.name}>{frame.name}</option>
      ))}
    </Select>
  )
}

export default FrameSelect
