import { useQuery } from '@tanstack/react-query'
import { CodeIcon, PaletteIcon } from 'lucide-react'
import { motion } from 'framer-motion'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ExperienceItemType, ExperiencePositionItemType } from '@/components/work-experience/work-experience'
import { WorkExperience } from '@/components/work-experience/work-experience'
import { portfolioContent } from '@/features/portfolio/content'
import { fetchPublicExperiences, type ApiExperience } from '../api/get-experiences'

function pickPositionIcon(role: string) {
  const lower = role.toLowerCase()
  if (lower.includes('design') || lower.includes('ui')) return PaletteIcon
  return CodeIcon
}

function formatPeriod(start: string, end: string | null): string {
  const fmt = (d: string) => {
    const date = new Date(d)
    return `${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
  }
  return end ? `${fmt(start)} – ${fmt(end)}` : `${fmt(start)} – ∞`
}

function formatExperiences(apiExperiences: ApiExperience[] | undefined): ExperienceItemType[] {
  if (!apiExperiences) return []

  // Group API experiences by company name
  const companyMap = new Map<string, ApiExperience[]>()
  for (const exp of apiExperiences) {
    const group = companyMap.get(exp.company) ?? []
    group.push(exp)
    companyMap.set(exp.company, group)
  }

  const apiItems: ExperienceItemType[] = []
  for (const [company, entries] of companyMap) {
    // Sort positions: newest first by startDate
    const sorted = [...entries].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    )

    const positions: ExperiencePositionItemType[] = sorted.map((e) => ({
      id: e.id,
      title: e.role,
      employmentPeriod: formatPeriod(e.startDate, e.endDate),
      employmentType: e.employmentType ?? undefined,
      description: e.description ?? undefined,
      icon: pickPositionIcon(e.role),
      skills: e.skills ?? undefined,
    }))

    const hasCurrentRole = sorted.some((e) => !e.endDate)

    apiItems.push({
      id: sorted[0].id,
      companyName: company,
      positions,
      isCurrentEmployer: hasCurrentRole,
    })
  }

  return apiItems
}

export function AboutTimeline() {
  const { data: apiExperiences } = useQuery({
    queryKey: ['portfolio', 'experiences'],
    queryFn: fetchPublicExperiences,
    staleTime: 1000 * 60 * 5,
  })

  const experiences = formatExperiences(apiExperiences)
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">About</p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tighter sm:text-5xl">
          From academic projects to systems that support real operations.
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          {portfolioContent.profile.summary}
        </p>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Experience</p>
          <h2 className="text-2xl font-bold tracking-tighter">What I have shipped so far</h2>
        </div>
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden rounded-xl border border-border/60 bg-background/50 backdrop-blur-md"
          >
            <WorkExperience experiences={experiences} />
          </motion.div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/60 bg-card/80 backdrop-blur-md">
          <CardHeader>
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Education</p>
            <CardTitle className="text-2xl font-bold tracking-tighter">
              Formal foundations in technology and problem solving
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {portfolioContent.education.map((item) => (
              <div key={item.institution} className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="text-lg font-semibold tracking-tight text-foreground">{item.institution}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.program}</p>
                {item.note ? <p className="mt-2 text-sm text-foreground/80">{item.note}</p> : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/70 backdrop-blur-md">
          <CardHeader>
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Working Style</p>
            <CardTitle className="text-2xl font-bold tracking-tighter">
              How I like to build
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>I prefer software that is readable, practical, and shaped by the actual workflow it supports.</p>
            <p>I value code reviews, iterative delivery, and UI decisions that make operational tasks faster and clearer.</p>
            <p>I am especially interested in full-stack work where product decisions and implementation quality matter equally.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}