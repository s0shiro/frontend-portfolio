import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotionPreference } from '@/lib/motion-preference'
import reactIcon from '@/assets/icons/react.svg'
import typescriptIcon from '@/assets/icons/typescript.svg'
import vueIcon from '@/assets/icons/vuejs.svg'
import laravelIcon from '@/assets/icons/laravel.svg'
import postgresqlIcon from '@/assets/icons/postgresql.svg'
import gitIcon from '@/assets/icons/git.svg'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const TAU = Math.PI * 2
const orbits = [
  {
    id: 'one',
    radius: 220,
    depth: 90,
    tilt: -28,
    phase: 0.3,
    duration: 34,
    technologies: [
      { name: 'React', icon: reactIcon },
      { name: 'Laravel', icon: laravelIcon },
    ],
  },
  {
    id: 'two',
    radius: 220,
    depth: 90,
    tilt: 35,
    phase: 2.7,
    duration: 42,
    technologies: [
      { name: 'TypeScript', icon: typescriptIcon },
      { name: 'PostgreSQL', icon: postgresqlIcon },
    ],
  },
  {
    id: 'three',
    radius: 205,
    depth: 120,
    tilt: 93,
    phase: 5,
    duration: 50,
    technologies: [
      { name: 'Vue.js', icon: vueIcon },
      { name: 'Git', icon: gitIcon },
    ],
  },
] as const

function markerPosition(
  orbit: (typeof orbits)[number],
  phase: number,
  rotation = 0,
) {
  const angle = ((orbit.tilt + rotation) / 180) * Math.PI
  const localX = orbit.radius * Math.cos(phase)
  const localY = orbit.depth * Math.sin(phase)
  const x = 300 + localX * Math.cos(angle) - localY * Math.sin(angle)
  const y = 300 + localX * Math.sin(angle) + localY * Math.cos(angle)
  return `translate(${x.toFixed(3)} ${y.toFixed(3)})`
}

const technologyNames = orbits
  .flatMap((orbit) => orbit.technologies.map((technology) => technology.name))
  .join(', ')

const dialTicks = Array.from({ length: 48 }, (_, index) => {
  const angle = (index / 48) * TAU
  const innerRadius = index % 4 === 0 ? 242 : 247
  return {
    x1: 300 + innerRadius * Math.cos(angle),
    y1: 300 + innerRadius * Math.sin(angle),
    x2: 300 + 252 * Math.cos(angle),
    y2: 300 + 252 * Math.sin(angle),
  }
})

export function MotionSculpture() {
  const root = useRef<HTMLDivElement>(null)
  const { enabled } = useMotionPreference()

  useGSAP(
    () => {
      if (!enabled || !root.current) return
      gsap.from('.sculpture-svg', {
        opacity: 0,
        duration: 1.1,
        delay: 0.15,
        ease: 'power2.out',
      })
      const sculpture =
        root.current.querySelector<SVGGElement>('.sculpture-object')
      if (!sculpture) return
      const movingOrbits = orbits.map((orbit) => ({
        orbit,
        angle: orbit.phase as number,
        markers: orbit.technologies.map((technology) =>
          root.current?.querySelector<SVGGElement>(
            `[data-technology="${technology.name}"]`,
          ),
        ),
      }))
      const updateMarkers = () => {
        const rotation = Number(gsap.getProperty(sculpture, 'rotation'))
        movingOrbits.forEach(({ orbit, angle, markers }) => {
          markers.forEach((marker, index) => {
            marker?.setAttribute(
              'transform',
              markerPosition(orbit, angle + index * Math.PI, rotation),
            )
          })
        })
      }
      // Markers live outside the rotating group so their logos stay upright.
      const orbitMotion = gsap.timeline({ onUpdate: updateMarkers })
      orbitMotion.to(sculpture, {
        rotation: 360,
        duration: 120,
        ease: 'none',
        repeat: -1,
        svgOrigin: '300 300',
      })
      movingOrbits.forEach((movingOrbit, index) => {
        const { orbit } = movingOrbit
        orbitMotion.to(
          movingOrbit,
          {
            angle: orbit.phase + TAU * (index % 2 === 0 ? 1 : -1),
            duration: orbit.duration,
            repeat: -1,
            ease: 'none',
          },
          0,
        )
      })
      const updatePlayback = () => {
        if (
          document.hidden ||
          !root.current ||
          !ScrollTrigger.isInViewport(root.current)
        )
          orbitMotion.pause()
        else orbitMotion.resume()
      }
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: updatePlayback,
      })
      updatePlayback()
      const media = gsap.matchMedia()
      media.add('(hover: hover) and (pointer: fine)', () => {
        const canvas =
          root.current?.querySelector<HTMLElement>('.sculpture-canvas')
        const layer = root.current?.querySelector<HTMLElement>(
          '.sculpture-reactive',
        )
        if (!canvas || !layer) return
        const tiltX = gsap.quickTo(layer, 'rotationX', {
          duration: 0.65,
          ease: 'power3.out',
        })
        const tiltY = gsap.quickTo(layer, 'rotationY', {
          duration: 0.65,
          ease: 'power3.out',
        })
        const move = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse') return
          const bounds = canvas.getBoundingClientRect()
          const x = gsap.utils.clamp(
            -1,
            1,
            ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
          )
          const y = gsap.utils.clamp(
            -1,
            1,
            ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
          )
          tiltX(-y * 8)
          tiltY(x * 10)
        }
        const reset = () => {
          tiltX(0)
          tiltY(0)
        }
        canvas.addEventListener('pointermove', move, { passive: true })
        canvas.addEventListener('pointerleave', reset)
        return () => {
          canvas.removeEventListener('pointermove', move)
          canvas.removeEventListener('pointerleave', reset)
        }
      })
      document.addEventListener('visibilitychange', updatePlayback)
      return () => {
        document.removeEventListener('visibilitychange', updatePlayback)
        media.revert()
        movingOrbits.forEach(({ orbit, markers }) => {
          markers.forEach((marker, index) => {
            marker?.setAttribute(
              'transform',
              markerPosition(orbit, orbit.phase + index * Math.PI),
            )
          })
        })
      }
    },
    { scope: root, dependencies: [enabled], revertOnUpdate: true },
  )

  return (
    <div
      ref={root}
      className="motion-sculpture"
      role="img"
      aria-label={`${technologyNames} orbiting Neilven's asterisk mark`}
    >
      <div className="sculpture-meta">
        <span>FIG. 001</span>
        <span>IDEAS IN ORBIT</span>
        <span>↗</span>
      </div>
      <div className="sculpture-canvas">
        <span className="sculpture-cross cross-top">+</span>
        <span className="sculpture-cross cross-bottom">+</span>
        <div className="sculpture-reactive">
          <svg
            viewBox="0 0 600 600"
            fill="none"
            className="sculpture-svg orbital-svg"
            focusable="false"
            aria-hidden="true"
          >
            <g className="orbital-dial" stroke="currentColor">
              {dialTicks.map((tick, index) => (
                <line key={index} {...tick} />
              ))}
              <path d="M300 62v20M300 518v20M62 300h20M518 300h20" />
            </g>
            <g className="sculpture-object">
              {orbits.map((orbit) => (
                <g
                  key={orbit.id}
                  className="orbital-plane"
                  transform={`rotate(${orbit.tilt} 300 300)`}
                >
                  <ellipse
                    cx="300"
                    cy="300"
                    rx={orbit.radius}
                    ry={orbit.depth}
                    className="orbital-track"
                  />
                  <ellipse
                    cx="300"
                    cy="300"
                    rx={orbit.radius - 5}
                    ry={orbit.depth - 3}
                    className="orbital-track orbital-track-secondary"
                  />
                </g>
              ))}
            </g>
            {orbits.flatMap((orbit) =>
              orbit.technologies.map((technology, index) => (
                <g
                  key={technology.name}
                  data-orbit={orbit.id}
                  data-technology={technology.name}
                  transform={markerPosition(
                    orbit,
                    orbit.phase + index * Math.PI,
                  )}
                  className="orbital-marker"
                >
                  <title>{technology.name}</title>
                  <circle r="19" className="orbital-marker-outline" />
                  <image
                    href={technology.icon}
                    x="-12"
                    y="-12"
                    width="24"
                    height="24"
                    preserveAspectRatio="xMidYMid meet"
                  />
                </g>
              )),
            )}
            <g className="orbital-core">
              <circle cx="300" cy="300" r="52" className="orbital-core-guide" />
              <circle cx="300" cy="300" r="37" className="orbital-core-disc" />
              <path
                d="M300 279v42M279 300h42M285 285l30 30M285 315l30-30"
                stroke="currentColor"
                strokeWidth="4.5"
              />
            </g>
          </svg>
        </div>
        <div className="sculpture-axis">
          <span>X</span>
          <span>Y</span>
          <span>Z</span>
        </div>
      </div>
      <div className="sculpture-caption">
        <span>EXPERIMENT. ITERATE. EVOLVE.</span>
        <span>[ ∞ ]</span>
      </div>
    </div>
  )
}
