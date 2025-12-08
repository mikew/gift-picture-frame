import Button from 'shared/Button.jsx'
import Select from 'shared/Select.jsx'
import TextArea from 'shared/TextArea.jsx'
import TextStyle from 'shared/textStyles/TextStyle.tsx'
import { allStyleNames } from 'shared/textStyles/theme.css.ts'
import type { Component } from 'solid-js'
import { createSignal, For } from 'solid-js'

import * as styles from './TextUploadTab.css.ts'

import './TextUploadTab.css'

interface TextUploadTabProps {
  onUpload: (textData: { content: string; textStyle: string }) => void
  frame: string | null
}

const TextUploadTab: Component<TextUploadTabProps> = (props) => {
  const [textContent, setTextContent] = createSignal('')
  const [textStyle, setTextStyle] = createSignal('normal')

  const handleUpload = () => {
    props.onUpload({
      content: textContent(),
      textStyle: textStyle(),
    })
    setTextContent('')
  }

  const previewText = () => textContent() || 'Your message will appear here...'

  return (
    <>
      <TextArea
        placeholder="Enter your message here..."
        rows="6"
        value={textContent()}
        onInput={(e) => setTextContent(e.currentTarget.value)}
        sx={{ width: 'full', marginBottom: 'x1' }}
      />

      <label>
        <div>Text Style</div>

        <Select
          value={textStyle()}
          onChange={(e) => setTextStyle(e.currentTarget.value)}
          sx={{ width: 'full' }}
        >
          <For each={allStyleNames}>
            {(style) => (
              <option value={style}>
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </option>
            )}
          </For>
        </Select>
      </label>

      <div class={styles.textPreview}>
        <TextStyle textStyle={textStyle()}>{previewText()}</TextStyle>
      </div>

      <Button
        size="large"
        color="primary"
        onClick={handleUpload}
        sx={{ width: 'full' }}
      >
        Send to {props.frame}
      </Button>
    </>
  )
}

export default TextUploadTab
