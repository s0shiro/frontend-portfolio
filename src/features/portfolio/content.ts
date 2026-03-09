import type { ExperienceItemType } from '@/components/work-experience/work-experience'
import type { PortfolioContent } from '@/features/portfolio/types'
import { Code } from 'lucide-react'

export const WORK_EXPERIENCE: ExperienceItemType[] = [
  {
    id: "ramcar-group",
    companyName: "Ramcar Group of Companies",
    companyLogo: undefined,
    isCurrentEmployer: false,
    positions: [
      {
        id: "intern-1",
        title: "Full Stack Developer Intern",
        employmentPeriod: "486 hours",
        employmentType: "Internship",
        icon: Code,
        description:
          "- Improved a web-based asset inventory management system with delivery receipt generation and barcode-based item selection.\n- Implemented role-based user management to support cleaner operational control across the system.\n- Worked inside an Agile team and joined code reviews focused on maintainability, readability, and efficient implementation.",
        skills: ["React", "Agile", "Full Stack", "System Management"],
      },
    ],
  },
]

export const portfolioContent: PortfolioContent = {
  profile: {
    fullName: 'Neilven Mascariñas',
    headline: '',
    summary:
      'I focus on shipping useful products that simplify real workflows, from government crop monitoring tools to booking and asset management systems. My work combines frontend clarity, backend structure, and a strong bias toward maintainable implementation.',
    availability: 'Open to junior full-stack and frontend opportunities',
    location: 'Marinduque, Philippines',
    email: 'mascarinas022@gmail.com',
    socials: [
      {
        label: 'Email',
        href: 'mailto:mascarinas022@gmail.com',
      },
    ],
  },
  experience: [
    {
      company: 'Ramcar Group of Companies',
      role: 'Full Stack Developer Intern',
      periodLabel: 'Professional Experience',
      durationLabel: '486 hours',
      highlights: [
        'Improved a web-based asset inventory management system with delivery receipt generation and barcode-based item selection.',
        'Implemented role-based user management to support cleaner operational control across the system.',
        'Worked inside an Agile team and joined code reviews focused on maintainability, readability, and efficient implementation.',
      ],
    },
  ],
  projects: [
    {
      name: 'Crop Production Monitoring System',
      role: 'Lead Full Stack Developer',
      href: 'https://growsmart.app',
      summary:
        'A full-stack platform that digitized crop monitoring and reporting for the Marinduque Provincial Agriculture Office.',
      highlights: [
        'Built farmer registration, crop record management, email verification, and map-based monitoring with Leaflet integration.',
        'Automated crop report calculations and monthly summaries to reduce manual work and improve data accuracy.',
      ],
      technologies: ['React', 'Node.js', 'TypeScript', 'Leaflet', 'PostgreSQL'],
      featured: true,
    },
    {
      name: 'Marinduque Vehicle Rental System',
      role: 'Full Stack Developer',
      href: 'https://mvr.onrender.com',
      summary:
        'A vehicle booking platform with secure API flows, admin tooling, and availability management.',
      highlights: [
        'Designed REST APIs for listings, bookings, payments, authentication, and role-based access control.',
        'Built an admin dashboard for user verification, vehicle management, booking visibility, and automated notifications.',
      ],
      technologies: ['React', 'Express', 'JWT', 'MongoDB', 'REST API'],
      featured: true,
    },
  ],
  education: [
    {
      institution: 'Marinduque State University',
      program: 'Bachelor of Science in Information Technology',
    },
    {
      institution: 'Bangbang National High School',
      program: 'Science, Technology, Engineering, and Mathematics',
      note: 'With High Honor Graduate',
    },
  ],
  skillGroups: [
    {
      category: 'Frontend',
      items: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'HTML5', 'CSS3', 'Tailwind CSS'],
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express.js', 'Laravel', 'REST APIs', 'Authentication', 'Drizzle ORM'],
    },
    {
      category: 'Databases',
      items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Supabase'],
    },
    {
      category: 'Tools',
      items: ['Git', 'GitHub', 'Resend', 'TanStack Query'],
    },
    {
      category: 'Other',
      items: ['Agile development', 'CRUD operations', 'Responsive design'],
    },
  ],
}