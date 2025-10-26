export interface MediaItem {
  type: 'image' | 'video' | 'text'
  filename: string
  content: string
}

export interface FrameConfig {
  frameId: string
  serverUrl: string
}

export interface PictureFrameConfig {
  mode: 'development' | 'production'
}

export interface TextData {
  content: string
  color: string
  background: string
  fontSize: number
}

declare global {
  const frameConfig: FrameConfig
  
  interface Window {
    PICTURE_FRAME_CONFIG: PictureFrameConfig
    showTab?: (event: MouseEvent, tabName: string) => void
  }
}