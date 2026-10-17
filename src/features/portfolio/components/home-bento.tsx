import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Plus,
} from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import { portfolioContent } from '@/features/portfolio/content'
import resumePDF from '@/assets/files/NEILVEN_MASCARINAS.pdf'
import { Reveal, SectionLabel } from '@/components/shared/portfolio-motion'
import { useMotionPreference } from '@/lib/motion-preference'
import { MotionSculpture } from './motion-sculpture'
import { ProjectIndex } from './projects-grid'

gsap.registerPlugin(useGSAP)

const disciplines = [
  'THOUGHTFUL INTERFACES',
  'SOLID FOUNDATIONS',
  'REAL-WORLD SOLUTIONS',
]

export function HomeBento() {
  const root = useRef<HTMLDivElement>(null)
  const { profile, skillGroups } = portfolioContent
  const { enabled } = useMotionPreference()

  useGSAP(
    () => {
      if (!enabled) return
      gsap.from('.hero-word', {
        yPercent: 105,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power4.out',
        delay: 0.1,
      })
      gsap.from('.hero-enter', {
        opacity: 0,
        y: 14,
        duration: 0.35,
        stagger: 0.06,
        delay: 0.25,
      })
      const ticker = gsap.to('.discipline-track', {
        xPercent: -50,
        duration: 36,
        repeat: -1,
        ease: 'none',
      })
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !document.hidden) ticker.resume()
        else ticker.pause()
      })
      const track = root.current?.querySelector('.discipline-strip')
      if (track) observer.observe(track)
      const onVisibility = () => {
        if (document.hidden) ticker.pause()
        else if (
          track &&
          track.getBoundingClientRect().top < window.innerHeight &&
          track.getBoundingClientRect().bottom > 0
        )
          ticker.resume()
      }
      document.addEventListener('visibilitychange', onVisibility)
      return () => {
        observer.disconnect()
        document.removeEventListener('visibilitychange', onVisibility)
      }
    },
    { scope: root, dependencies: [enabled], revertOnUpdate: true },
  )

  return (
    <div ref={root}>
      <section className="home-hero" aria-labelledby="hero-heading">
        <div className="hero-topline hero-enter">
          <span className="eyebrow">
            Full-stack developer / Creative problem solver
          </span>
          <span className="availability">
            <span />
            Open to opportunities
          </span>
        </div>

        <div className="hero-composition">
          <div className="hero-type">
            <h1
              id="hero-heading"
              className="hero-heading"
              aria-label="Ideas. Code. Impact."
            >
              {['IDEAS.', 'CODE.', 'IMPACT.'].map((word, index) => (
                <span
                  key={word}
                  className={`hero-line hero-line-${index}`}
                  aria-hidden="true"
                >
                  <span className="hero-word">{word}</span>
                </span>
              ))}
            </h1>
            <div className="hero-description hero-enter">
              <ArrowDownRight
                className="hero-description-arrow"
                size={27}
                strokeWidth={1.3}
                aria-hidden="true"
              />
              <p>
                I’m <strong>Neilven Mascariñas.</strong> I turn complex problems
                into useful, considered digital experiences.
              </p>
            </div>
            <div className="hero-actions hero-enter">
              <a
                href="#selected-work"
                className="action-link action-link-primary"
              >
                Explore my work <ArrowDown size={16} aria-hidden="true" />
              </a>
              <Link to="/contact" className="text-link">
                Let’s talk <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <a
                href={resumePDF}
                download="NEILVEN_MASCARINAS.pdf"
                className="text-link hero-resume"
              >
                Download résumé <ArrowDown size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
          <MotionSculpture />
        </div>

        <div className="hero-bottomline hero-enter">
          <span>
            {profile.location}
            <span className="hero-location-code"> / PH</span>
          </span>
          <span className="hero-bottom-note">
            A little curiosity. A lot of possibility.
          </span>
          <a href="#selected-work">
            Scroll to discover <ArrowDown size={12} aria-hidden="true" />
          </a>
        </div>
      </section>

      <div
        className="discipline-strip"
        role="img"
        aria-label={disciplines.join('. ')}
      >
        <div className="discipline-track" aria-hidden="true">
          {[0, 1].map((copy) => (
            <div className="discipline-set" key={copy}>
              {disciplines.map((item) => (
                <span key={item}>
                  {item}
                  <Plus size={29} strokeWidth={1} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section id="selected-work" className="home-section">
        <SectionLabel index="01" label="Selected work" />
        <Reveal className="section-heading-row">
          <h2 className="section-display">
            LESS THEORY.
            <br />
            <span className="muted-display">MORE MAKING.</span>
          </h2>
          <div className="section-heading-aside">
            <p>
              Real workflows. Thoughtful interfaces.
              <br />A few things I’ve put into the world.
            </p>
            <Link to="/projects" className="text-link">
              All projects <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
        <ProjectIndex preview />
      </section>

      <section className="home-section home-about">
        <SectionLabel index="02" label="The person behind the pixels" />
        <div className="home-about-grid">
          <Reveal>
            <h2 className="section-display">
              CURIOUS MIND.
              <br />
              BUILDER AT
              <br />
              <span className="muted-display">HEART.</span>
            </h2>
            <Link to="/about" className="text-link about-link">
              A bit more about me <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
          <Reveal delay={0.08} className="home-about-copy">
            <p className="large-copy">
              Good software should feel simple. Even when what’s underneath
              isn’t.
            </p>
            <p>
              {profile.summary} From the first interface to the last API
              endpoint, I care about how the whole thing works together.
            </p>
            <p>
              I’m based in Marinduque, Philippines, and looking for a team where
              I can contribute, keep learning, and build things that matter.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="home-section capabilities-section">
        <SectionLabel index="03" label="Tools of the trade" />
        <div className="capabilities-grid">
          <Reveal>
            <h2 className="section-display">
              THE RIGHT
              <br />
              TOOLS. A<br />
              <span className="muted-display">CLEAR PURPOSE.</span>
            </h2>
            <p className="capabilities-intro">
              An evolving toolkit for the whole journey, from a rough idea to a
              working product.
            </p>
          </Reveal>
          <div className="skill-index">
            {skillGroups.map((group, index) => (
              <Reveal key={group.category} delay={index * 0.04}>
                <details className="skill-record" open={index === 0}>
                  <summary>
                    <span className="skill-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3>{group.category}</h3>
                    <Plus size={18} aria-hidden="true" />
                  </summary>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reveal className="home-endnote">
        <span>Always learning. Always building.</span>
        <ArrowRight size={20} strokeWidth={1.3} aria-hidden="true" />
      </Reveal>
    </div>
  )
}
