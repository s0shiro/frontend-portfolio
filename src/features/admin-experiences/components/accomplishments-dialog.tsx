import { useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  Loader2,
  Pencil,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { Accomplishment, Experience } from '@/features/admin/types'
import {
  useAccomplishmentMutations,
  useAccomplishments,
} from '../hooks/use-accomplishments'

// Kept in sync with backend/src/lib/storage/appwrite.ts
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `"${file.name}" is not a supported image (JPEG, PNG, WebP, GIF or AVIF).`
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return `"${file.name}" is larger than ${MAX_IMAGE_BYTES / (1024 * 1024)}MB.`
  }

  return null
}

type AccomplishmentsDialogProps = {
  experience: Experience | null
  onOpenChange: (open: boolean) => void
}

export function AccomplishmentsDialog({
  experience,
  onOpenChange,
}: AccomplishmentsDialogProps) {
  const experienceId = experience?.id ?? null
  const { accomplishments, isLoading, isError, refetch } =
    useAccomplishments(experienceId)
  const { uploadMutation, updateMutation, deleteMutation, reorderMutation } =
    useAccomplishmentMutations(experienceId)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [captionDraft, setCaptionDraft] = useState('')

  function handleOpenChange(open: boolean) {
    if (!open) {
      setEditingId(null)
      setCaptionDraft('')
      setIsDragging(false)
    }

    onOpenChange(open)
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return

    const files = Array.from(fileList)

    // Upload sequentially so orderIndex stays deterministic on the server.
    for (const file of files) {
      const validationError = validateFile(file)

      if (validationError) {
        toast.error(validationError)
        continue
      }

      try {
        await uploadMutation.mutateAsync({ file })
        toast.success(`Uploaded ${file.name}`)
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : `Failed to upload ${file.name}`,
        )
      }
    }
  }

  function startEditing(accomplishment: Accomplishment) {
    setEditingId(accomplishment.id)
    setCaptionDraft(accomplishment.caption ?? '')
  }

  function saveCaption(id: string) {
    updateMutation.mutate(
      { id, data: { caption: captionDraft.trim() || null } },
      {
        onSuccess: () => {
          toast.success('Caption saved')
          setEditingId(null)
        },
        onError: (error) =>
          toast.error(error instanceof Error ? error.message : 'Failed to save caption'),
      },
    )
  }

  function handleDelete(accomplishment: Accomplishment) {
    deleteMutation.mutate(accomplishment.id, {
      onSuccess: () => toast.success('Image removed'),
      onError: (error) =>
        toast.error(error instanceof Error ? error.message : 'Failed to remove image'),
    })
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= accomplishments.length) return

    const reordered = [...accomplishments]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(target, 0, moved)

    reorderMutation.mutate(
      reordered.map((item, position) => ({ id: item.id, orderIndex: position })),
      {
        onError: (error) =>
          toast.error(error instanceof Error ? error.message : 'Failed to reorder'),
      },
    )
  }

  return (
    <Dialog open={!!experience} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Accomplishment images</DialogTitle>
          <DialogDescription>
            {experience
              ? `Certificates, screenshots and proof of work for ${experience.role} at ${experience.company}. These appear on the public about page.`
              : null}
          </DialogDescription>
        </DialogHeader>

        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              fileInputRef.current?.click()
            }
          }}
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setIsDragging(false)
            void handleFiles(event.dataTransfer.files)
          }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border/70 hover:border-border hover:bg-muted/40',
          )}
        >
          {uploadMutation.isPending ? (
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          ) : (
            <UploadCloud className="size-6 text-muted-foreground" />
          )}
          <p className="text-sm font-medium text-foreground">
            {uploadMutation.isPending ? 'Uploading…' : 'Drop images here or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WebP, GIF or AVIF · up to 5MB each
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            multiple
            className="hidden"
            onChange={(event) => {
              void handleFiles(event.target.files)
              event.target.value = ''
            }}
          />
        </div>

        <ScrollArea className="max-h-[22rem]">
          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-xl border border-border/60 bg-muted/50"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <AlertCircle className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Failed to load images.</p>
              <Button variant="outline" size="sm" onClick={() => void refetch()}>
                Try again
              </Button>
            </div>
          ) : accomplishments.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <ImagePlus className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No images yet. Upload your first accomplishment above.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 pr-3 sm:grid-cols-2">
              {accomplishments.map((accomplishment, index) => (
                <figure
                  key={accomplishment.id}
                  className="overflow-hidden rounded-xl border border-border/60 bg-card"
                >
                  <div className="relative aspect-video bg-muted/40">
                    <img
                      src={accomplishment.imageUrl}
                      alt={accomplishment.caption ?? 'Accomplishment image'}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                    <div className="absolute right-2 top-2 flex gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="size-7"
                        aria-label="Move earlier"
                        disabled={index === 0 || reorderMutation.isPending}
                        onClick={() => move(index, -1)}
                      >
                        <ArrowLeft className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="size-7"
                        aria-label="Move later"
                        disabled={
                          index === accomplishments.length - 1 || reorderMutation.isPending
                        }
                        onClick={() => move(index, 1)}
                      >
                        <ArrowRight className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="size-7"
                        aria-label="Delete image"
                        disabled={deleteMutation.isPending}
                        onClick={() => handleDelete(accomplishment)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  <figcaption className="flex items-center gap-2 p-3">
                    {editingId === accomplishment.id ? (
                      <>
                        <Input
                          autoFocus
                          value={captionDraft}
                          maxLength={280}
                          placeholder="Describe this accomplishment"
                          onChange={(event) => setCaptionDraft(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault()
                              saveCaption(accomplishment.id)
                            }

                            if (event.key === 'Escape') {
                              setEditingId(null)
                            }
                          }}
                          className="h-8 text-sm"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="size-8 shrink-0"
                          aria-label="Save caption"
                          disabled={updateMutation.isPending}
                          onClick={() => saveCaption(accomplishment.id)}
                        >
                          <Check className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="size-8 shrink-0"
                          aria-label="Cancel"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="size-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <p
                          className={cn(
                            'flex-1 truncate text-sm',
                            accomplishment.caption
                              ? 'text-foreground'
                              : 'text-muted-foreground italic',
                          )}
                        >
                          {accomplishment.caption ?? 'No caption'}
                        </p>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="size-8 shrink-0"
                          aria-label="Edit caption"
                          onClick={() => startEditing(accomplishment)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                      </>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
