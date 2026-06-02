import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { AlertCircle } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type AdminPageHeaderProps = {
  eyebrow: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function AdminPageHeader({ eyebrow, title, description, action, className }: AdminPageHeaderProps) {
  return (
    <section className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">{eyebrow}</p>
        <h1 className="text-4xl font-bold tracking-tighter text-foreground">{title}</h1>
        {description ? <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </section>
  )
}

type AdminStateProps = {
  title?: string
  description: string
  icon?: LucideIcon
  className?: string
}

export function AdminEmptyState({ title = 'Nothing here yet', description, icon: Icon, className }: AdminStateProps) {
  return (
    <Card className={cn('border-dashed border-border/60 bg-background/50 backdrop-blur-md', className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        {Icon ? <Icon className="mb-4 size-8 opacity-30" aria-hidden="true" /> : null}
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}

export function AdminLoadingState({ description = 'Loading...' }: { description?: string }) {
  return (
    <Card className="border-border/60 bg-background/70 backdrop-blur-md">
      <CardContent className="py-8 text-sm text-muted-foreground">{description}</CardContent>
    </Card>
  )
}

export function AdminErrorState({ description, className }: { description: string; className?: string }) {
  return (
    <Card className={cn('border-destructive/30 bg-destructive/5', className)}>
      <CardContent className="flex items-start gap-2 py-6 text-sm text-destructive">
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>{description}</span>
      </CardContent>
    </Card>
  )
}
