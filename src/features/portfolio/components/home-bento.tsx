import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import heroImage from '@/assets/images/hero.png'
import resumePDF from '@/assets/files/NEILVEN_MASCARINAS.pdf'
import { portfolioContent } from '@/features/portfolio/content'
import { cn } from '@/lib/utils'

const rise = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}

export function HomeBento() {
  const { profile, skillGroups } = portfolioContent
  const [firstName, ...restName] = profile.fullName.split(' ')

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-16">
      <section className="grid items-end gap-10 lg:grid-cols-[1fr_18rem]">
        <div>
          <motion.h1 variants={rise} className="display-xl text-foreground">
            <span className="block text-muted-foreground">Hi, I&apos;m</span>
            <span className="block">{firstName}</span>
            <span className="block">{restName.join(' ')}</span>
          </motion.h1>

          <motion.p
            variants={rise}
            className="max-w-lg pt-8 text-lg leading-relaxed text-foreground/90"
          >
            Real problems. Maintainable solutions.{' '}
            <span className="text-violet-600 dark:text-violet-400">Shipped.</span>
          </motion.p>

          <motion.nav variants={rise} className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-8">
            <Link
              to="/projects"
              className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-foreground"
            >
              <span className="border-b border-foreground pb-0.5">View projects</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
            <a
              href={resumePDF}
              download="NEILVEN_MASCARINAS.pdf"
              className="group flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Download CV
              <ArrowUpRight className="size-3.5" />
            </a>
          </motion.nav>
        </div>

        <motion.div variants={rise} className="relative hidden lg:block">
          <div
            className="pointer-events-none absolute bottom-0 left-1/2 h-2/3 w-full -translate-x-1/2 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-500/10"
            aria-hidden
          />
          <img
            src={heroImage}
            alt=""
            aria-hidden
            className="relative ml-auto max-h-[26rem] w-full object-contain object-bottom"
          />
        </motion.div>
      </section>

      <motion.section variants={rise}>
        <div className="flex items-baseline gap-4 pb-6">
          <span className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground">01</span>
          <span className="eyebrow">Stack</span>
          <span className="h-px flex-1 bg-border/70" />
        </div>

        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.category} className="border-t border-border/60 pt-4">
              <h2 className="pb-3 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-foreground">
                {group.category}
              </h2>
              <ul className="space-y-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className={cn(
                      'font-mono text-sm text-muted-foreground',
                      "before:mr-2 before:text-border before:content-['/']",
                    )}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}
