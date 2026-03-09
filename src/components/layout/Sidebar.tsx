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

import avatarImage from '@/assets/images/me.jpg'
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
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={handleSecretClick}
          className="cursor-pointer"
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
        </motion.div>

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
          <p className="text-sm leading-6 text-muted-foreground">
            {portfolioContent.profile.headline}
          </p>
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
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
              className="flex items-center gap-4 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-border/50 hover:bg-muted/50 hover:text-foreground [&.active]:border-border/60 [&.active]:bg-background/80 [&.active]:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
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