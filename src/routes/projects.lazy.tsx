import { createLazyFileRoute } from '@tanstack/react-router'

import { ProjectsGrid } from '@/features/portfolio/components/projects-grid'

export const Route = createLazyFileRoute('/projects')({
  component: Projects,
})

function Projects() {
  return <ProjectsGrid />
}