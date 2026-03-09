export type MessageFilterState = {
  query: string
  status: 'all' | 'read' | 'unread'
}

export type BulkMessageAction = 'read' | 'archive' | 'delete'