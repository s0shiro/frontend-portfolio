import { useMemo, useState } from 'react'
import { Inbox, MailCheck, Search, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  AdminEmptyState,
  AdminLoadingState,
  AdminPageHeader,
  AdminStatus,
} from '@/features/admin/components/admin-page'
import { cn } from '@/lib/utils'
import type { Message } from '@/features/admin/types'
import { useAdminMessages } from '../hooks/use-admin-messages'

function formatMessageDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function AdminMessagesView() {
  const {
    filters,
    setFilters,
    messages,
    selectedIds,
    isLoading,
    toggleSelection,
    applyBulkAction,
  } = useAdminMessages()
  const [activeMessage, setActiveMessage] = useState<Message | null>(null)

  const visibleIds = useMemo(() => messages.map((message) => message.id), [messages])
  const selectedVisibleCount = visibleIds.filter((id) => selectedIds.includes(id)).length
  const allVisibleSelected = messages.length > 0 && selectedVisibleCount === messages.length
  const hasSelection = selectedIds.length > 0

  function toggleVisibleSelection() {
    if (allVisibleSelected) {
      for (const id of visibleIds) {
        toggleSelection(id)
      }
      return
    }

    for (const id of visibleIds) {
      if (!selectedIds.includes(id)) {
        toggleSelection(id)
      }
    }
  }

  return (
    <div className="space-y-12">
      <AdminPageHeader
        eyebrow="Messages"
        title="Inbox"
        description="Filter inquiries, read them in full, and clear what you have handled."
      />

      <div className="space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col gap-3 border-y border-border/60 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <Input
              value={filters.query}
              onChange={(event) =>
                setFilters((current) => ({ ...current, query: event.target.value }))
              }
              placeholder="Search sender, email, or content"
              className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="flex shrink-0 gap-4">
            {(['all', 'unread', 'read'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilters((current) => ({ ...current, status }))}
                className={cn(
                  'font-mono text-[0.6875rem] uppercase tracking-[0.14em] underline-offset-4 transition-colors',
                  filters.status === status
                    ? 'text-foreground underline'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Selection actions — only present once something is selected */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            {hasSelection
              ? `${selectedIds.length} selected`
              : `${messages.length} message${messages.length === 1 ? '' : 's'}`}
          </p>

          {hasSelection ? (
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => applyBulkAction('read')}>
                <MailCheck className="size-4" />
                Mark read
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => applyBulkAction('delete')}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <AdminLoadingState description="Loading inbox..." />
      ) : messages.length === 0 ? (
        <AdminEmptyState
          icon={Inbox}
          title="Inbox is clear"
          description="No messages match the current search and status filters."
        />
      ) : (
        <div className="border-t border-border/60">
          <div className="flex items-center gap-4 border-b border-border/60 py-2">
            <Checkbox
              checked={allVisibleSelected}
              onChange={toggleVisibleSelection}
              aria-label="Select all visible messages"
            />
            <span className="eyebrow">Sender</span>
          </div>

          <ul>
            {messages.map((message) => (
              <li
                key={message.id}
                className={cn(
                  'border-b border-border/60 transition-colors',
                  selectedIds.includes(message.id) && 'bg-muted/40',
                )}
              >
                <div className="flex items-start gap-4 py-4">
                  <Checkbox
                    checked={selectedIds.includes(message.id)}
                    onChange={() => toggleSelection(message.id)}
                    aria-label={`Select message from ${message.name}`}
                    className="mt-1 shrink-0"
                  />

                  <button
                    type="button"
                    onClick={() => setActiveMessage(message)}
                    className="grid min-w-0 flex-1 gap-x-6 gap-y-1 text-left md:grid-cols-[12rem_1fr_9rem] md:items-baseline"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {message.name}
                      </span>
                      <span className="block truncate font-mono text-[0.6875rem] text-muted-foreground">
                        {message.email}
                      </span>
                    </span>

                    <span className="min-w-0 truncate text-sm text-muted-foreground">
                      {message.body}
                    </span>

                    <span className="flex items-center gap-3 md:justify-end">
                      {message.isRead ? null : <AdminStatus label="New" tone="attention" />}
                      <span className="font-mono text-[0.6875rem] whitespace-nowrap text-muted-foreground">
                        {formatMessageDate(message.createdAt)}
                      </span>
                    </span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Dialog open={activeMessage !== null} onOpenChange={(open) => !open && setActiveMessage(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{activeMessage?.name}</DialogTitle>
            <DialogDescription className="font-mono text-xs">
              {activeMessage?.email}
              {activeMessage ? ` · ${formatMessageDate(activeMessage.createdAt)}` : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="border-t border-border/60 pt-4 text-sm leading-6 whitespace-pre-wrap text-foreground">
            {activeMessage?.body}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
