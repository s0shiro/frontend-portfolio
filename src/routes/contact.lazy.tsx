import { createLazyFileRoute } from '@tanstack/react-router'
import { Clock, Mail } from 'lucide-react'

import { ContactForm } from '@/features/portfolio/components/contact-form'
import { SocialBentoGrid } from '@/features/portfolio/components/social-bento'
import { portfolioContent } from '@/features/portfolio/content'

export const Route = createLazyFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl space-y-12">
      <div className="grid gap-6 rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-md md:grid-cols-[1fr_auto] md:items-end md:p-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Contact</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Let&apos;s talk about practical web products and frontend roles.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            Send a message for hiring opportunities, portfolio questions, or project collaborations. I&apos;ll reply as soon as I can.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 md:min-w-72 md:grid-cols-1">
          <a
            href={`mailto:${portfolioContent.profile.email}`}
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Mail className="size-4 text-primary" />
            {portfolioContent.profile.email}
          </a>
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
            <Clock className="size-4 text-primary" />
            Based in {portfolioContent.profile.location}
          </div>
        </div>
      </div>

      <hr className="border-border/40" />

      <div className="grid gap-16">
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold tracking-tight">Find me on social media</h2>
          <SocialBentoGrid />
        </section>

        <section className="space-y-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">Or send me a message</h2>
          <ContactForm />
        </section>
      </div>
    </div>
  )
}
