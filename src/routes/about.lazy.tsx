import { createLazyFileRoute } from '@tanstack/react-router'

import { AboutTimeline } from '@/features/portfolio/components/about-timeline'

export const Route = createLazyFileRoute('/about')({
  component: About,
})

function About() {
  return <AboutTimeline />
}
