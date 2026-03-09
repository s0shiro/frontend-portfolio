import { describe, expect, it } from 'vitest'
import { filterMessages } from './message-filters'
import type { Message } from '@/features/admin/types'

const messages: Message[] = [
  {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    body: 'Need help with project setup',
    isRead: false,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Bob',
    email: 'bob@example.com',
    body: 'Thanks for the update',
    isRead: true,
    createdAt: '2026-01-02T00:00:00.000Z',
  },
]

describe('filterMessages', () => {
  it('returns unread messages when unread filter is selected', () => {
    const result = filterMessages(messages, { query: '', status: 'unread' })

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('1')
  })

  it('matches messages by query against name, email, and body', () => {
    const nameMatch = filterMessages(messages, { query: 'alice', status: 'all' })
    const emailMatch = filterMessages(messages, { query: 'bob@example.com', status: 'all' })
    const bodyMatch = filterMessages(messages, { query: 'project setup', status: 'all' })

    expect(nameMatch).toHaveLength(1)
    expect(nameMatch[0]?.id).toBe('1')
    expect(emailMatch).toHaveLength(1)
    expect(emailMatch[0]?.id).toBe('2')
    expect(bodyMatch).toHaveLength(1)
    expect(bodyMatch[0]?.id).toBe('1')
  })
})
