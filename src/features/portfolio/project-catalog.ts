import type { PublishedProject } from './types'

// Published fallback content is grounded in the bundled résumé and the public
// source repositories. Keep claims qualitative until measured results exist.
export const publishedProjects: PublishedProject[] = [
  {
    id: 'crop-production-monitoring-system',
    title: 'Crop Production Monitoring System',
    description:
      'A crop monitoring application for the Marinduque Provincial Agriculture Office, bringing farmer records, mapped crop activity, and monthly reporting into one workflow.',
    link: null,
    imageUrl: '/project-covers/crop-monitoring.jpg',
    tags: ['Vue.js', 'Laravel', 'Leaflet', 'REST APIs'],
    orderIndex: 0,
    caseStudy: {
      slug: 'crop-production-monitoring-system',
      role: 'Lead Full Stack Developer',
      context: 'Capstone project / Agriculture',
      problem:
        'Crop monitoring involves farmer information, production records, geographic context, and recurring reports. The project digitizes these connected tasks for the Marinduque Provincial Agriculture Office and automates report calculations and monthly summaries.',
      contributions: [
        {
          title: 'Farmer and crop records',
          body: 'Developed farmer registration and crop record workflows within a full-stack web application.',
        },
        {
          title: 'Mapped crop activity',
          body: 'Integrated Leaflet maps to give crop monitoring a geographic view.',
        },
        {
          title: 'Reporting and account access',
          body: 'Implemented email verification and automated crop report calculations and monthly summaries.',
        },
      ],
      decisions: [
        {
          title: 'A dedicated frontend and API',
          body: 'The Vue frontend and Laravel API separate the interface from the application’s data and business logic.',
        },
        {
          title: 'Maps alongside records',
          body: 'Leaflet integration brings location information into the same application as farmer and crop records.',
        },
      ],
      outcome:
        'Digitized crop monitoring and automated recurring report calculations, reducing manual reporting work and supporting more timely, consistent summaries.',
      repositories: [
        {
          label: 'Frontend source',
          href: 'https://github.com/s0shiro/crop-monitoring-VueFrontend',
        },
        {
          label: 'Backend source',
          href: 'https://github.com/s0shiro/crop-monitoring-laravleAPI',
        },
      ],
      gallery: [
        {
          src: '/project-covers/crop-monitoring.jpg',
          alt: 'Crop Monitoring System sign-in screen with the Marinduque Provincial Agriculture Office identity',
          caption: 'Crop monitoring application / Account access',
          width: 1440,
          height: 1000,
        },
        {
          src: '/project-covers/crop-registration.jpg',
          alt: 'Crop Monitoring System account registration form',
          caption: 'Crop monitoring application / Account registration',
          width: 1440,
          height: 1000,
        },
      ],
    },
  },
  {
    id: 'marinduque-vehicle-rental-system',
    title: 'Marinduque Vehicle Rental System',
    description:
      'A vehicle rental platform connecting vehicle listings, bookings, availability, and payments with the administration tools needed to manage them.',
    link: null,
    imageUrl: '/project-covers/vehicle-rental.jpg',
    tags: ['Vue.js', 'Laravel', 'JWT', 'FullCalendar'],
    orderIndex: 1,
    caseStudy: {
      slug: 'marinduque-vehicle-rental-system',
      role: 'Full Stack Developer',
      context: 'Web application / Vehicle rental',
      problem:
        'Vehicle rental brings together listings, customer accounts, bookings, payments, and changing availability. The project connects these workflows with tools for vehicle management, user verification, and booking administration.',
      contributions: [
        {
          title: 'Rental APIs',
          body: 'Designed and developed RESTful APIs for vehicle listings, bookings, authentication, payments, and availability management.',
        },
        {
          title: 'Access control',
          body: 'Secured the APIs with JWT authentication and role-based access control.',
        },
        {
          title: 'An operational dashboard',
          body: 'Built administration tools for vehicle management, user verification, a booking calendar, and automated notifications.',
        },
      ],
      decisions: [
        {
          title: 'Explicit permissions',
          body: 'JWT authentication and role-based access control protect the rental APIs and distinguish access to different operations.',
        },
        {
          title: 'A calendar for booking activity',
          body: 'The frontend uses FullCalendar to present booking activity as a calendar within the administration workflow.',
        },
      ],
      outcome:
        'Delivered a full-stack rental workflow with secured APIs and a dashboard for managing vehicles, verifying users, following bookings, and sending automated notifications.',
      repositories: [
        { label: 'Frontend source', href: 'https://github.com/s0shiro/mvr' },
        {
          label: 'Backend source',
          href: 'https://github.com/s0shiro/mvr-backend',
        },
      ],
      gallery: [
        {
          src: '/project-covers/vehicle-rental.jpg',
          alt: 'Marinduque Vehicle Rental System homepage with rental platform introduction and navigation',
          caption: 'Vehicle rental application / Public homepage',
          width: 1440,
          height: 490,
        },
        {
          src: '/project-covers/vehicle-rental-login.jpg',
          alt: 'Marinduque Vehicle Rental System sign-in form',
          caption: 'Vehicle rental application / Account access',
          width: 1440,
          height: 1000,
        },
      ],
    },
  },
]

const aliases: Record<string, string[]> = {
  'crop-production-monitoring-system': [
    'crop production monitoring system',
    'crop monitoring system',
    'growsmart',
  ],
  'marinduque-vehicle-rental-system': [
    'marinduque vehicle rental system',
    'marinduque vehicle rental',
    'mvr',
  ],
}

function normalizedTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function enrichProject(project: PublishedProject): PublishedProject {
  const curated = publishedProjects.find(
    (item) =>
      item.id === project.id ||
      aliases[item.id]?.some(
        (title) => normalizedTitle(title) === normalizedTitle(project.title),
      ),
  )
  if (!curated) return project
  return { ...project, caseStudy: curated.caseStudy }
}

export function projectPathId(project: PublishedProject) {
  return project.caseStudy?.slug ?? project.id
}
