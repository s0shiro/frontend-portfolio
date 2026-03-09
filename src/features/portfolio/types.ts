export type SocialLink = {
  label: string
  href: string
}

export type Profile = {
  fullName: string
  headline: string
  summary: string
  availability: string
  location: string
  email: string
  socials: SocialLink[]
}

export type ExperienceItem = {
  company: string
  role: string
  periodLabel: string
  durationLabel: string
  highlights: string[]
}

export type ProjectItem = {
  name: string
  role: string
  href: string
  summary: string
  highlights: string[]
  technologies: string[]
  featured: boolean
}

export type EducationItem = {
  institution: string
  program: string
  note?: string
}

export type SkillGroup = {
  category: string
  items: string[]
}

export type PortfolioContent = {
  profile: Profile
  experience: ExperienceItem[]
  projects: ProjectItem[]
  education: EducationItem[]
  skillGroups: SkillGroup[]
}