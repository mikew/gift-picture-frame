import Box from 'shared/Box.tsx'
import Button from 'shared/Button.tsx'
import type { Component } from 'solid-js'

interface UploadTabsProps {
  activeTab: 'file' | 'text'
  onTabChange: (tab: 'file' | 'text') => void
}

const UploadTabs: Component<UploadTabsProps> = (props) => {
  return (
    <Box display="flexRow" flexAlign="centerAll" gap="x1" marginBottom="x2">
      <Button
        size="medium"
        color={props.activeTab === 'file' ? 'primary' : 'secondary'}
        onClick={() => props.onTabChange('file')}
        style={{ 'flex-basis': '50%' }}
      >
        Pictures ...
      </Button>

      <Button
        size="medium"
        color={props.activeTab === 'text' ? 'primary' : 'secondary'}
        onClick={() => props.onTabChange('text')}
        style={{ 'flex-basis': '50%' }}
      >
        Messages ...
      </Button>
    </Box>
  )
}

export default UploadTabs
