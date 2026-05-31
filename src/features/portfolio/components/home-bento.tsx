import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Code2, Download, Mail } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { buttonVariants } from '@/components/ui/button-variants'
import { Marquee } from '@/components/ui/marquee'
import heroImage from '@/assets/images/hero.png'
import resumePDF from '@/assets/files/NEILVEN_MASCARINAS.pdf'
import { portfolioContent } from '@/features/portfolio/content'
import { cn } from '@/lib/utils'
import authIcon from '@/assets/icons/authentication.svg'
import cssIcon from '@/assets/icons/css.svg'
import drizzleIcon from '@/assets/icons/drizzle-orm.svg'
import expressIcon from '@/assets/icons/express.svg'
import gitIcon from '@/assets/icons/git.svg'
import githubIcon from '@/assets/icons/github.svg'
import htmlIcon from '@/assets/icons/html.svg'
import javascriptIcon from '@/assets/icons/javascript.svg'
import laravelIcon from '@/assets/icons/laravel.svg'
import mysqlIcon from '@/assets/icons/mysql.svg'
import nextIcon from '@/assets/icons/next.png'
import nodeIcon from '@/assets/icons/nodejs.svg'
import postgresqlIcon from '@/assets/icons/postgresql.svg'
import reactIcon from '@/assets/icons/react.svg'
import resendIcon from '@/assets/icons/resend.svg'
import supabaseIcon from '@/assets/icons/supabase.svg'
import tailwindIcon from '@/assets/icons/tailwind-css.svg'
import tanstackIcon from '@/assets/icons/React-Query.svg'
import typescriptIcon from '@/assets/icons/typescript.svg'
import vueIcon from '@/assets/icons/vuejs.svg'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
}

const headingVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const wordVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

function WashWord({ text, colorClass, delay }: { text: string; colorClass: string; delay: number }) {
  return (
    <span className="relative inline-block font-semibold">
      <span className="text-foreground/90">{text}</span>
      <motion.span
        aria-hidden
        className={cn('absolute inset-0', colorClass)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      >
        {text}
      </motion.span>
    </span>
  )
}

const skillStyles: Record<string, string> = {
  'JavaScript': 'from-yellow-400/20 to-yellow-600/30 text-yellow-600 dark:text-yellow-500 border-yellow-500/20',
  'TypeScript': 'from-blue-500/20 to-blue-700/30 text-blue-600 dark:text-blue-500 border-blue-500/20',
  'React': 'from-cyan-400/20 to-cyan-600/30 text-cyan-600 dark:text-cyan-500 border-cyan-500/20',
  'Next.js': 'from-zinc-400/20 to-zinc-600/30 text-zinc-900 dark:text-zinc-100 border-zinc-500/20',
  'Vue.js': 'from-emerald-400/20 to-emerald-600/30 text-emerald-600 dark:text-emerald-500 border-emerald-500/20',
  'HTML5': 'from-orange-500/20 to-orange-700/30 text-orange-600 dark:text-orange-500 border-orange-500/20',
  'CSS3': 'from-blue-600/20 to-blue-800/30 text-blue-600 dark:text-blue-500 border-blue-500/20',
  'Tailwind CSS': 'from-sky-400/20 to-sky-600/30 text-sky-600 dark:text-sky-500 border-sky-500/20',
  'Node.js': 'from-green-500/20 to-green-700/30 text-green-600 dark:text-green-500 border-green-500/20',
  'Express.js': 'from-zinc-400/20 to-zinc-600/30 text-zinc-900 dark:text-zinc-100 border-zinc-500/20',
  'Laravel': 'from-red-500/20 to-red-700/30 text-red-600 dark:text-red-500 border-red-500/20',
  'PostgreSQL': 'from-blue-500/20 to-blue-800/30 text-blue-700 dark:text-blue-600 border-blue-500/20',
  'MySQL': 'from-sky-500/20 to-orange-500/30 text-sky-700 dark:text-sky-600 border-sky-500/20',
  'Supabase': 'from-emerald-500/20 to-emerald-700/30 text-emerald-600 dark:text-emerald-500 border-emerald-500/20',
  'Git': 'from-orange-500/20 to-orange-700/30 text-orange-600 dark:text-orange-500 border-orange-500/20',
  'GitHub': 'from-zinc-500/20 to-zinc-800/30 text-zinc-900 dark:text-zinc-100 border-zinc-500/20',
  'Drizzle ORM': 'from-lime-400/20 to-lime-600/30 text-lime-700 dark:text-lime-600 border-lime-500/20',
  'Authentication': 'from-purple-400/20 to-purple-600/30 text-purple-600 dark:text-purple-500 border-purple-500/20',
  'Resend': 'from-rose-400/20 to-rose-600/30 text-rose-600 dark:text-rose-500 border-rose-500/20',
  'TanStack Query': 'from-red-500/20 to-yellow-500/30 text-red-600 dark:text-red-500 border-red-500/20',
}

const skillIcons: Record<string, string> = {
  'JavaScript': javascriptIcon,
  'TypeScript': typescriptIcon,
  'React': reactIcon,
  'Next.js': nextIcon,
  'Vue.js': vueIcon,
  'HTML5': htmlIcon,
  'CSS3': cssIcon,
  'Tailwind CSS': tailwindIcon,
  'Node.js': nodeIcon,
  'Express.js': expressIcon,
  'Laravel': laravelIcon,
  'PostgreSQL': postgresqlIcon,
  'MySQL': mysqlIcon,
  'Supabase': supabaseIcon,
  'Git': gitIcon,
  'GitHub': githubIcon,
  'Drizzle ORM': drizzleIcon,
  'Authentication': authIcon,
  'Resend': resendIcon,
  'TanStack Query': tanstackIcon,
}

export function HomeBento() {
  const headingWords = `Hi, I'm ${portfolioContent.profile.fullName}`.split(' ')
  const allSkills = portfolioContent.skillGroups.flatMap((group) => group.items)

  // Filter out skills that do not have corresponding icons
  const filteredSkills = allSkills.filter((skill) => skillIcons[skill])
  const half = Math.ceil(filteredSkills.length / 2)
  const firstRow = filteredSkills.slice(0, half)
  const secondRow = filteredSkills.slice(half)

  return (
    <motion.section
      className="mx-auto w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="space-y-8">
        <div className="mx-auto grid max-w-6xl items-center gap-8 overflow-hidden lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-7 p-6 sm:p-10">
              <div className="flex items-center gap-4 lg:hidden">
                <img
                  src={heroImage}
                  alt={portfolioContent.profile.fullName}
                  className="size-16 rounded-2xl border border-border/60 object-cover object-top shadow-sm"
                />
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Portfolio
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    Full-stack developer
                  </p>
                </div>
              </div>

              {/* Header Section */}
              <div className="space-y-6">
                <motion.h1
                  className="max-w-md text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                  variants={headingVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {headingWords.map((word, i) => (
                    <motion.span
                      key={`${word}-${i}`}
                      variants={wordVariants}
                      className="me-[0.25em] inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h1>
              </div>

              {/* Tagline */}
              <blockquote className="max-w-md text-lg font-medium leading-relaxed text-foreground/90 sm:text-xl">
                Real{' '}
                <WashWord text="problems." colorClass="text-violet-500 dark:text-violet-400" delay={0.7} />{' '}
                Maintainable{' '}
                <WashWord text="solutions." colorClass="text-violet-600 dark:text-violet-300" delay={0.95} />{' '}
                <WashWord text="Shipped." colorClass="text-violet-700 dark:text-violet-200" delay={1.2} />
              </blockquote>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/projects"
                  className={cn(buttonVariants({ size: 'lg' }), 'h-11 rounded-2xl px-5')}
                >
                  View Projects
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/contact"
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-11 rounded-2xl px-5')}
                >
                  Contact Me
                  <Mail className="size-4" />
                </Link>
                <a
                  href={resumePDF}
                  download="NEILVEN_MASCARINAS.pdf"
                  className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'h-11 rounded-2xl px-5')}
                >
                  Download CV
                  <Download className="size-4" />
                </a>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative hidden min-h-[30rem] self-stretch lg:block">
              {/* Single soft glow centered behind the figure */}
              <div className="pointer-events-none absolute bottom-0 left-1/2 h-3/4 w-3/4 -translate-x-1/2 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-500/15" />

              {/* Character */}
              <img
                src={heroImage}
                alt={portfolioContent.profile.fullName}
                className="absolute bottom-0 left-1/2 h-[94%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
              />
            </div>
          </div>
      </motion.div>

      {/* Skills Section */}
      <motion.div variants={itemVariants} className="mt-8 space-y-10">
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
            <Code2 className="size-6" /> Skills
          </h2>
          <p className="text-muted-foreground">My professional skills.</p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-4 rounded-lg">
          <TooltipProvider>
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((skill) => (
              <Tooltip key={skill}>
                <TooltipTrigger>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "group flex size-14 sm:size-16 items-center justify-center rounded-full border bg-gradient-to-br shadow-sm transition-all cursor-default mx-2",
                      skillStyles[skill] || "from-muted/50 to-muted text-foreground border-border/40"
                    )}
                  >
                    <img
                      src={skillIcons[skill]}
                      alt={skill}
                      className="h-8 w-8 sm:h-10 sm:w-10"
                    />
                    <span className="sr-only">{skill}</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-background text-foreground border-border shadow-lg rounded-md p-2 text-sm">{skill}</TooltipContent>
              </Tooltip>
            ))}
          </Marquee>

          <Marquee pauseOnHover reverse className="[--duration:20s] mt-4">
            {secondRow.map((skill) => (
              <Tooltip key={skill}>
                <TooltipTrigger>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "group flex size-14 sm:size-16 items-center justify-center rounded-full border bg-gradient-to-br shadow-sm transition-all cursor-default mx-2",
                      skillStyles[skill] || "from-muted/50 to-muted text-foreground border-border/40"
                    )}
                  >
                    <img
                      src={skillIcons[skill]}
                      alt={skill}
                      className="h-8 w-8 sm:h-10 sm:w-10"
                    />
                    <span className="sr-only">{skill}</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-background text-foreground border-border shadow-lg rounded-md p-2 text-sm">{skill}</TooltipContent>
              </Tooltip>
            ))}
          </Marquee>
          </TooltipProvider>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background dark:from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background dark:from-background"></div>
        </div>
      </motion.div>
    </motion.section>
  )
}
