import Box from 'shared/Box.tsx'
import Button from 'shared/Button.tsx'

interface UploadTabsProps {
  activeTab: 'file' | 'text'
  onTabChange: (tab: 'file' | 'text') => void
}

export default function UploadTabs(props: UploadTabsProps) {
  return (
    <Box display="flexRow" gap="x1" marginBottom="x2">
      <Button
        size="medium"
        color={props.activeTab === 'file' ? 'primary' : 'secondary'}
        onClick={() => props.onTabChange('file')}
      >
        Files
      </Button>

      <Button
        size="medium"
        color={props.activeTab === 'text' ? 'primary' : 'secondary'}
        onClick={() => props.onTabChange('text')}
      >
        Text
      </Button>
    </Box>
  )
}
