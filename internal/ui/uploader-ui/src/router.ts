import { createRouter } from '@tanstack/solid-router'

import 'shared/reset.css'

import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,

    // https://github.com/TanStack/router/discussions/1765
    defaultPendingMinMs: 0,
    defaultPendingMs: 0,
  })

  return router
}
