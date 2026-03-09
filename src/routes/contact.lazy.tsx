import { createLazyFileRoute } from '@tanstack/react-router'
import { ContactForm } from '@/features/portfolio/components/contact-form'
import { SocialBentoGrid } from '@/features/portfolio/components/social-bento'

export const Route = createLazyFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Contact</h1>
        <p className="text-lg text-muted-foreground">Let&apos;s get in touch.</p>
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
