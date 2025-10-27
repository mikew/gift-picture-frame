import { createFileRoute } from '@tanstack/solid-router'


export const Route = createFileRoute('/about')({
  component: () => {
    return <>about page</>
  }
})

