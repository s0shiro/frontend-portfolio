import { createFileRoute } from '@tanstack/react-router'
import { AdminMessagesView } from '@/features/admin-messages'
import { requireSessionRoles } from '@/features/admin-auth/utils/route-guards'

export const Route = createFileRoute('/admin/messages')({
  beforeLoad: () => requireSessionRoles(['admin']),
  component: AdminMessagesPage,
})

function AdminMessagesPage() {
  return <AdminMessagesView />
}