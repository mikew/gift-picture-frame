import './UploadTabs.css'

interface UploadTabsProps {
  activeTab: 'file' | 'text'
  onTabChange: (tab: 'file' | 'text') => void
}

export default function UploadTabs(props: UploadTabsProps) {
  return (
    <div class="upload-tabs">
      <button
        class={`tab-button ${props.activeTab === 'file' ? 'active' : ''}`}
        onClick={() => props.onTabChange('file')}
      >
        Files
      </button>
      <button
        class={`tab-button ${props.activeTab === 'text' ? 'active' : ''}`}
        onClick={() => props.onTabChange('text')}
      >
        Text
      </button>
    </div>
  )
}