import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/solid-router'
import { Suspense } from 'solid-js'
import type * as Solid from 'solid-js'
import { HydrationScript } from 'solid-js/web'

import App from '#src/components/App.tsx'

const RootComponent: Solid.Component = () => {
  return (
    <html>
      <head>
        <HydrationScript />
      </head>
      <body>
        <HeadContent />
        <Suspense>
          <App />
          <Outlet />
        </Suspense>
        <Scripts />
      </body>
    </html>
  )
}

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
window.APP_IS_EMBEDDED = '__APP_IS_EMBEDDED__';
    `,
      },
    ],
  }),
  component: RootComponent,
})
