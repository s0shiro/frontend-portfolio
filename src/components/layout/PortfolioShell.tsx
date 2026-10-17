import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  ArrowDown,
  ArrowUpRight,
  Menu,
  Moon,
  Pause,
  Play,
  Sun,
  X,
} from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import resumePDF from '@/assets/files/NEILVEN_MASCARINAS.pdf'
import { portfolioContent } from '@/features/portfolio/content'
import { useTheme } from '@/features/theme/use-theme'
import { useMotionPreference } from '@/lib/motion-preference'
import { useSecretClick } from '@/features/admin/hooks/use-secret-click'
import { Reveal } from '@/components/shared/portfolio-motion'
import { CursorRing } from '@/components/shared/cursor-ring'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const links = [
  { to: '/projects', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

function Asterisk({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M24 2v44M2 24h44M8.4 8.4l31.2 31.2M8.4 39.6 39.6 8.4"
        stroke="currentColor"
        strokeWidth="6"
      />
    </svg>
  )
}

export function PortfolioShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const navigation = useRef<HTMLElement>(null)
  const previousPathname = useRef(pathname)
  const main = useRef<HTMLElement>(null)
  const progress = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()
  const { enabled, reducedMotion, toggleMotion } = useMotionPreference()
  const handleSecretClick = useSecretClick(5, 500)
  const { profile } = portfolioContent

  useEffect(() => {
    if (!menuOpen) return
    navigation.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  useEffect(() => {
    if (previousPathname.current === pathname) return
    previousPathname.current = pathname
    main.current?.focus({ preventScroll: true })
  }, [pathname])

  useGSAP(
    () => {
      if (!enabled) return
      gsap.fromTo(
        progress.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: true },
        },
      )
      let frame = 0
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => ScrollTrigger.refresh())
      })
      if (main.current) observer.observe(main.current)
      return () => {
        observer.disconnect()
        cancelAnimationFrame(frame)
      }
    },
    { dependencies: [enabled, pathname], revertOnUpdate: true },
  )

  return (
    <div className="portfolio-shell" data-motion={enabled ? 'on' : 'off'}>
      <CursorRing />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div ref={progress} className="reading-progress" aria-hidden="true" />
      <header
        className="site-header page-gutter"
        onBlurCapture={(event) => {
          if (menuOpen && !event.currentTarget.contains(event.relatedTarget))
            setMenuOpen(false)
        }}
      >
        <Link
          to="/"
          aria-label="Neilven Mascariñas, home"
          className="wordmark"
          onClick={() => {
            setMenuOpen(false)
            handleSecretClick()
          }}
        >
          <Asterisk className="wordmark-symbol" />
          <span>
            NEILVEN<span className="wordmark-lastname"> MASCARIÑAS</span>
            <span className="wordmark-period">.</span>
          </span>
        </Link>

        <nav
          ref={navigation}
          id="main-navigation"
          aria-label="Main navigation"
          className="site-nav"
          data-open={menuOpen}
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to !== '/projects' }}
              className="nav-link"
              onClick={() => {
                setMenuOpen(false)
                if (menuOpen) main.current?.focus({ preventScroll: true })
              }}
            >
              {link.label}
              <span className="nav-dot" aria-hidden="true" />
            </Link>
          ))}
        </nav>

        <div className="header-controls">
          <button
            type="button"
            onClick={toggleMotion}
            disabled={reducedMotion}
            aria-pressed={enabled}
            aria-label={
              reducedMotion
                ? 'Motion off: disabled by your system preference'
                : enabled
                  ? 'Motion on: pause animations'
                  : 'Motion off: enable animations'
            }
            className="motion-toggle"
          >
            {enabled ? (
              <Pause size={12} aria-hidden="true" />
            ) : (
              <Play size={12} aria-hidden="true" />
            )}
            <span>Motion {enabled ? 'on' : 'off'}</span>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="icon-control"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <Sun size={17} aria-hidden="true" />
            ) : (
              <Moon size={17} aria-hidden="true" />
            )}
          </button>
          <button
            ref={menuButton}
            type="button"
            className="menu-control icon-control"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      <main
        ref={main}
        id="main-content"
        tabIndex={-1}
        className="page-gutter main-content"
        key={pathname}
      >
        {children}
      </main>

      <footer className="site-footer page-gutter">
        {pathname !== '/contact' && (
          <Reveal className="footer-invitation">
            <div className="footer-invitation-top">
              <span className="eyebrow">
                A good project starts with a conversation.
              </span>
              <Asterisk className="footer-asterisk" />
            </div>
            <Link to="/contact" className="footer-cta">
              <span>
                LET’S BUILD
                <br />
                SOMETHING GOOD.
              </span>
              <span className="footer-cta-arrow">
                <ArrowUpRight aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        )}
        <div className="footer-details">
          <div>
            <Link to="/" className="footer-name">
              {profile.fullName}
            </Link>
            <p>Thoughtful code. Useful things.</p>
          </div>
          <div className="footer-links">
            <a
              href="https://github.com/s0shiro"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/neilven-mascari%C3%B1as-0809452a8/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a href={resumePDF} download="NEILVEN_MASCARINAS.pdf">
              Résumé <ArrowDown size={13} aria-hidden="true" />
            </a>
          </div>
          <span className="footer-copyright">
            © {new Date().getFullYear()} / MADE WITH INTENTION
          </span>
        </div>
      </footer>
    </div>
  )
}
