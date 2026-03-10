import { createFileRoute } from '@tanstack/react-router'
import { AdminApiKeysView } from '@/features/admin-apikeys'
import { requireSessionRoles } from '@/features/admin-auth/utils/route-guards'

export const Route = createFileRoute('/admin/apikeys')({
  beforeLoad: () => requireSessionRoles(['admin']),
  component: AdminApiKeysPage,
})

function AdminApiKeysPage() {
  return <AdminApiKeysView />
}
