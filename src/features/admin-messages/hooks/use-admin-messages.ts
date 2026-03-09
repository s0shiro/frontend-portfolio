import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteMessage, fetchMessages, markMessageRead } from '@/features/admin/api'
import type { BulkMessageAction, MessageFilterState } from '../types'
import { filterMessages } from '../utils/message-filters'

export function useAdminMessages() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<MessageFilterState>({
    query: '',
    status: 'all',
  })
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const messagesQuery = useQuery({
    queryKey: ['admin', 'messages', filters.status, filters.query],
    queryFn: () => {
      const isRead =
        filters.status === 'read' ? true : filters.status === 'unread' ? false : undefined

      return fetchMessages({
        isRead,
        search: filters.query.length > 0 ? filters.query : undefined,
      })
    },
  })

  const readMutation = useMutation({
    mutationFn: markMessageRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] })
    },
  })

  const visibleMessages = useMemo(
    () => filterMessages(messagesQuery.data ?? [], filters),
    [messagesQuery.data, filters],
  )

  function toggleSelection(id: string) {
    setSelectedIds((currentIds) =>
      currentIds.includes(id) ? currentIds.filter((currentId) => currentId !== id) : [...currentIds, id],
    )
  }

  function applyBulkAction(action: BulkMessageAction) {
    if (action === 'read') {
      for (const id of selectedIds) {
        readMutation.mutate(id)
      }
    }

    if (action === 'delete' || action === 'archive') {
      for (const id of selectedIds) {
        deleteMutation.mutate(id)
      }
    }

    setSelectedIds([])
  }

  return {
    filters,
    setFilters,
    messages: visibleMessages,
    selectedIds,
    isLoading: messagesQuery.isLoading || readMutation.isPending || deleteMutation.isPending,
    toggleSelection,
    applyBulkAction,
  }
}