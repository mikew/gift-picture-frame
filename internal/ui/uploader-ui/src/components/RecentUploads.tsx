import type { MediaItem } from 'shared/types.ts'
import { For, Show } from 'solid-js'

import './RecentUploads.css'
import AppConfig from '../appConfig'

interface RecentUploadsProps {
  uploads: MediaItem[]
  frameId: string
}

export default function RecentUploads(props: RecentUploadsProps) {
  const renderMediaPreview = (item: MediaItem) => {
    if (item.type === 'image') {
      return (
        <img
          src={`${AppConfig.apiBase}/files/${props.frameId}/${item.filename}`}
          alt={item.filename}
        />
      )
    } else if (item.type === 'video') {
      return <div class="media-icon">🎬</div>
    } else if (item.type === 'text') {
      return <div class="media-icon">📝</div>
    }
  }

  return (
    <div class="recent-uploads">
      <h3>Recent Uploads</h3>
      <div class="recent-list">
        <Show when={props.uploads.length > 0} fallback={<p>No uploads yet</p>}>
          <For each={props.uploads.slice(-12).reverse()}>
            {(item) => (
              <div class="recent-item">
                <div class="media-preview">{renderMediaPreview(item)}</div>
                <div class="item-type">{item.type.toUpperCase()}</div>
                <div class="item-name">{item.filename || 'Text Message'}</div>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  )
}
