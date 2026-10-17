import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

import { useMotionPreference } from '@/lib/motion-preference'

gsap.registerPlugin(useGSAP)

const textControls =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"]), iframe'
const interactiveControls =
  'a[href], button:enabled, summary, [role="button"]:not([aria-disabled="true"])'

export function CursorRing() {
  const root = useRef<HTMLDivElement>(null)
  const { enabled } = useMotionPreference()

  useGSAP(
    () => {
      if (!enabled || !root.current) return

      const ring = root.current
      const media = gsap.matchMedia()
      media.add(
        '(hover: hover) and (pointer: fine) and (forced-colors: none)',
        () => {
          gsap.set(ring, { xPercent: -50, yPercent: -50 })
          const xTo = gsap.quickTo(ring, 'x', {
            duration: 0.18,
            ease: 'power3.out',
          })
          const yTo = gsap.quickTo(ring, 'y', {
            duration: 0.18,
            ease: 'power3.out',
          })
          let visible = false

          const hide = () => {
            visible = false
            ring.dataset.visible = 'false'
            ring.dataset.interactive = 'false'
            xTo.tween.pause()
            yTo.tween.pause()
          }
          const move = (event: PointerEvent) => {
            const target = event.target
            if (
              event.pointerType !== 'mouse' ||
              !(target instanceof Element) ||
              target.closest(textControls) ||
              document.hidden
            ) {
              hide()
              return
            }

            // Snap on entry so the ring never flies in from a previous position.
            xTo(event.clientX, visible ? undefined : event.clientX)
            yTo(event.clientY, visible ? undefined : event.clientY)
            ring.dataset.interactive = String(
              Boolean(target.closest(interactiveControls)),
            )
            ring.dataset.visible = 'true'
            visible = true
          }
          const onVisibility = () => {
            if (document.hidden) hide()
          }

          document.addEventListener('pointermove', move, { passive: true })
          document.documentElement.addEventListener('pointerleave', hide)
          document.addEventListener('pointercancel', hide)
          document.addEventListener('keydown', hide)
          document.addEventListener('visibilitychange', onVisibility)
          window.addEventListener('blur', hide)

          return () => {
            hide()
            document.removeEventListener('pointermove', move)
            document.documentElement.removeEventListener('pointerleave', hide)
            document.removeEventListener('pointercancel', hide)
            document.removeEventListener('keydown', hide)
            document.removeEventListener('visibilitychange', onVisibility)
            window.removeEventListener('blur', hide)
          }
        },
      )

      return () => media.revert()
    },
    { scope: root, dependencies: [enabled], revertOnUpdate: true },
  )

  return (
    <div
      ref={root}
      className="cursor-ring"
      data-visible="false"
      data-interactive="false"
      aria-hidden="true"
    >
      <span className="cursor-ring-outline" />
    </div>
  )
}
