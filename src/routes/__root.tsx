import { createRootRoute, Outlet, useMatchRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Sidebar } from '../components/layout/Sidebar'
import { MobileNav } from '../components/layout/MobileNav'
import { ThemeProvider } from '@/features/theme'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRoute({
  errorComponent: RootErrorComponent,
  component: RootLayout,
})

function RootLayout() {
  const matchRoute = useMatchRoute()
  const isAdmin = matchRoute({ to: '/admin', fuzzy: true })

  if (isAdmin) {
    return (
      <ThemeProvider>
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
        <Toaster richColors closeButton position="bottom-right" />
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
            <Outlet />
          </main>
        </div>
        <TanStackRouterDevtools position="bottom-right" />
        <Toaster richColors closeButton position="bottom-right" />
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
