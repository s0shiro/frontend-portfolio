import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/shared/portfolio-motion'

// Custom SVG Brand Icons since Lucide's are deprecated
const BrandIcons = {
  Instagram: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
  Linkedin: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Github: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  ),
}

const socials = [
  {
    name: 'GitHub',
    handle: '@s0shiro',
    icon: BrandIcons.Github,
    href: 'https://github.com/s0shiro',
  },
  {
    name: 'LinkedIn',
    handle: 'neilven-mascariñas',
    icon: BrandIcons.Linkedin,
    href: 'https://www.linkedin.com/in/neilven-mascari%C3%B1as-0809452a8/',
  },
  {
    name: 'Instagram',
    handle: '@neilven_',
    icon: BrandIcons.Instagram,
    href: 'https://www.instagram.com/neilven_/',
  },
]

export function SocialBentoGrid() {
  return (
    <ul className="social-index">
      {socials.map((social, index) => {
        const isExternal = !social.href.startsWith('mailto:')

        return (
          <li key={social.name} className="social-record">
            <Reveal delay={index * 0.06}>
              <a
                href={social.href}
                {...(isExternal
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="group"
              >
                <span className="social-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <social.icon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span>{social.name}</span>
                <ArrowUpRight
                  className="size-4 shrink-0 text-muted-foreground transition-all duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 group-hover:text-foreground motion-safe:group-focus-visible:-translate-y-0.5 motion-safe:group-focus-visible:translate-x-0.5 group-focus-visible:text-foreground"
                  aria-hidden
                />
              </a>
            </Reveal>
          </li>
        )
      })}
    </ul>
  )
}
