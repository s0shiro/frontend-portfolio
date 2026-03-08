import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="p-2">
      <h3>About page</h3>
      <p>This is the file-based about route.</p>
    </div>
  )
}
