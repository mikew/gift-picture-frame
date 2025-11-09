import { createFileRoute } from '@tanstack/solid-router'

import App from '#src/components/App.tsx'

export const Route = createFileRoute('/$catchall')({
  component: Home,
})

function Home() {
  return (
    <>
      <App />
    </>
  )
}
