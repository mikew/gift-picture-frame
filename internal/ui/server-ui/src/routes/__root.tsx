import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/solid-router'
import { Suspense } from 'solid-js'
import { HydrationScript } from 'solid-js/web'

import App from '../components/App'

export const Route = createRootRoute({
  notFoundComponent: () => <div>404 Not Found</div>,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    scripts: [
      {
        children: `
    window.PICTURE_FRAME_CONFIG = {
      mode:
        '__APP_IS_EMBEDDED__' === '_' + '_APP_IS_EMBEDDED__'
          ? 'development'
          : 'production',
    }
    `,
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: Solid.JSX.Element }>) {
  return (
    <html>
      <head>
        <HydrationScript />
      </head>
      <body>
        <HeadContent />
        <Suspense>
          <App />
          {children}
        </Suspense>
        <Scripts />
      </body>
    </html>
  )
}
