import { ArrowRight, ArrowUpRight, RefreshCw } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import {
  AnimatedHeading,
  Reveal,
  SectionLabel,
} from '@/components/shared/portfolio-motion'
import { usePublicProjects } from '../hooks/use-public-projects'
import { projectPathId } from '../project-catalog'

export function ProjectIndex({ preview = false }: { preview?: boolean }) {
  const ProjectTitle = preview ? 'h3' : 'h2'
  const { data, isPending, isError, refetch } = usePublicProjects()
  const projects = data.projects

  if (isPending)
    return (
      <div
        className="project-loading"
        role="status"
        aria-label="Loading projects"
      >
        {[0, 1].map((index) => (
          <div key={index} className="project-skeleton">
            <div />
            <div />
            <div />
          </div>
        ))}
        <span className="sr-only">Loading projects…</span>
      </div>
    )

  if (isError || projects.length === 0)
    return (
      <Reveal className="work-empty">
        <span className="work-empty-symbol" aria-hidden="true">
          &#123; &#125;
        </span>
        <div>
          <ProjectTitle>
            {isError
              ? 'The work index is taking a moment.'
              : 'Good things are in the works.'}
          </ProjectTitle>
          <p>
            {isError
              ? 'You can explore my repositories while the project collection reconnects.'
              : 'I’m putting together the project collection. In the meantime, see what I’m building on GitHub.'}
          </p>
        </div>
        <div className="work-empty-actions">
          {isError && (
            <button
              type="button"
              className="text-link"
              onClick={() => void refetch()}
            >
              Try again <RefreshCw size={14} aria-hidden="true" />
            </button>
          )}
          <a
            href="https://github.com/s0shiro"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Explore GitHub <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    )

  return (
    <div className="project-index">
      {(preview ? projects.slice(0, 3) : projects).map((project, index) => {
        return (
          <Reveal key={project.id} className="project-record">
            <Link
              to="/projects/$projectId"
              params={{ projectId: projectPathId(project) }}
              className={`project-record-inner ${project.imageUrl ? 'has-cover' : ''}`}
            >
              <div className="project-record-copy">
                <span className="project-number">
                  PROJECT / {String(index + 1).padStart(2, '0')}
                </span>
                <ProjectTitle>
                  {project.title}
                  <ArrowRight size={28} strokeWidth={1.3} aria-hidden="true" />
                </ProjectTitle>
                <p>{project.description}</p>
                {project.tags.length > 0 && (
                  <ul className="project-technologies">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}
                <span className="project-visit">
                  {project.caseStudy
                    ? 'Read case study'
                    : 'View project details'}{' '}
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </div>
              {project.imageUrl && (
                <div className="project-cover">
                  <img
                    src={project.imageUrl}
                    alt={`${project.title} interface preview`}
                    loading="lazy"
                    width={800}
                    height={500}
                  />
                </div>
              )}
            </Link>
          </Reveal>
        )
      })}
    </div>
  )
}

export function ProjectsGrid() {
  return (
    <div className="inner-page work-page">
      <header className="inner-page-header">
        <SectionLabel index="01" label="The work" />
        <AnimatedHeading text={'BUILT WITH\nPURPOSE.'} />
        <Reveal className="inner-page-intro">
          <p>
            Useful products, from the interface to the infrastructure. A
            collection of things I’ve designed, developed, and learned from.
          </p>
          <span className="eyebrow">
            Selected projects / Full-stack development
          </span>
        </Reveal>
      </header>
      <ProjectIndex />
      <Reveal className="work-colophon">
        <span className="eyebrow">The next good thing could be ours.</span>
        <Link to="/contact" className="text-link">
          Have a project in mind? <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </Reveal>
    </div>
  )
}
