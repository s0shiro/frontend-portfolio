import { Link } from '@tanstack/react-router'
import {
  Menu,
  Home,
  User,
  FolderOpen,
  Mail,
  BadgeCheck,
  Download,
} from 'lucide-react'
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
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About', icon: User },
  { path: '/projects', label: 'Projects', icon: FolderOpen },
  { path: '/contact', label: 'Contact', icon: Mail },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const handleSecretClick = useSecretClick(5, 500)

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/40 bg-background/60 px-4 backdrop-blur-md md:hidden">
      <Link to="/" className="flex items-center gap-2">
        <span className="relative">
          <Avatar className="size-8 border border-border/60" onClick={handleSecretClick}>
            <AvatarImage src={avatarImage} alt={portfolioContent.profile.fullName} />
            <AvatarFallback>NM</AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 flex size-2.5" aria-label="Available for work">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-green-500 ring-2 ring-background" />
          </span>
        </span>
        <span className="text-sm font-bold tracking-tight">
          {portfolioContent.profile.fullName}
        </span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="size-9" />
          }
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] border-r border-border/40 bg-background/95 p-0 backdrop-blur-xl">
          <SheetHeader className="p-6 pb-2 text-left">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex items-center gap-3">
              <Avatar className="size-12 border border-border/60" onClick={handleSecretClick}>
                <AvatarImage src={avatarImage} alt={portfolioContent.profile.fullName} />
                <AvatarFallback>NM</AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h2 className="flex items-center gap-1 text-base font-bold tracking-tight">
                  {portfolioContent.profile.fullName}
                  <BadgeCheck aria-label="Verified" className="size-4 fill-sky-500 text-white" />
                </h2>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {portfolioContent.profile.headline}
                </p>
                <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-foreground">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-green-500" />
                  </span>
                  Available for work
                </span>
              </div>
            </div>
          </SheetHeader>

          <div className="flex flex-col gap-6 p-6">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground [&.active]:bg-muted [&.active]:text-foreground"
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="space-y-4 pt-4">
              <div className="px-4 space-y-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">Connect</p>
                <a
                  href={`mailto:${portfolioContent.profile.email}`}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Mail className="size-4" />
                  Email Me
                </a>
                <a
                  href={resumePDF}
                  download="NEILVEN_MASCARINAS.pdf"
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Download className="size-4" />
                  Download CV
                </a>
                <a
                  href="https://github.com/s0shiro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <GithubIcon className="size-4" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/neilven-mascari%C3%B1as-0809452a8/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <LinkedinIcon className="size-4" />
                  LinkedIn
                </a>
              </div>
              
              <div className="flex items-center justify-between px-4">
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 w-full px-10 text-center">
             <p className="text-[10px] text-muted-foreground/50">
               © {new Date().getFullYear()} {portfolioContent.profile.fullName}
             </p>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
