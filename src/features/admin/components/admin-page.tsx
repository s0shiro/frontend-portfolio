import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { AlertCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

type AdminPageHeaderProps = {
  eyebrow: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: AdminPageHeaderProps) {
  return (
    <section className={cn('space-y-5', className)}>
      <div className="flex items-baseline gap-4">
        <span className="eyebrow">{eyebrow}</span>
        <span className="h-px flex-1 bg-border/70" />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="display-lg text-foreground">{title}</h1>
          {description ? (
            <p className="max-w-lg text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  )
}

/** Numbered rule used to separate sections within a page. */
export function AdminSectionHeading({
  index,
  label,
  action,
}: {
  index: string
  label: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-baseline gap-4 pb-4">
      <span className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground">
        {index}
      </span>
      <span className="eyebrow">{label}</span>
      <span className="h-px flex-1 bg-border/70" />
      {action}
    </div>
  )
}

/**
 * Status as text plus a dot rather than a filled pill — keeps rows scannable
 * and reserves saturated colour for genuine problems.
 */
export function AdminStatus({
  label,
  tone = 'neutral',
}: {
  label: string
  tone?: 'neutral' | 'active' | 'attention' | 'danger'
}) {
  const dotTone = {
    neutral: 'bg-border',
    active: 'bg-info',
    attention: 'bg-violet-500',
    danger: 'bg-destructive',
  }[tone]

  const textTone = tone === 'danger' ? 'text-destructive' : 'text-muted-foreground'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em]',
        textTone,
      )}
    >
      <span className={cn('size-1.5 shrink-0 rounded-full', dotTone)} aria-hidden />
      {label}
    </span>
  )
}

type AdminStateProps = {
  title?: string
  description: string
  icon?: LucideIcon
  className?: string
}

export function AdminEmptyState({
  title = 'Nothing here yet',
  description,
  icon: Icon,
  className,
}: AdminStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 border-y border-border/60 py-16 text-center',
        className,
      )}
    >
      {Icon ? <Icon className="size-5 text-muted-foreground" aria-hidden="true" /> : null}
      <p className="font-display text-base font-semibold tracking-tight text-foreground">
        {title}
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export function AdminLoadingState({
  description = 'Loading...',
}: {
  description?: string
}) {
  return (
    <div className="border-y border-border/60 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

export function AdminErrorState({
  description,
  className,
}: {
  description: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 border-y border-destructive/40 bg-destructive/5 px-4 py-4 text-sm text-destructive',
        className,
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{description}</span>
    </div>
  )
}
