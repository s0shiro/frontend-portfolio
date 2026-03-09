import { createFileRoute } from '@tanstack/react-router'
import { AdminProjectsView } from '@/features/admin-projects'
import { requireSessionRoles } from '@/features/admin-auth/utils/route-guards'

export const Route = createFileRoute('/admin/projects')({
  beforeLoad: () => requireSessionRoles(['admin', 'editor']),
  component: AdminProjectsPage,
})

function AdminProjectsPage() {
  return <AdminProjectsView />
}