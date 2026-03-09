import type { PortfolioContent } from '@/features/portfolio/types'

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
  experience: [],
  projects: [],
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