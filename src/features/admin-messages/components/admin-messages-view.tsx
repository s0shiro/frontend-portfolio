import { Inbox, Search, Trash2, Archive, MailCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAdminMessages } from '../hooks/use-admin-messages'

export function AdminMessagesView() {
  const { filters, setFilters, messages, selectedIds, isLoading, toggleSelection, applyBulkAction } = useAdminMessages()

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Messages</p>
        <h1 className="text-4xl font-bold tracking-tighter">Inbox operations</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Filter inquiries, search by sender, and apply bulk actions for triage workflows.
        </p>
      </section>

      <Card className="border-border/60 bg-background/70 backdrop-blur-md">
        <CardContent className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <Search className="size-4 text-muted-foreground" />
            <Input
              value={filters.query}
              onChange={(event) => setFilters((currentFilters) => ({ ...currentFilters, query: event.target.value }))}
              placeholder="Search by sender, email, or content"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'unread', 'read'] as const).map((status) => (
              <Button
                key={status}
                type="button"
                variant={filters.status === status ? 'default' : 'outline'}
                onClick={() => setFilters((currentFilters) => ({ ...currentFilters, status }))}
              >
                {status}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" disabled={selectedIds.length === 0} onClick={() => applyBulkAction('read')}>
          <MailCheck className="size-4" />
          Mark read
        </Button>
        <Button type="button" variant="outline" disabled={selectedIds.length === 0} onClick={() => applyBulkAction('archive')}>
          <Archive className="size-4" />
          Archive
        </Button>
        <Button type="button" variant="destructive" disabled={selectedIds.length === 0} onClick={() => applyBulkAction('delete')}>
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <Card className="border-border/60 bg-background/70 backdrop-blur-md">
            <CardContent className="py-8 text-sm text-muted-foreground">Loading inbox...</CardContent>
          </Card>
        ) : messages.map((message) => (
          <Card key={message.id} className="border-border/60 bg-background/70 backdrop-blur-md">
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xl tracking-tight">
                  <Inbox className="size-4" />
                  {message.name}
                </CardTitle>
                <CardDescription>{message.email}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(message.id)}
                  onChange={() => toggleSelection(message.id)}
                  aria-label={`Select message from ${message.name}`}
                />
                <Badge variant={message.isRead ? 'outline' : 'secondary'}>
                  {message.isRead ? 'Read' : 'Unread'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">{message.body}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}