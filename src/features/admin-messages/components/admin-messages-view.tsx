import { useMemo, useState } from 'react'
import { Archive, Inbox, MailCheck, Search, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminEmptyState, AdminLoadingState, AdminPageHeader } from '@/features/admin/components/admin-page'
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
  const { filters, setFilters, messages, selectedIds, isLoading, toggleSelection, applyBulkAction } = useAdminMessages()
  const [activeMessage, setActiveMessage] = useState<Message | null>(null)

  const visibleIds = useMemo(() => messages.map((message) => message.id), [messages])
  const selectedVisibleCount = visibleIds.filter((id) => selectedIds.includes(id)).length
  const allVisibleSelected = messages.length > 0 && selectedVisibleCount === messages.length

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
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Messages"
        title="Inbox operations"
        description="Filter inquiries, scan previews, open full messages, and apply bulk triage actions."
      />

      <Card className="sticky top-4 z-10 border-border/60 bg-background/85 backdrop-blur-md">
        <CardContent className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Input
              value={filters.query}
              onChange={(event) => setFilters((currentFilters) => ({ ...currentFilters, query: event.target.value }))}
              placeholder="Search by sender, email, or content"
              className="bg-background/70"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'unread', 'read'] as const).map((status) => (
              <Button
                key={status}
                type="button"
                size="sm"
                variant={filters.status === status ? 'default' : 'outline'}
                onClick={() => setFilters((currentFilters) => ({ ...currentFilters, status }))}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/60 p-3 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedIds.length > 0 ? `${selectedIds.length} selected` : `${messages.length} message${messages.length === 1 ? '' : 's'}`}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" disabled={selectedIds.length === 0} onClick={() => applyBulkAction('read')}>
            <MailCheck className="size-4" />
            Mark read
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={selectedIds.length === 0} onClick={() => applyBulkAction('archive')}>
            <Archive className="size-4" />
            Archive
          </Button>
          <Button type="button" size="sm" variant="destructive" disabled={selectedIds.length === 0} onClick={() => applyBulkAction('delete')}>
            <Trash2 className="size-4" />
            Delete
          </Button>
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
        <Card className="border-border/60 bg-background/70 backdrop-blur-md">
          <CardContent className="p-0">
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allVisibleSelected}
                        onChange={toggleVisibleSelection}
                        aria-label="Select all visible messages"
                      />
                    </TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Preview</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id} data-state={selectedIds.includes(message.id) ? 'selected' : undefined}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(message.id)}
                          onChange={() => toggleSelection(message.id)}
                          aria-label={`Select message from ${message.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">{message.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{message.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[360px]">
                        <p className="truncate text-sm text-muted-foreground">{message.body}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={message.isRead ? 'outline' : 'secondary'}>
                          {message.isRead ? 'Read' : 'Unread'}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatMessageDate(message.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button type="button" size="sm" variant="ghost" onClick={() => setActiveMessage(message)}>
                          Open
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="divide-y divide-border/50 md:hidden">
              {messages.map((message) => (
                <div key={message.id} className="space-y-3 p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedIds.includes(message.id)}
                      onChange={() => toggleSelection(message.id)}
                      aria-label={`Select message from ${message.name}`}
                      className="mt-1"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-foreground">{message.name}</p>
                        <Badge variant={message.isRead ? 'outline' : 'secondary'}>
                          {message.isRead ? 'Read' : 'Unread'}
                        </Badge>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{message.email}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{message.body}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pl-7">
                    <span className="text-xs text-muted-foreground">{formatMessageDate(message.createdAt)}</span>
                    <Button type="button" size="sm" variant="outline" onClick={() => setActiveMessage(message)}>
                      Open
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={activeMessage !== null} onOpenChange={(open) => !open && setActiveMessage(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{activeMessage?.name}</DialogTitle>
            <DialogDescription>
              {activeMessage?.email} · {activeMessage ? formatMessageDate(activeMessage.createdAt) : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-sm leading-6 text-foreground whitespace-pre-wrap">
            {activeMessage?.body}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
