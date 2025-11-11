import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/solid-router'
import type * as Solid from 'solid-js'
import { Suspense } from 'solid-js'
import { HydrationScript } from 'solid-js/web'

import { lightThemeClass } from '#src/theme.css.ts'

import '#src/components/_transitions.css'

const RootComponent: Solid.Component = () => {
  return (
    <html>
      <head>
        <HydrationScript />
      </head>
      <body class={lightThemeClass}>
        <HeadContent />
        <Suspense>
          <Outlet />
        </Suspense>
        <Scripts />
      </body>
    </html>
  )
}

export const Route = createRootRoute({
  notFoundComponent: () => <div>404 Not Found</div>,
  errorComponent: (props) => {
    console.error(props.error)

    return <>whoops</>
  },
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
