import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/$catchall')({
  component: Home,
})

function Home() {
  return <></>
}
