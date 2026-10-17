import { type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, BriefcaseIcon } from 'lucide-react'
import {
  AnimatedHeading,
  Reveal,
  SectionLabel,
} from '@/components/shared/portfolio-motion'

import type {
  ExperienceItemType,
  ExperiencePositionItemType,
} from '@/components/work-experience/work-experience'
import { WorkExperience } from '@/components/work-experience/work-experience'
import { portfolioContent } from '@/features/portfolio/content'
import {
  fetchPublicExperiences,
  type ApiExperience,
} from '../api/get-experiences'

function formatPeriod(start: string, end: string | null): string {
  const fmt = (value: string) => {
    const date = new Date(value)
    return `${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
  }

  return end ? `${fmt(start)} — ${fmt(end)}` : `${fmt(start)} — NOW`
}

function formatExperiences(
  apiExperiences: ApiExperience[] | undefined,
): ExperienceItemType[] {
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
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    )

    const positions: ExperiencePositionItemType[] = sorted.map(
      (entry, index) => ({
        id: entry.id,
        title: entry.role,
        employmentPeriod: formatPeriod(entry.startDate, entry.endDate),
        employmentType: entry.employmentType ?? undefined,
        description: entry.description ?? undefined,
        skills: entry.skills ?? undefined,
        accomplishments: entry.accomplishments ?? [],
        // Lead with the most recent role open; older ones stay collapsed.
        isExpanded: index === 0,
      }),
    )

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
    experienceContent = <WorkExperience experiences={experiences} />
  }

  return (
    <div className="inner-page about-page">
      <header className="inner-page-header">
        <SectionLabel index="02" label="A little about me" />
        <AnimatedHeading text={'MORE THAN\nTHE CODE.'} />
      </header>

      <section className="about-introduction" aria-label="Introduction">
        <Reveal className="about-intro-statement">
          <p className="large-copy">
            A developer with a curious mind and a soft spot for making things
            work better.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="about-story">
          <p>{portfolioContent.profile.summary}</p>
          <p>
            I enjoy connecting the dots between what people need and what
            technology can do. That means thinking about the interface, the
            data, and all the small decisions that make a product feel right.
          </p>
          <dl className="about-facts">
            <div>
              <dt>Home base</dt>
              <dd>{portfolioContent.profile.location}</dd>
            </div>
            <div>
              <dt>Currently</dt>
              <dd>Open to frontend & full-stack roles</dd>
            </div>
          </dl>
        </Reveal>
      </section>

      <section className="about-record-section">
        <SectionLabel index="01" label="Along the way" />
        <h2>Experience.</h2>
        {experienceContent}
      </section>

      <section className="about-record-section">
        <SectionLabel index="02" label="The foundations" />
        <h2>Education.</h2>
        <Reveal>
          <div>
            {portfolioContent.education.map((item, index) => (
              <div key={item.institution} className="education-record">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.institution}</h3>
                <p>
                  {item.program}
                  {item.note && <small>{item.note}</small>}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="about-record-section">
        <SectionLabel index="03" label="A few things I believe" />
        <h2>How I approach the work.</h2>
        <div className="principle-grid">
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
          ].map((item, index) => (
            <Reveal key={item.heading} delay={index * 0.06}>
              <span className="principle-number">
                {String(index + 1).padStart(2, '0')} /
              </span>
              <h3>{item.heading}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
