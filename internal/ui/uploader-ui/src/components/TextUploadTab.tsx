import { createSignal } from 'solid-js'
import './TextUploadTab.css'

interface TextUploadTabProps {
  onUpload: (textData: {
    content: string
    color: string
    background: string
    fontSize: string
  }) => void
}

export default function TextUploadTab(props: TextUploadTabProps) {
  const [textContent, setTextContent] = createSignal('')
  const [textColor, setTextColor] = createSignal('#ffffff')
  const [backgroundColor, setBackgroundColor] = createSignal('#000000')
  const [fontSize, setFontSize] = createSignal('36')

  const handleUpload = () => {
    props.onUpload({
      content: textContent(),
      color: textColor(),
      background: backgroundColor(),
      fontSize: fontSize(),
    })
    setTextContent('')
  }

  const previewText = () => textContent() || 'Your message will appear here...'

  return (
    <div class="tab-content">
      <div class="text-input-area">
        <textarea
          placeholder="Enter your message here..."
          rows="6"
          value={textContent()}
          onInput={(e) => setTextContent(e.currentTarget.value)}
        />

        <div class="text-options">
          <label>
            <input
              type="color"
              value={textColor()}
              onInput={(e) => setTextColor(e.currentTarget.value)}
            />
            Text Color
          </label>

          <label>
            <input
              type="color"
              value={backgroundColor()}
              onInput={(e) => setBackgroundColor(e.currentTarget.value)}
            />
            Background Color
          </label>

          <label>
            <select
              value={fontSize()}
              onChange={(e) => setFontSize(e.currentTarget.value)}
            >
              <option value="24">Small</option>
              <option value="36">Medium</option>
              <option value="48">Large</option>
              <option value="64">Extra Large</option>
            </select>
            Font Size
          </label>
        </div>

        <div
          class="text-preview"
          style={{
            'background': backgroundColor(),
            'color': textColor(),
            'font-size': `${fontSize()}px`,
          }}
        >
          <div class="preview-text">{previewText()}</div>
        </div>
      </div>

      <button class="upload-btn" onClick={handleUpload}>
        Upload Text
      </button>
    </div>
  )
}
