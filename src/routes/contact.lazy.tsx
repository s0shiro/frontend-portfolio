import { createLazyFileRoute } from '@tanstack/react-router'

import { ContactForm } from '@/features/portfolio/components/contact-form'
import { SocialBentoGrid } from '@/features/portfolio/components/social-bento'
import { portfolioContent } from '@/features/portfolio/content'

export const Route = createLazyFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const { profile } = portfolioContent

  return (
    <div className="space-y-16">
      <header className="space-y-6">
        <span className="eyebrow">Contact</span>
        <h1 className="display-xl max-w-4xl text-foreground">
          Let&apos;s talk about practical web products.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          Hiring opportunities, portfolio questions, or project collaborations — send a
          message and I&apos;ll reply as soon as I can.
        </p>
      </header>

      <dl className="grid gap-x-8 gap-y-4 border-y border-border/60 py-5 sm:grid-cols-2">
        <div className="flex items-baseline gap-4">
          <dt className="eyebrow shrink-0 whitespace-nowrap">Reply time</dt>
          <dd className="font-mono text-sm text-muted-foreground">Within a few days</dd>
        </div>
        <div className="flex items-baseline gap-4">
          <dt className="eyebrow shrink-0 whitespace-nowrap">Based in</dt>
          <dd className="font-mono text-sm text-muted-foreground">{profile.location}</dd>
        </div>
      </dl>

      <section>
        <div className="flex items-baseline gap-4 pb-6">
          <span className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground">01</span>
          <span className="eyebrow">Elsewhere</span>
          <span className="h-px flex-1 bg-border/70" />
        </div>
        <SocialBentoGrid />
      </section>

      <section>
        <div className="flex items-baseline gap-4 pb-6">
          <span className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground">02</span>
          <span className="eyebrow">Send a message</span>
          <span className="h-px flex-1 bg-border/70" />
        </div>
        <div className="max-w-xl">
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
