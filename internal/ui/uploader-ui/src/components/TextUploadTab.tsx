import Button from 'shared/Button.jsx'
import { clsx } from 'shared/clsx.ts'
import TextArea from 'shared/TextArea.jsx'
import { normalizeStyleName } from 'shared/textStyles/normalizeStyleName.ts'
import TextStyle from 'shared/textStyles/TextStyle.tsx'
import {
  allStyleNames,
  messageStyles,
  themeClass,
} from 'shared/textStyles/theme.css.ts'
import { createSignal, For } from 'solid-js'

import * as styles from './TextUploadTab.css.ts'

import './TextUploadTab.css'

interface TextUploadTabProps {
  onUpload: (textData: { content: string; textStyle: string }) => void
}

export default function TextUploadTab(props: TextUploadTabProps) {
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
        <span>Text Style</span>

        <select
          value={textStyle()}
          onChange={(e) => setTextStyle(e.currentTarget.value)}
        >
          <For each={allStyleNames}>
            {(style) => (
              <option value={style}>
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </option>
            )}
          </For>
        </select>
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
        Upload Text
      </Button>
    </>
  )
}
