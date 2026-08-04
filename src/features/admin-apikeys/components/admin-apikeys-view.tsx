import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Key, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminPageHeader,
  AdminStatus,
} from '@/features/admin/components/admin-page'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
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
      <DialogTrigger className={cn(buttonVariants(), 'gap-2')}>
        <Plus className="size-4" />
        Generate token
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate a token</DialogTitle>
          <DialogDescription>
            Creates a permanent token for API access. Copy it now — it is shown once.
          </DialogDescription>
        </DialogHeader>

        {createdKey ? (
          <div className="space-y-3 py-2">
            <p className="text-sm text-destructive">
              Copy this token now. You will not be able to see it again.
            </p>
            <div className="flex gap-2">
              <Input readOnly value={createdKey} className="font-mono text-sm" />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                aria-label="Copy API token"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 py-2">
            <Label htmlFor="key-name">Token name</Label>
            <Input
              id="key-name"
              placeholder="e.g. MCP server token"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
          </div>
        )}

        <DialogFooter>
          {createdKey ? (
            <Button onClick={() => handleCloseDialog(false)}>Done</Button>
          ) : (
            <Button onClick={handleCreate} disabled={!newKeyName.trim() || createApiKey.isPending}>
              {createApiKey.isPending ? 'Generating...' : 'Generate token'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-12">
      <AdminPageHeader
        eyebrow="API keys"
        title="System access tokens"
        description="Permanent tokens for trusted integrations such as MCP servers or bots."
        action={createDialog}
      />

      {error ? <AdminErrorState description={error.message} /> : null}

      {isLoading ? (
        <AdminLoadingState description="Loading keys..." />
      ) : !apiKeys || apiKeys.length === 0 ? (
        <AdminEmptyState
          icon={Key}
          title="No API keys yet"
          description="Generate a token to connect a trusted integration."
        />
      ) : (
        <div className="border-t border-border/60">
          {apiKeys.map((apiKey) => (
            <motion.article
              key={apiKey.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-x-6 gap-y-2 border-b border-border/60 py-5 md:grid-cols-[1fr_auto] md:items-center"
            >
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h2 className="font-display text-base font-semibold tracking-tight text-foreground">
                    {apiKey.name || 'Unnamed key'}
                  </h2>
                  <AdminStatus
                    label={apiKey.enabled ? 'Active' : 'Disabled'}
                    tone={apiKey.enabled ? 'active' : 'neutral'}
                  />
                </div>

                <p className="font-mono text-xs text-muted-foreground">
                  {apiKey.start ? `${apiKey.start}••••••••` : `${apiKey.id.slice(0, 8)}...`}
                  <span className="px-2 text-border">·</span>
                  created {new Date(apiKey.createdAt).toLocaleDateString()}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                aria-label={`Revoke ${apiKey.name || 'unnamed key'}`}
                className="justify-self-start text-destructive hover:bg-destructive/10 hover:text-destructive md:justify-self-end"
                onClick={() => setRevokeTargetId(apiKey.id)}
                disabled={deleteApiKey.isPending}
              >
                <Trash2 className="size-4" />
                Revoke
              </Button>
            </motion.article>
          ))}
        </div>
      )}

      <Dialog open={revokeTargetId !== null} onOpenChange={(open) => !open && setRevokeTargetId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke this key</DialogTitle>
            <DialogDescription>
              Integrations using this key stop working immediately. This cannot be undone.
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
              Revoke key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
