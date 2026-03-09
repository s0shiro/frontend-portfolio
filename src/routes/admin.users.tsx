import { createFileRoute } from '@tanstack/react-router'
import { AdminUsersView } from '@/features/admin-users'
import { requireSessionRoles } from '@/features/admin-auth/utils/route-guards'

export const Route = createFileRoute('/admin/users')({
  beforeLoad: () => requireSessionRoles(['admin']),
  component: AdminUsersPage,
})

function AdminUsersPage() {
  return <AdminUsersView />
}