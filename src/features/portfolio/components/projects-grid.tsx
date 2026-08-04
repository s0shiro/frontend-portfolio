import { motion } from 'framer-motion'
import { ArrowUpRight, AlertCircle, FolderOpen } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { cn } from '@/lib/utils'
import { fetchPublicProjects, type ApiProject } from '../api/get-projects'

type DisplayProject = {
  key: string
  name: string
  href: string | null
  summary: string
  imageUrl: string | null
  technologies: string[]
}

function formatProjects(apiProjects: ApiProject[]): DisplayProject[] {
  return apiProjects.map((project) => ({
    key: project.id,
    name: project.title,
    href: project.link,
    summary: project.description,
    imageUrl: project.imageUrl,
    technologies: project.tags,
  }))
}

function PageHeader() {
  return (
    <header className="space-y-6">
      <span className="eyebrow">Projects</span>
      <h1 className="display-xl max-w-4xl text-foreground">Selected work.</h1>
      <p className="max-w-2xl text-base leading-7 text-muted-foreground">
        Systems with clear business use, multi-role workflows, and real operational impact.
      </p>
    </header>
  )
}

function ProjectsSkeleton() {
  return (
    <div className="animate-pulse border-t border-border/60">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="record-row grid gap-x-8 gap-y-3 py-8 md:grid-cols-[3rem_1fr_11rem]"
        >
          <div className="h-3 w-6 rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-6 w-2/3 rounded bg-muted" />
            <div className="h-3 w-full max-w-md rounded bg-muted" />
          </div>
          <div className="h-3 w-24 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

export function ProjectsGrid() {
  const { data: apiProjects = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['portfolio', 'projects'],
    queryFn: fetchPublicProjects,
  })

  if (isLoading) {
    return (
      <div className="space-y-16">
        <PageHeader />
        <ProjectsSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-16">
        <PageHeader />
        <div className="flex flex-col items-center justify-center gap-3 border-y border-border/60 py-20 text-center">
          <AlertCircle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">The project list didn&apos;t load.</p>
          <button
            onClick={() => void refetch()}
            className="font-mono text-xs uppercase tracking-[0.16em] text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  const projects = formatProjects(apiProjects)

  if (projects.length === 0) {
    return (
      <div className="space-y-16">
        <PageHeader />
        <div className="flex flex-col items-center justify-center gap-3 border-y border-border/60 py-20 text-center">
          <FolderOpen className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No projects published yet.</p>
        </div>
      </div>
    )
  }

  // Reserve the cover column only once something actually has a cover, so a
  // project list without images keeps its tighter three-column rhythm.
  const hasAnyCover = projects.some((project) => project.imageUrl)

  return (
    <div className="space-y-16">
      <PageHeader />

      <div className="border-t border-border/60">
        {projects.map((project, index) => {
          const Row = project.href ? 'a' : 'div'

          return (
            <motion.div
              key={project.key}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="record-row"
            >
              <Row
                {...(project.href
                  ? { href: project.href, target: '_blank', rel: 'noreferrer' }
                  : {})}
                className={cn(
                  'group grid gap-x-8 gap-y-3 py-8',
                  hasAnyCover
                    ? 'md:grid-cols-[3rem_11rem_1fr_10rem]'
                    : 'md:grid-cols-[3rem_1fr_11rem]',
                )}
              >
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* The cell still occupies its column when empty, so rows stay
                    aligned, but draws no frame — an empty box reads as broken. */}
                {hasAnyCover ? (
                  project.imageUrl ? (
                    <div className="aspect-video w-full overflow-hidden border border-border/70 bg-muted/30">
                      <img
                        src={project.imageUrl}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div aria-hidden />
                  )
                ) : null}

                <div className="min-w-0">
                  <h2 className="flex items-start gap-2 font-display text-2xl font-semibold tracking-tight text-foreground">
                    <span className="group-hover:underline group-hover:underline-offset-4">
                      {project.name}
                    </span>
                    {project.href ? (
                      <ArrowUpRight
                        className="mt-1.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                        aria-hidden
                      />
                    ) : null}
                  </h2>
                  <p className="max-w-xl pt-2 text-sm leading-6 text-muted-foreground">
                    {project.summary}
                  </p>
                </div>

                {project.technologies.length > 0 ? (
                  <ul className="flex flex-wrap gap-x-3 gap-y-1 md:flex-col md:gap-1">
                    {project.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="font-mono text-[0.6875rem] text-muted-foreground before:mr-1.5 before:text-border before:content-['/']"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Row>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
