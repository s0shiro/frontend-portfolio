import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { AnimatedHeading, Reveal } from '@/components/shared/portfolio-motion'
import { usePublicProjects } from '../hooks/use-public-projects'
import { projectPathId } from '../project-catalog'
import '../case-studies.css'

export function ProjectCaseStudyPage({ projectId }: { projectId: string }) {
  const { data, isFetching } = usePublicProjects()
  const project = data.projects.find(
    (item) => item.id === projectId || projectPathId(item) === projectId,
  )

  if (!project)
    return (
      <div className="inner-page project-missing">
        <span className="eyebrow">The work / Project notes</span>
        <h1 className="display-lg">
          {isFetching ? 'Finding this project…' : 'Project not found.'}
        </h1>
        <p>
          {isFetching
            ? 'Loading the latest project collection.'
            : 'This project isn’t in the published collection.'}
        </p>
        <Link to="/projects" className="text-link">
          <ArrowLeft size={16} aria-hidden="true" /> Back to work
        </Link>
      </div>
    )

  const study = project.caseStudy
  const cover = study?.gallery?.find((image) => image.src === project.imageUrl)
  const currentIndex = data.projects.indexOf(project)
  const next =
    data.projects.length > 1
      ? data.projects[(currentIndex + 1) % data.projects.length]
      : null
  const sections = study
    ? [
        { id: 'the-problem', label: 'The problem' },
        { id: 'my-contribution', label: 'My contribution' },
        { id: 'technical-decisions', label: 'Technical decisions' },
        { id: 'the-outcome', label: 'The outcome' },
      ]
    : [{ id: 'project-overview', label: 'Overview' }]

  return (
    <article className="inner-page case-study-page">
      <Link to="/projects" className="text-link case-back">
        <ArrowLeft size={15} aria-hidden="true" /> All work
      </Link>
      <header className="case-study-header">
        <span className="eyebrow">
          {study ? 'Case study' : 'Project notes'} /{' '}
          {study?.context ?? 'Web development'}
        </span>
        <AnimatedHeading text={project.title} className="case-study-title" />
        {study && (
          <Reveal>
            <p className="case-study-lede">{project.description}</p>
          </Reveal>
        )}
        {(study || project.tags.length > 0) && (
          <Reveal className="case-meta">
            {study && (
              <div>
                <span className="eyebrow">My role</span>
                <p>{study.role}</p>
              </div>
            )}
            {study && (
              <div>
                <span className="eyebrow">Project</span>
                <p>{study.context}</p>
              </div>
            )}
            {project.tags.length > 0 && (
              <div>
                <span className="eyebrow">Built with</span>
                <ul>
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        )}
        {((study?.repositories.length ?? 0) > 0 || project.link) && (
          <Reveal className="case-external-links">
            {study?.repositories.map((repository) => (
              <a
                key={repository.href}
                href={repository.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                {repository.label}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            ))}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Visit project
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
          </Reveal>
        )}
      </header>

      {project.imageUrl && (
        <Reveal>
          <figure className="case-cover">
            <img
              src={project.imageUrl}
              alt={cover?.alt ?? `${project.title} interface`}
              width={cover?.width ?? 1440}
              height={cover?.height ?? 1000}
            />
            <figcaption>
              {cover?.caption ?? `${project.title} — interface preview`}
            </figcaption>
          </figure>
        </Reveal>
      )}

      <div className="case-layout">
        <aside>
          <nav aria-label="Project sections" className="case-section-nav">
            <span className="eyebrow">In this project</span>
            {sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>
                {section.label}
                <ArrowRight size={13} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </aside>
        <div className="case-body">
          {study ? (
            <>
              <section id="the-problem" className="case-section">
                <Reveal>
                  <span className="eyebrow">Context</span>
                  <h2>The problem.</h2>
                  <p>{study.problem}</p>
                </Reveal>
              </section>
              <section id="my-contribution" className="case-section">
                <Reveal>
                  <span className="eyebrow">What I built</span>
                  <h2>My contribution.</h2>
                </Reveal>
                <ol className="case-records">
                  {study.contributions.map((item, index) => (
                    <li key={item.title}>
                      <Reveal className="case-record">
                        <span className="case-record-index">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.body}</p>
                        </div>
                      </Reveal>
                    </li>
                  ))}
                </ol>
              </section>
              <section id="technical-decisions" className="case-section">
                <Reveal>
                  <span className="eyebrow">Under the surface</span>
                  <h2>Technical decisions.</h2>
                </Reveal>
                <ol className="case-records">
                  {study.decisions.map((item, index) => (
                    <li key={item.title}>
                      <Reveal className="case-record">
                        <span className="case-record-index">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.body}</p>
                        </div>
                      </Reveal>
                    </li>
                  ))}
                </ol>
              </section>
              <section id="the-outcome" className="case-section case-outcome">
                <Reveal>
                  <span className="eyebrow">The result</span>
                  <h2>The outcome.</h2>
                  <p>{study.outcome}</p>
                </Reveal>
              </section>
            </>
          ) : (
            <section id="project-overview" className="case-section">
              <Reveal>
                <h2>Overview.</h2>
                <p>{project.description}</p>
              </Reveal>
            </section>
          )}
          {study?.gallery
            ?.filter((image) => image.src !== project.imageUrl)
            .map((image) => (
              <Reveal key={image.src}>
                <figure className="case-cover">
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                  />
                  <figcaption>{image.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
        </div>
      </div>

      <Reveal className="case-next">
        <Link to="/projects" className="text-link">
          <ArrowLeft size={15} aria-hidden="true" /> All projects
        </Link>
        {next && (
          <Link
            to="/projects/$projectId"
            params={{ projectId: projectPathId(next) }}
            className="case-next-project"
          >
            <span className="eyebrow">Next project</span>
            <span>
              {next.title}
              <ArrowUpRight size={24} aria-hidden="true" />
            </span>
          </Link>
        )}
      </Reveal>
    </article>
  )
}
