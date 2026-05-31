import { motion } from 'framer-motion'
import { ArrowUpRight, AlertCircle, FolderOpen } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { Badge } from '@/components/ui/badge'
import { fetchPublicProjects, type ApiProject } from '../api/get-projects'

type DisplayProject = {
  key: string
  name: string
  role?: string
  href: string | null
  summary: string
  highlights: string[]
  technologies: string[]
}

function formatProjects(apiProjects: ApiProject[]): DisplayProject[] {
  return apiProjects.map((p) => ({
    key: p.id,
    name: p.title,
    href: p.link,
    summary: p.description,
    highlights: [],
    technologies: p.tags,
  }))
}

function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-[1px] border border-border/50 bg-border/50 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col bg-background p-6 md:p-8 animate-pulse">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div className="h-3 w-24 rounded bg-muted" />
          </div>
          <div className="mb-2 h-7 w-3/4 rounded bg-muted" />
          <div className="mb-8 space-y-2 flex-1">
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-5/6 rounded bg-muted" />
            <div className="h-3 w-4/6 rounded bg-muted" />
          </div>
          <div className="mt-auto flex gap-2">
            <div className="h-5 w-14 rounded bg-muted" />
            <div className="h-5 w-14 rounded bg-muted" />
          </div>
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

  const pageHeader = (
    <section className="space-y-4">
      <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Projects</p>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tighter sm:text-5xl">
        Selected work across monitoring, booking, and operational tooling.
      </h1>
      <p className="max-w-3xl text-base leading-7 text-muted-foreground">
        These projects reflect the kind of software I enjoy building most: systems with clear business use,
        multi-role workflows, and a direct impact on everyday operations.
      </p>
    </section>
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        {pageHeader}
        <ProjectsGridSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {pageHeader}
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border/50 py-20 text-center">
          <AlertCircle className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Failed to load projects.</p>
          <button
            onClick={() => refetch()}
            className="text-sm font-medium underline underline-offset-4 hover:text-foreground text-muted-foreground transition-colors"
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
      <div className="space-y-6">
        {pageHeader}
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/50 py-20 text-center">
          <FolderOpen className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No projects yet — check back soon.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {pageHeader}

      <div className="grid grid-cols-1 gap-[1px] border border-border/50 bg-border/50 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.key}
            className="flex flex-col bg-background p-6 transition-colors hover:bg-muted/10 md:p-8"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
          >
            <div className="mb-6 flex items-start justify-between gap-3">
              <div className="flex items-center gap-x-2">
                <span className="text-xs font-mono opacity-40">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  {project.role || 'PROJECT'}
                </span>
              </div>
              {project.href && (
                <a
                  href={project.href}
                  rel="noreferrer"
                  target="_blank"
                  className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={`Open ${project.name}`}
                >
                  <ArrowUpRight className="size-4" />
                </a>
              )}
            </div>
            
            <div className="mb-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {project.name}
              </h2>
            </div>
            
            <div className="mb-8 flex-1">
              <p className="text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
              {project.highlights.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm leading-6 text-foreground/90">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {project.technologies.length > 0 && (
               <div className="mt-auto flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge 
                    key={tech} 
                    variant="outline" 
                    className="rounded-sm border-border/40 px-2 py-0.5 text-[10px] font-mono tracking-wider text-muted-foreground backdrop-blur-none"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}