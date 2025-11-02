import { createFileRoute } from '@tanstack/solid-router'

import App from '#src/components/App.tsx'
import '#src/components/_transitions.css'

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
