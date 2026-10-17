import { createLazyFileRoute } from '@tanstack/react-router'
import { ProjectCaseStudyPage } from '@/features/portfolio/components/project-case-study'

export const Route = createLazyFileRoute('/projects_/$projectId')({
  component: ProjectPage,
})

function ProjectPage() {
  const { projectId } = Route.useParams()
  return <ProjectCaseStudyPage projectId={projectId} />
}
