import { Link } from '@tanstack/react-router'
import {
  ArrowUpRight,
  Home,
  User,
  FolderOpen,
  Mail,
  BadgeCheck,
  Download,
} from 'lucide-react'
import { motion } from 'framer-motion'

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
import { useSecretClick } from '@/features/admin/hooks/use-secret-click'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About', icon: User },
  { path: '/projects', label: 'Projects', icon: FolderOpen },
  { path: '/contact', label: 'Contact', icon: Mail },
]

export function Sidebar() {
  const handleSecretClick = useSecretClick(5, 500)

  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 overflow-y-auto py-12 md:flex md:flex-col">
      <div className="mb-8 rounded-[2rem] border border-border/60 bg-background/70 p-6 text-center backdrop-blur-md">
        <motion.button
          type="button"
          aria-label="Profile avatar"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={handleSecretClick}
          className="cursor-pointer bg-transparent border-0 p-0"
        >
          <Avatar className="mx-auto size-24 border border-border/60">
            <AvatarImage
              src={avatarImage}
              alt={portfolioContent.profile.fullName}
            />
            <AvatarFallback className="bg-muted/40 text-2xl font-bold tracking-tight text-foreground">
              NM
            </AvatarFallback>
          </Avatar>
        </motion.button>

        <div className="mt-5 space-y-2">
          <h2 className="flex items-center justify-center gap-1.5 text-xl font-bold tracking-tight text-foreground">
            {portfolioContent.profile.fullName}
            <BadgeCheck
              aria-label="Verified"
              className="size-5 fill-sky-500 text-white"
            />
          </h2>
          <p className="text-sm font-medium text-blue-500/80">
            @{portfolioContent.profile.fullName.toLowerCase().replace(/\s+/g, '')}
          </p>
          <div className="flex justify-center pt-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-green-500" />
              </span>
              Available for work
            </span>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {portfolioContent.profile.headline}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <a
              href="https://github.com/s0shiro"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="flex size-8 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <GithubIcon className="size-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/neilven-mascari%C3%B1as-0809452a8/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="flex size-8 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LinkedinIcon className="size-4" />
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-3 text-left">
          <a
            className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            href={`mailto:${portfolioContent.profile.email}`}
          >
            <span className="flex items-center gap-3">
              <Mail className="size-4" />
              Email
            </span>
            <ArrowUpRight className="size-4" />
          </a>
          <motion.a
            className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            href={resumePDF}
            download="NEILVEN_MASCARINAS.pdf"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center gap-3">
              <Download className="size-4" />
              Download CV
            </span>
            <ArrowUpRight className="size-4 opacity-50" />
          </motion.a>
        </div>
      </div>

      <nav className="mt-4 flex flex-1 flex-col space-y-2">
        {navItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link
              to={item.path}
              className="relative flex items-center gap-4 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground [&.active]:text-foreground"
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  {isActive ? (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-2xl border border-border/60 bg-background/80"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  ) : null}
                  <item.icon className="relative z-10 size-4" />
                  <span className="relative z-10">{item.label}</span>
                </>
              )}
            </Link>
          </motion.div>
        ))}
      </nav>

      <motion.div
        className="mt-8 space-y-2 border-t border-border/40 pt-6 text-center text-[11px] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <ThemeToggle />
        <p>COPYRIGHT © {new Date().getFullYear()}</p>
        <p>{portfolioContent.profile.fullName}. All rights reserved.</p>
      </motion.div>
    </aside>
  )
}