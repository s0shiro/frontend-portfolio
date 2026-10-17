import { createLazyFileRoute } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

import { ContactForm } from '@/features/portfolio/components/contact-form'
import { SocialBentoGrid } from '@/features/portfolio/components/social-bento'
import { portfolioContent } from '@/features/portfolio/content'
import {
  AnimatedHeading,
  Reveal,
  SectionLabel,
} from '@/components/shared/portfolio-motion'

export const Route = createLazyFileRoute('/contact')({ component: ContactPage })

function ContactPage() {
  const { profile } = portfolioContent

  return (
    <div className="inner-page contact-page">
      <header className="inner-page-header">
        <SectionLabel index="03" label="Say hello" />
        <AnimatedHeading text={'GOOD THINGS\nSTART HERE.'} />
      </header>
      <div className="contact-grid">
        <Reveal>
          <p className="contact-lede">
            Have an idea, a role, or just something interesting to share? I’d
            love to hear it.
          </p>
          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
            <ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" />
          </a>
          <dl className="contact-info">
            <div>
              <dt>Based in</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt>Usually replies</dt>
              <dd>Within a few days</dd>
            </div>
          </dl>
          <SocialBentoGrid />
        </Reveal>
        <section className="contact-form-side">
          <h2>Leave a little note.</h2>
          <ContactForm />
        </section>
      </div>
    </div>
  )
}
