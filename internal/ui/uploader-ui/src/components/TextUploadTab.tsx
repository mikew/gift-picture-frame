import { clsx } from 'shared/clsx.ts'
import { normalizeStyleName } from 'shared/textStyles/normalizeStyleName.ts'
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
    <div class="tab-content">
      <div class="text-input-area">
        <textarea
          placeholder="Enter your message here..."
          class={styles.textarea}
          rows="6"
          value={textContent()}
          onInput={(e) => setTextContent(e.currentTarget.value)}
        />

        <div class="text-options">
          <label>
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
            Text Style
          </label>
        </div>

        <div class={clsx(styles.textPreview, themeClass)}>
          <div class={messageStyles[normalizeStyleName(textStyle())]}>
            {previewText()}
          </div>
        </div>
      </div>

      <button class="upload-btn" onClick={handleUpload}>
        Upload Text
      </button>
    </div>
  )
}
