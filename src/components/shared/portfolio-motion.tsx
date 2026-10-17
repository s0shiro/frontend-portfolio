import { useRef, type FocusEvent, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { cn } from '@/lib/utils'
import { useMotionPreference } from '@/lib/motion-preference'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const root = useRef<HTMLDivElement>(null)
  const { enabled } = useMotionPreference()
  const { contextSafe } = useGSAP(
    () => {
      if (!enabled) return
      gsap.from(root.current, {
        opacity: 0,
        y: 16,
        duration: 0.35,
        delay,
        ease: 'power2.out',
        scrollTrigger: { trigger: root.current, start: 'top 97%', once: true },
      })
    },
    { scope: root, dependencies: [enabled, delay], revertOnUpdate: true },
  )

  const showOnFocus = contextSafe((event: FocusEvent<HTMLDivElement>) => {
    gsap.killTweensOf(event.currentTarget)
    gsap.set(event.currentTarget, { opacity: 1, y: 0 })
  })

  return (
    <div ref={root} className={className} onFocusCapture={showOnFocus}>
      {children}
    </div>
  )
}

export function AnimatedHeading({
  text,
  className,
  mutedFirstLine = false,
}: {
  text: string
  className?: string
  mutedFirstLine?: boolean
}) {
  const root = useRef<HTMLHeadingElement>(null)
  const { enabled } = useMotionPreference()
  useGSAP(
    () => {
      if (!enabled) return
      gsap.from('[data-heading-word]', {
        y: 18,
        opacity: 0,
        duration: 0.35,
        stagger: 0.05,
        ease: 'power2.out',
      })
    },
    { scope: root, dependencies: [enabled, text], revertOnUpdate: true },
  )

  return (
    <h1
      ref={root}
      aria-label={text.replace(/\n/g, ' ')}
      className={cn('display-xl', className)}
    >
      {text.split('\n').map((line, lineIndex) => (
        <span
          key={lineIndex}
          aria-hidden="true"
          className={cn(
            'block',
            mutedFirstLine && lineIndex === 0 && 'text-muted-foreground',
          )}
        >
          {line.split(' ').map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block">
              <span data-heading-word className="inline-block">
                {word}
              </span>
              {wordIndex < line.split(' ').length - 1 ? '\u00a0' : null}
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}

export function SectionLabel({
  index,
  label,
}: {
  index: string
  label: string
}) {
  return (
    <div className="section-label">
      <span className="font-mono tabular-nums">{index} /</span>
      <span>{label}</span>
      <span aria-hidden="true" className="section-label-rule" />
    </div>
  )
}
