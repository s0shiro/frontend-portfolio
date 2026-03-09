import { createFileRoute } from '@tanstack/react-router'
import { AdminExperiencesView } from '@/features/admin-experiences'
import { requireSessionRoles } from '@/features/admin-auth/utils/route-guards'

export const Route = createFileRoute('/admin/experiences')({
  beforeLoad: () => requireSessionRoles(['admin', 'editor']),
  component: AdminExperiencesPage,
})

function AdminExperiencesPage() {
  return <AdminExperiencesView />
}