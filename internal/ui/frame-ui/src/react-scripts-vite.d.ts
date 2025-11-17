/// <reference types="@promoboxx/react-scripts-vite/client" />
/// <reference types="vite-plugin-solid-svg/types" />

import 'solid-js/jsx-runtime'

declare module 'solid-js/jsx-runtime' {
  namespace JSX {
    interface CSSProperties {
      'anchor-name'?: string
      'position-anchor'?: string
    }
  }
}
