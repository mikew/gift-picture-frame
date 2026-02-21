export interface MediaItem {
  id: string
  type: 'image' | 'video' | 'text'
  filename: string
  content: string
  created_at: string
  deleted: boolean
}

export interface PictureFrameConfig {
  mode: 'development' | 'production'
}

export interface TextData {
  content: string
  textStyle: string
}
