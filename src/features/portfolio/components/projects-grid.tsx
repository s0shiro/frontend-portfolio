import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { portfolioContent } from '@/features/portfolio/content'

type ApiProject = {
  id: string
  title: string
  description: string
  link: string | null
  imageUrl: string | null
  tags: string[]
  orderIndex: number
}

type DisplayProject = {
  key: string
  name: string
  role?: string
  href: string | null
  summary: string
  highlights: string[]
  technologies: string[]
}

async function fetchPublicProjects(): Promise<ApiProject[]> {
  const res = await fetch('/api/portfolio/projects')
  if (!res.ok) throw new Error('Failed to fetch projects')
  const json = (await res.json()) as { success: boolean; data: ApiProject[] }
  return json.data
}

function mergeProjects(apiProjects: ApiProject[]): DisplayProject[] {
  // Static projects from content.ts always included
  const staticItems: DisplayProject[] = portfolioContent.projects.map((p) => ({
    key: `static-${p.name}`,
    name: p.name,
    role: p.role,
    href: p.href,
    summary: p.summary,
    highlights: p.highlights,
    technologies: p.technologies,
  }))

  // API projects added after static ones
  const apiItems: DisplayProject[] = apiProjects.map((p) => ({
    key: `api-${p.id}`,
    name: p.title,
    href: p.link,
    summary: p.description,
    highlights: [],
    technologies: p.tags,
  }))

  return [...staticItems, ...apiItems]
}

export function ProjectsGrid() {
  const { data: apiProjects = [] } = useQuery({
    queryKey: ['portfolio', 'projects'],
    queryFn: fetchPublicProjects,
  })

  const projects = mergeProjects(apiProjects)
  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-12 gap-4 md:gap-5">
        {projects.map((project, index) => (
          <motion.div
            key={project.key}
            className={`col-span-12 ${index === 0 ? 'lg:col-span-7' : 'lg:col-span-5'}`}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            whileHover={{ y: -5 }}
          >
            <Card className="h-full border-border/60 bg-background/70 backdrop-blur-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {project.role && (
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        {project.role}
                      </p>
                    )}
                    <CardTitle className="mt-2 text-2xl font-bold tracking-tighter">
                      {project.name}
                    </CardTitle>
                  </div>
                  {project.href && (
                    <Button
                      aria-label={`Open ${project.name}`}
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      render={<a href={project.href} rel="noreferrer" target="_blank" />}
                    >
                      <ArrowUpRight className="size-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sm leading-6 text-muted-foreground">{project.summary}</p>
                {project.highlights.length > 0 && (
                  <ul className="space-y-3 text-sm leading-6 text-foreground/90">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <Badge key={technology} variant="outline">
                        {technology}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}