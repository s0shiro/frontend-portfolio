import { ChevronRight } from "lucide-react"
import type { ComponentProps } from "react"
import ReactMarkdown from "react-markdown"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ContactSheet } from "@/features/portfolio/components/contact-sheet"
import type { ApiAccomplishment } from "@/features/portfolio/api/get-experiences"
import { cn } from "@/lib/utils"

export type ExperiencePositionItemType = {
  /** Unique identifier for the position */
  id: string
  /** The job title or position name */
  title: string
  /** The period during which the position was held (e.g., "2023 — NOW") */
  employmentPeriod: string
  /** The type of employment (e.g., "Full-time", "Part-time", "Contract") */
  employmentType?: string
  /** A brief description of the position or responsibilities */
  description?: string
  /** A list of skills associated with the position */
  skills?: string[]
  /** Uploaded proof of work shown as a contact sheet beneath the entry */
  accomplishments?: ApiAccomplishment[]
  /** Indicates if the position details are expanded in the UI */
  isExpanded?: boolean
}

export type ExperienceItemType = {
  /** Unique identifier for the experience item */
  id: string
  /** Name of the company where the experience was gained */
  companyName: string
  /** URL or path to the company's logo image */
  companyLogo?: string
  /**
   * List of positions held at the company
   * @fumadocsHref #experiencepositionitemtype
   * */
  positions: ExperiencePositionItemType[]
  /** Indicates if this is the user's current employer */
  isCurrentEmployer?: boolean
}

export type WorkExperienceProps = {
  className?: string
  /** @fumadocsHref #experienceitemtype */
  experiences: ExperienceItemType[]
}

export function WorkExperience({ className, experiences }: WorkExperienceProps) {
  return (
    <div className={cn("border-t border-border/60", className)}>
      {experiences.map((experience) => (
        <ExperienceItem key={experience.id} experience={experience} />
      ))}
    </div>
  )
}

export type ExperienceItemProps = {
  experience: ExperienceItemType
}

export function ExperienceItem({ experience }: ExperienceItemProps) {
  return (
    <section className="record-row py-8">
      <header className="flex items-center gap-3 pb-6">
        {experience.companyLogo ? (
          <img
            src={experience.companyLogo}
            alt=""
            width={20}
            height={20}
            className="size-5 shrink-0 rounded-full"
            aria-hidden
          />
        ) : null}

        <h3 className="display-md text-foreground">{experience.companyName}</h3>

        {experience.isCurrentEmployer && (
          <span className="flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="relative flex items-center justify-center">
              <span className="absolute inline-flex size-2.5 animate-ping rounded-full bg-info opacity-50" />
              <span className="relative inline-flex size-1.5 rounded-full bg-info" />
            </span>
            Current
          </span>
        )}
      </header>

      <div className="space-y-8">
        {experience.positions.map((position) => (
          <ExperiencePositionItem key={position.id} position={position} />
        ))}
      </div>
    </section>
  )
}

export type ExperiencePositionItemProps = {
  position: ExperiencePositionItemType
}

export function ExperiencePositionItem({
  position,
}: ExperiencePositionItemProps) {
  const accomplishments = position.accomplishments ?? []

  return (
    <article className="grid gap-x-8 gap-y-3 md:grid-cols-[8.5rem_1fr]">
      {/* Date rail — the machine layer, aligned left on wide screens */}
      <div className="flex items-baseline gap-3 md:flex-col md:gap-1">
        <p className="font-mono text-xs tabular-nums text-foreground">
          {position.employmentPeriod}
        </p>
        {position.employmentType ? (
          <p className="font-mono text-[0.6875rem] text-muted-foreground">
            {position.employmentType}
          </p>
        ) : null}
      </div>

      <div className="min-w-0">
        <Collapsible
          defaultOpen={position.isExpanded}
          disabled={!position.description}
        >
          <CollapsibleTrigger
            className={cn(
              "group not-prose -mx-2 flex w-[calc(100%+1rem)] items-center gap-2 rounded px-2 py-1 text-left select-none",
              "transition-colors hover:bg-muted/40 data-[disabled]:hover:bg-transparent",
            )}
          >
            <h4 className="flex-1 font-display text-lg font-semibold tracking-tight text-balance text-foreground">
              {position.title}
            </h4>

            {position.description ? (
              <ChevronRight
                className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[panel-open]:rotate-90"
                aria-hidden
              />
            ) : null}
          </CollapsibleTrigger>

          <CollapsibleContent className="overflow-hidden">
            {position.description && (
              <Prose className="pt-2">
                <ReactMarkdown>{position.description}</ReactMarkdown>
              </Prose>
            )}
          </CollapsibleContent>
        </Collapsible>

        {Array.isArray(position.skills) && position.skills.length > 0 && (
          <ul className="not-prose flex flex-wrap gap-x-3 gap-y-1.5 pt-3">
            {position.skills.map((skill) => (
              <li key={skill} className="flex">
                <Skill>{skill}</Skill>
              </li>
            ))}
          </ul>
        )}

        <ContactSheet accomplishments={accomplishments} label={position.title} />
      </div>
    </article>
  )
}

function Prose({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none prose-ncdai text-muted-foreground prose-zinc dark:prose-invert",
        className,
      )}
      {...props}
    />
  )
}

function Skill({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "font-mono text-[0.6875rem] tracking-tight text-muted-foreground",
        "before:mr-1.5 before:text-border before:content-['/']",
        className,
      )}
      {...props}
    />
  )
}
