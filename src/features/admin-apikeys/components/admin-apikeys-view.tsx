import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Key, Plus, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminEmptyState, AdminErrorState, AdminLoadingState, AdminPageHeader } from '@/features/admin/components/admin-page'
import { useApiKeys, useCreateApiKey, useDeleteApiKey } from '../api/use-admin-apikeys'

export function AdminApiKeysView() {
  const { data: apiKeys, isLoading, error } = useApiKeys()
  const createApiKey = useCreateApiKey()
  const deleteApiKey = useDeleteApiKey()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [revokeTargetId, setRevokeTargetId] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!newKeyName.trim()) return
    try {
      const data = await createApiKey.mutateAsync({ name: newKeyName })
      if (data && data.key) {
        setCreatedKey(data.key)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCopy = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      setIsDialogOpen(false)
      setTimeout(() => {
        setCreatedKey(null)
        setNewKeyName('')
      }, 300)
    } else {
      setIsDialogOpen(true)
    }
  }

  const createDialog = (
    <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4">
        <Plus className="h-4 w-4" />
        Generate token
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate New API Token</DialogTitle>
          <DialogDescription>
            Create a permanent token for API access. Copy it now; it will only be shown once.
          </DialogDescription>
        </DialogHeader>

        {createdKey ? (
          <div className="space-y-4 py-4">
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
              <p className="text-sm font-medium mb-2 text-destructive">
                Make sure to copy your personal access token now. You won't be able to see it again.
              </p>
              <div className="flex gap-2">
                <Input readOnly value={createdKey} className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy API token">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">Token Name</Label>
              <Input
                id="key-name"
                placeholder="e.g. MCP Server Token"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {createdKey ? (
            <Button onClick={() => handleCloseDialog(false)}>Done</Button>
          ) : (
            <Button onClick={handleCreate} disabled={!newKeyName.trim() || createApiKey.isPending}>
              {createApiKey.isPending ? 'Generating...' : 'Generate Token'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="API Keys"
        title="System access tokens"
        description="Manage permanent Personal Access Tokens for system integrations such as MCP servers or bots."
        action={createDialog}
      />

      {error ? <AdminErrorState description={error.message} /> : null}

      {isLoading ? (
        <AdminLoadingState description="Loading keys..." />
      ) : !apiKeys || apiKeys.length === 0 ? (
        <AdminEmptyState icon={Key} title="No API keys yet" description="Generate a token to connect a trusted integration." />
      ) : (
        <Card className="border-border/60 bg-background/70 backdrop-blur-md">
          <CardContent className="p-0">
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Token preview</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell className="font-medium text-foreground">{apiKey.name || 'Unnamed Key'}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {apiKey.start ? `${apiKey.start}••••••••` : `${apiKey.id.slice(0, 8)}...`}
                      </TableCell>
                      <TableCell>
                        <Badge variant={apiKey.enabled ? 'default' : 'secondary'}>
                          {apiKey.enabled ? 'Active' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(apiKey.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="Revoke API key"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setRevokeTargetId(apiKey.id)}
                          disabled={deleteApiKey.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="divide-y divide-border/50 md:hidden">
              {apiKeys.map((apiKey) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={apiKey.id}
                  className="space-y-3 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{apiKey.name || 'Unnamed Key'}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {apiKey.start ? `${apiKey.start}••••••••` : `${apiKey.id.slice(0, 8)}...`}
                      </p>
                    </div>
                    <Badge variant={apiKey.enabled ? 'default' : 'secondary'}>
                      {apiKey.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">Created {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label="Revoke API key"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setRevokeTargetId(apiKey.id)}
                      disabled={deleteApiKey.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                      Revoke
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={revokeTargetId !== null} onOpenChange={(open) => !open && setRevokeTargetId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke API Key</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The key will be permanently revoked and integrations using it will stop working.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeTargetId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (revokeTargetId) {
                  deleteApiKey.mutate(revokeTargetId)
                  setRevokeTargetId(null)
                }
              }}
            >
              Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
