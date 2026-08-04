import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { useState } from 'react'

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

import avatarImage from '@/assets/images/me.png'
import resumePDF from '@/assets/files/NEILVEN_MASCARINAS.pdf'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { portfolioContent } from '@/features/portfolio/content'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useSecretClick } from '@/features/admin/hooks/use-secret-click'

const navItems = [
  { path: '/', label: 'Index' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/contact', label: 'Contact' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const handleSecretClick = useSecretClick(5, 500)
  const { profile } = portfolioContent

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md md:hidden">
      <Link to="/" className="flex items-center gap-2.5">
        <Avatar
          className="size-8 rounded-none border border-border/70"
          onClick={handleSecretClick}
        >
          <AvatarImage src={avatarImage} alt={profile.fullName} className="object-cover" />
          <AvatarFallback className="rounded-none font-display text-xs font-semibold">
            NM
          </AvatarFallback>
        </Avatar>
        <span className="font-display text-sm font-semibold tracking-tight">
          {profile.fullName}
        </span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="size-9" />}>
          <Menu className="size-5" />
          <span className="sr-only">Open menu</span>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] border-r border-border/60 bg-background p-0"
        >
          <SheetHeader className="px-6 pb-4 pt-6 text-left">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex items-center gap-3">
              <Avatar
                className="size-11 rounded-none border border-border/70"
                onClick={handleSecretClick}
              >
                <AvatarImage src={avatarImage} alt={profile.fullName} className="object-cover" />
                <AvatarFallback className="rounded-none font-display text-sm font-semibold">
                  NM
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h2 className="truncate font-display text-base font-semibold tracking-tight">
                  {profile.fullName}
                </h2>
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                  Full-stack developer
                </p>
              </div>
            </div>

            <p className="flex items-center gap-2 pt-4 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-500 opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-violet-500" />
              </span>
              Available for work
            </p>
          </SheetHeader>

          <nav className="mt-2 border-t border-border/60">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-3 border-b border-border/60 px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              >
                <span className="tabular-nums text-border">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-2 px-6 pt-6">
            <a
              href={`mailto:${profile.email}`}
              className="block font-mono text-[0.6875rem] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {profile.email}
            </a>
            <a
              href={resumePDF}
              download="NEILVEN_MASCARINAS.pdf"
              className="block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Download CV ↓
            </a>
          </div>

          <div className="flex items-center gap-4 px-6 pt-5">
            <a
              href="https://github.com/s0shiro"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <GithubIcon className="size-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/neilven-mascari%C3%B1as-0809452a8/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <LinkedinIcon className="size-4" />
            </a>
          </div>

          <div className="px-6 pt-8">
            <ThemeToggle />
          </div>

          <p className="absolute bottom-8 left-6 font-mono text-[0.625rem] text-muted-foreground">
            © {new Date().getFullYear()} {profile.fullName}
          </p>
        </SheetContent>
      </Sheet>
    </header>
  )
}
