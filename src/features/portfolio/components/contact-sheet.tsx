import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { ApiAccomplishment } from '../api/get-experiences'

/**
 * Accomplishment images presented as a photographic contact sheet: an indexed
 * strip of frames attached to a role, opening into a full lightbox. The index
 * numbers are meaningful — the order is set deliberately in the admin panel.
 */
export function ContactSheet({
  accomplishments,
  label,
}: {
  accomplishments: ApiAccomplishment[]
  label: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])

  const step = useCallback(
    (direction: -1 | 1) => {
      setOpenIndex((current) => {
        if (current === null) return current
        const next = current + direction
        if (next < 0) return accomplishments.length - 1
        if (next >= accomplishments.length) return 0
        return next
      })
    },
    [accomplishments.length],
  )

  useEffect(() => {
    if (openIndex === null) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') step(-1)
      if (event.key === 'ArrowRight') step(1)
    }

    document.addEventListener('keydown', onKeyDown)
    // Stop the page behind the lightbox from scrolling.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [openIndex, close, step])

  if (accomplishments.length === 0) return null

  const active = openIndex === null ? null : accomplishments[openIndex]

  return (
    <div className="pt-4">
      <div className="flex items-baseline gap-3 pb-2">
        <span className="eyebrow">Evidence</span>
        <span className="h-px flex-1 bg-border/60" />
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          {String(accomplishments.length).padStart(2, '0')}
        </span>
      </div>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {accomplishments.map((accomplishment, index) => (
          <li key={accomplishment.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group block w-full text-left"
              aria-label={
                accomplishment.caption
                  ? `View: ${accomplishment.caption}`
                  : `View ${label} image ${index + 1}`
              }
            >
              <div className="relative aspect-4/3 overflow-hidden border border-border/70 bg-muted/30">
                <img
                  src={accomplishment.imageUrl}
                  alt={accomplishment.caption ?? `${label} — image ${index + 1}`}
                  loading="lazy"
                  className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute left-0 top-0 bg-background/90 px-1.5 py-0.5 font-mono text-[0.625rem] tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              {accomplishment.caption ? (
                <p className="pt-1.5 font-mono text-[0.6875rem] leading-snug text-muted-foreground line-clamp-2">
                  {accomplishment.caption}
                </p>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {active ? (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            aria-label={active.caption ?? 'Accomplishment image'}
            onClick={close}
          >
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <span className="font-mono text-xs text-muted-foreground">
                {String((openIndex ?? 0) + 1).padStart(2, '0')} / {String(accomplishments.length).padStart(2, '0')}
                <span className="px-2 text-border">·</span>
                {label}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="flex size-8 items-center justify-center border border-border/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div
              className="flex min-h-0 flex-1 items-center justify-center gap-2 p-4 sm:gap-4 sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              {accomplishments.length > 1 ? (
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                  className="flex size-10 shrink-0 items-center justify-center border border-border/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ChevronLeft className="size-5" />
                </button>
              ) : null}

              <img
                key={active.id}
                src={active.imageUrl}
                alt={active.caption ?? 'Accomplishment'}
                className="max-h-full min-h-0 max-w-full object-contain"
              />

              {accomplishments.length > 1 ? (
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next image"
                  className="flex size-10 shrink-0 items-center justify-center border border-border/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ChevronRight className="size-5" />
                </button>
              ) : null}
            </div>

            {active.caption ? (
              <p
                className={cn(
                  'border-t border-border/60 px-4 py-3 text-center text-sm text-muted-foreground',
                )}
                onClick={(event) => event.stopPropagation()}
              >
                {active.caption}
              </p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
