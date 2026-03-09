import { Link } from '@tanstack/react-router'
import {
  Menu,
  Home,
  User,
  FolderOpen,
  Mail,
  BadgeCheck,
  Download,
} from 'lucide-react'
import { useState } from 'react'

import avatarImage from '@/assets/images/me.jpg'
import resumePDF from '@/assets/files/NEILVEN_MASCARINAS.pdf'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { portfolioContent } from '@/features/portfolio/content'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useSecretClick } from '@/features/admin/hooks/use-secret-click'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About', icon: User },
  { path: '/projects', label: 'Projects', icon: FolderOpen },
  { path: '/contact', label: 'Contact', icon: Mail },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const handleSecretClick = useSecretClick(5, 500)

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/40 bg-background/60 px-4 backdrop-blur-md md:hidden">
      <Link to="/" className="flex items-center gap-2">
        <Avatar className="size-8 border border-border/60" onClick={handleSecretClick}>
          <AvatarImage src={avatarImage} alt={portfolioContent.profile.fullName} />
          <AvatarFallback>NM</AvatarFallback>
        </Avatar>
        <span className="text-sm font-bold tracking-tight">
          {portfolioContent.profile.fullName}
        </span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="size-9" />
          }
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] border-r border-border/40 bg-background/95 p-0 backdrop-blur-xl">
          <SheetHeader className="p-6 pb-2 text-left">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex items-center gap-3">
              <Avatar className="size-12 border border-border/60" onClick={handleSecretClick}>
                <AvatarImage src={avatarImage} alt={portfolioContent.profile.fullName} />
                <AvatarFallback>NM</AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h2 className="flex items-center gap-1 text-base font-bold tracking-tight">
                  {portfolioContent.profile.fullName}
                  <BadgeCheck aria-label="Verified" className="size-4 fill-sky-500 text-white" />
                </h2>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {portfolioContent.profile.headline}
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex flex-col gap-6 p-6">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground [&.active]:bg-muted [&.active]:text-foreground"
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="space-y-4 pt-4">
              <div className="px-4 space-y-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">Connect</p>
                <a
                  href={`mailto:${portfolioContent.profile.email}`}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Mail className="size-4" />
                  Email Me
                </a>
                <a
                  href={resumePDF}
                  download="NEILVEN_MASCARINAS.pdf"
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Download className="size-4" />
                  Download CV
                </a>
              </div>
              
              <div className="flex items-center justify-between px-4">
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 w-full px-10 text-center">
             <p className="text-[10px] text-muted-foreground/50">
               © {new Date().getFullYear()} {portfolioContent.profile.fullName}
             </p>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
