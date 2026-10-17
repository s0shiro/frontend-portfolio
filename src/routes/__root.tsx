import { createRootRoute, Outlet, useMatchRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { MotionConfig } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { PortfolioShell } from '@/components/layout/PortfolioShell'
import { useMotionPreference } from '@/lib/motion-preference'
import { ThemeProvider } from '@/features/theme'
import { Toaster } from '@/components/ui/sonner'

const ChatbotWidget = lazy(() =>
  import('@/features/chatbot/components/ChatbotWidget').then((module) => ({
    default: module.ChatbotWidget,
  })),
)

export const Route = createRootRoute({
  errorComponent: RootErrorComponent,
  notFoundComponent: NotFoundComponent,
  component: RootLayout,
})

function RootLayout() {
  const matchRoute = useMatchRoute()
  const isAdmin = matchRoute({ to: '/admin', fuzzy: true })
  const { enabled } = useMotionPreference()

  if (isAdmin) {
    return (
      <ThemeProvider>
        <Outlet />
        {import.meta.env.DEV && (
          <TanStackRouterDevtools position="bottom-left" />
        )}
        <Toaster richColors closeButton position="top-center" />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <MotionConfig
        reducedMotion={enabled ? 'never' : 'always'}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <PortfolioShell>
          <Outlet />
        </PortfolioShell>
        <Suspense fallback={null}>
          <ChatbotWidget />
        </Suspense>
        {import.meta.env.DEV && (
          <TanStackRouterDevtools position="bottom-left" />
        )}
        <Toaster richColors closeButton position="top-center" />
      </MotionConfig>
    </ThemeProvider>
  )
}

function NotFoundComponent() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-md text-center space-y-6">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
            404
          </p>
          <h1 className="display-lg">Page not found</h1>
          <p className="text-base text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="action-link">
            Back to home
          </Link>
        </div>
      </div>
    </ThemeProvider>
  )
}

function RootErrorComponent({ error }: { error: unknown }) {
  const message =
    error instanceof Error
      ? error.message
      : 'An unexpected routing error occurred.'

  return (
    <ThemeProvider>
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-xl rounded-lg border border-border bg-card p-6">
          <h1 className="text-lg font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </ThemeProvider>
  )
}
