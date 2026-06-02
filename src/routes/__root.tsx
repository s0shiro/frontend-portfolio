import { createRootRoute, Outlet, useMatchRoute, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { Sidebar } from '../components/layout/Sidebar'
import { MobileNav } from '../components/layout/MobileNav'
import { ThemeProvider } from '@/features/theme'
import { Toaster } from '@/components/ui/sonner'
import { ChatbotWidget } from '@/features/chatbot'

export const Route = createRootRoute({
  errorComponent: RootErrorComponent,
  notFoundComponent: NotFoundComponent,
  component: RootLayout,
})

function RootLayout() {
  const matchRoute = useMatchRoute()
  const isAdmin = matchRoute({ to: '/admin', fuzzy: true })
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  if (isAdmin) {
    return (
      <ThemeProvider>
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
        <Toaster richColors closeButton position="top-center" />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground font-sans md:flex-row md:justify-center">
        <MobileNav />
        <div className="flex w-full max-w-[1440px] gap-8 px-4 md:px-8 lg:gap-12 lg:px-12">
          <Sidebar />

          <main className="min-w-0 flex-1 py-12 md:py-16">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeInOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <ChatbotWidget />
        <TanStackRouterDevtools position="bottom-right" />
        <Toaster richColors closeButton position="top-center" />
      </div>
    </ThemeProvider>
  )
}

function NotFoundComponent() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-md text-center space-y-6">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">404</p>
          <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
          <p className="text-base text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/40 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Back to home
          </Link>
        </div>
      </div>
    </ThemeProvider>
  )
}

function RootErrorComponent({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : 'An unexpected routing error occurred.'

  return (
    <ThemeProvider>
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-xl rounded-lg border border-border bg-card p-6">
          <h1 className="text-lg font-semibold tracking-tight">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </ThemeProvider>
  )
}
