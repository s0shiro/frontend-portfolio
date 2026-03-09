import { motion } from 'framer-motion'
import { ArrowUpRight, Mail } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Custom SVG Brand Icons since Lucide's are deprecated
const BrandIcons = {
  Instagram: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
  Linkedin: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Github: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

const socials = [
  {
    name: 'Stay in Touch',
    description: 'Reach out via email for inquiries or collaborations.',
    icon: Mail,
    href: 'mailto:contact@example.com',
    label: 'Email Me',
    className: 'md:col-span-8',
    iconOverlay: Mail,
  },
  {
    name: 'Instagram',
    description: 'Visual journey and snapshots.',
    icon: BrandIcons.Instagram,
    href: 'https://instagram.com',
    label: 'Follow',
    className: 'md:col-span-4',
    iconOverlay: BrandIcons.Instagram,
  },
  {
    name: "LinkedIn",
    description: 'Professional updates and networking.',
    icon: BrandIcons.Linkedin,
    href: 'https://www.linkedin.com/in/neilven-mascari%C3%B1as-0809452a8/',
    label: 'Connect',
    className: 'md:col-span-6',
    iconOverlay: BrandIcons.Linkedin,
  },
  {
    name: 'GitHub',
    description: 'Explore my open-source contributions.',
    icon: BrandIcons.Github,
    href: 'https://github.com/s0shiro',
    label: 'View Code',
    className: 'md:col-span-6',
    iconOverlay: BrandIcons.Github,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function SocialBentoGrid() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-12 auto-rows-[250px] gap-4"
    >
      {socials.map((social) => (
        <motion.a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          variants={itemVariants}
          whileHover={{ y: -5, scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "group block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl",
            social.className
          )}
        >
          <Card className="h-full overflow-hidden bg-background/60 backdrop-blur-md border-white/10 transition-colors hover:bg-muted/50 flex flex-col justify-between relative shadow-sm">
            
            {/* Background Icon Overlay */}
            <div className="absolute -bottom-8 -right-8 text-muted-foreground/10 group-hover:text-primary/10 transition-all duration-500 pointer-events-none transform group-hover:scale-110 group-hover:-rotate-12">
              <social.iconOverlay className="w-56 h-56" />
            </div>

            <CardHeader className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <social.icon className="w-5 h-5" />
              </div>
              <CardTitle className="tracking-tighter font-bold text-2xl group-hover:text-primary transition-colors duration-300">
                {social.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium max-w-[85%] mt-2">
                {social.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10 flex justify-between items-end pb-6">
               <span className="text-sm font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1 text-primary">
                {social.label}
              </span>
              <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm ml-auto">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </motion.a>
      ))}
    </motion.div>
  )
}
