import { useState } from 'react'
import { motion } from 'framer-motion'
import { Key, Plus, Trash2, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useApiKeys, useCreateApiKey, useDeleteApiKey } from '../api/use-admin-apikeys'

export function AdminApiKeysView() {
  const { data: apiKeys, isLoading, error } = useApiKeys()
  const createApiKey = useCreateApiKey()
  const deleteApiKey = useDeleteApiKey()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

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

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">API Keys</p>
          <h1 className="text-4xl font-bold tracking-tighter">System Access Tokens</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage permanent Personal Access Tokens for system integrations (like MCP servers or bots).
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <div className="inline-flex">
            <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
              <Plus className="h-4 w-4" />
              Generate Token
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New API Token</DialogTitle>
              <DialogDescription>
                Create a permanent token for API access. This token will not expire.
              </DialogDescription>
            </DialogHeader>

            {createdKey ? (
              <div className="space-y-4 py-4">
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm font-medium mb-2 text-destructive">
                    Make sure to copy your personal access token now. You won't be able to see it again!
                  </p>
                  <div className="flex gap-2">
                    <Input readOnly value={createdKey} className="font-mono text-sm" />
                    <Button variant="outline" size="icon" onClick={handleCopy}>
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
      </section>

      {error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-6 text-sm text-destructive">{error.message}</CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-muted-foreground text-sm col-span-full">Loading keys...</p>
        ) : !apiKeys || apiKeys.length === 0 ? (
          <Card className="col-span-full border-dashed border-border/50 bg-transparent">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Key className="mb-4 h-8 w-8 opacity-20" />
              <p>No API key generated yet.</p>
              <p className="text-sm">Click the button above to create one.</p>
            </CardContent>
          </Card>
        ) : (
          apiKeys.map((apiKey) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={apiKey.id}
            >
              <Card className="flex h-full flex-col justify-between overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold truncate pr-4">
                      {apiKey.name || 'Unnamed Key'}
                    </CardTitle>
                    <Badge variant={apiKey.enabled ? "default" : "secondary"}>
                      {apiKey.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                  <CardDescription className="font-mono text-xs mt-1">
                    {apiKey.start ? `${apiKey.start}••••••••` : `${apiKey.id.slice(0, 8)}...`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 flex items-end justify-between mt-auto">
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                    onClick={() => {
                      if (confirm('Are you sure you want to revoke this key?')) {
                        deleteApiKey.mutate(apiKey.id)
                      }
                    }}
                    disabled={deleteApiKey.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
