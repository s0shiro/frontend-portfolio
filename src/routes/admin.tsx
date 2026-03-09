import { createFileRoute, Outlet, useMatchRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/features/admin/components/admin-layout'

export const Route = createFileRoute('/admin')({
  component: AdminRouteLayout,
})

function AdminRouteLayout() {
  const matchRoute = useMatchRoute()
  const isLogin = matchRoute({ to: '/admin/login' })

  // Login page renders without the admin chrome
  if (isLogin) {
    return <Outlet />
  }

  return <AdminLayout />
}
