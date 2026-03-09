import type { Message } from '@/features/admin/types'
import type { MessageFilterState } from '../types'

export function filterMessages(messages: Message[], filters: MessageFilterState): Message[] {
  return messages.filter((message) => {
    const matchesQuery =
      filters.query.length === 0 ||
      message.name.toLowerCase().includes(filters.query.toLowerCase()) ||
      message.email.toLowerCase().includes(filters.query.toLowerCase()) ||
      message.body.toLowerCase().includes(filters.query.toLowerCase())

    const matchesStatus =
      filters.status === 'all' ||
      (filters.status === 'read' && message.isRead) ||
      (filters.status === 'unread' && !message.isRead)

    return matchesQuery && matchesStatus
  })
}