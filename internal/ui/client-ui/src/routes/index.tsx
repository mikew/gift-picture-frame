import { createFileRoute } from '@tanstack/solid-router'

import App from '#src/components/App.tsx'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <>
      <App />
    </>
  )
}
