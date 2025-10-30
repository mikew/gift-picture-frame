import { createFileRoute, useParams } from '@tanstack/solid-router'

export const Route = createFileRoute('/$catchall')({
  component: Home,
})

function Home() {
  const wut = useParams({
    strict: false,
  })
  console.log('wut', wut())

  return <></>
}
