import { createFileRoute } from '@tanstack/react-router'
import { AdminLoginView } from '@/features/admin-auth'
import { redirectIfAuthenticated } from '@/features/admin-auth/utils/route-guards'

export const Route = createFileRoute('/admin/login')({
  beforeLoad: () => redirectIfAuthenticated(),
  component: AdminLoginPage,
})

function AdminLoginPage() {
  return <AdminLoginView />
}