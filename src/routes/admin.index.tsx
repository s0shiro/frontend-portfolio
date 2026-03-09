import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboard } from '@/features/admin'
import { requireAuthenticatedSession } from '@/features/admin-auth/utils/route-guards'

export const Route = createFileRoute('/admin/')({
  beforeLoad: () => requireAuthenticatedSession(),
  component: AdminPage,
})

function AdminPage() {
  return <AdminDashboard />
}