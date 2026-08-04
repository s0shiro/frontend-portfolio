import { type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, BriefcaseIcon } from 'lucide-react'
import { motion } from 'framer-motion'

import type {
  ExperienceItemType,
  ExperiencePositionItemType,
} from '@/components/work-experience/work-experience'
import { WorkExperience } from '@/components/work-experience/work-experience'
import { portfolioContent } from '@/features/portfolio/content'
import { fetchPublicExperiences, type ApiExperience } from '../api/get-experiences'

function formatPeriod(start: string, end: string | null): string {
  const fmt = (value: string) => {
    const date = new Date(value)
    return `${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
  }

  return end ? `${fmt(start)} — ${fmt(end)}` : `${fmt(start)} — NOW`
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

    const positions: ExperiencePositionItemType[] = sorted.map((entry, index) => ({
      id: entry.id,
      title: entry.role,
      employmentPeriod: formatPeriod(entry.startDate, entry.endDate),
      employmentType: entry.employmentType ?? undefined,
      description: entry.description ?? undefined,
      skills: entry.skills ?? undefined,
      accomplishments: entry.accomplishments ?? [],
      // Lead with the most recent role open; older ones stay collapsed.
      isExpanded: index === 0,
    }))

    const hasCurrentRole = sorted.some((entry) => !entry.endDate)

    apiItems.push({
      id: sorted[0].id,
      companyName: company,
      positions,
      isCurrentEmployer: hasCurrentRole,
    })
  }

  return apiItems
}

function ExperienceSkeleton() {
  return (
    <div className="animate-pulse border-t border-border/60">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="record-row space-y-6 py-8">
          <div className="h-7 w-52 rounded bg-muted" />
          <div className="grid gap-x-8 gap-y-3 md:grid-cols-[8.5rem_1fr]">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-5 w-64 rounded bg-muted" />
              <div className="h-3 w-full max-w-md rounded bg-muted" />
              <div className="h-3 w-40 rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SectionHeading({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-baseline gap-4 pb-6">
      <span className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground">
        {index}
      </span>
      <span className="eyebrow">{label}</span>
      <span className="h-px flex-1 bg-border/70" />
    </div>
  )
}

export function AboutTimeline() {
  const {
    data: apiExperiences,
    isLoading: isExperiencesLoading,
    isError: isExperiencesError,
    refetch,
  } = useQuery({
    queryKey: ['portfolio', 'experiences'],
    queryFn: fetchPublicExperiences,
    staleTime: 1000 * 60 * 5,
  })

  const experiences = formatExperiences(apiExperiences)

  let experienceContent: ReactNode

  if (isExperiencesLoading) {
    experienceContent = <ExperienceSkeleton />
  } else if (isExperiencesError) {
    experienceContent = (
      <div className="flex flex-col items-center justify-center gap-3 border-y border-border/60 py-16 text-center">
        <AlertCircle className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          The experience record didn&apos;t load.
        </p>
        <button
          onClick={() => void refetch()}
          className="font-mono text-xs uppercase tracking-[0.16em] text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Try again
        </button>
      </div>
    )
  } else if (experiences.length === 0) {
    experienceContent = (
      <div className="flex flex-col items-center justify-center gap-3 border-y border-border/60 py-16 text-center">
        <BriefcaseIcon className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No roles on the record yet.
        </p>
      </div>
    )
  } else {
    experienceContent = (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.4 }}
      >
        <WorkExperience experiences={experiences} />
      </motion.div>
    )
  }

  return (
    <div className="space-y-16">
      <header className="space-y-6">
        <span className="eyebrow">About</span>
        <h1 className="display-xl max-w-4xl text-foreground">
          Building systems that support real operations.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {portfolioContent.profile.summary}
        </p>
      </header>

      <section>
        <SectionHeading index="01" label="Experience" />
        {experienceContent}
      </section>

      <section>
        <SectionHeading index="02" label="Education" />
        <dl className="border-t border-border/60">
          {portfolioContent.education.map((item) => (
            <div
              key={item.institution}
              className="record-row grid gap-x-8 gap-y-1 py-5 md:grid-cols-[8.5rem_1fr]"
            >
              <dt className="font-display text-base font-semibold tracking-tight text-foreground md:col-start-2">
                {item.institution}
              </dt>
              <dd className="font-mono text-xs text-muted-foreground md:col-start-1 md:row-start-1">
                {item.note ? 'Honors' : 'Degree'}
              </dd>
              <dd className="text-sm leading-6 text-muted-foreground md:col-start-2">
                {item.program}
                {item.note ? (
                  <span className="block pt-1 font-mono text-xs text-foreground/70">
                    {item.note}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <SectionHeading index="03" label="Working style" />
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
          {[
            {
              heading: 'Readable over clever',
              body: 'Software shaped by the workflow it supports, written so the next person can change it.',
            },
            {
              heading: 'Iterative delivery',
              body: 'Code review, small increments, and UI decisions that make operational tasks faster.',
            },
            {
              heading: 'Full-stack by choice',
              body: 'Product decisions and implementation quality matter equally, so I want a hand in both.',
            },
          ].map((item) => (
            <div key={item.heading} className="border-t border-border/60 pt-4">
              <h3 className="pb-2 font-display text-base font-semibold tracking-tight text-foreground">
                {item.heading}
              </h3>
              <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
