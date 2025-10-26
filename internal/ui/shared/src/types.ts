export interface MediaItem {
  type: 'image' | 'video' | 'text'
  filename: string
  content: string
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
