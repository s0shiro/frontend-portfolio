import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { ImageOff, Loader2, UploadCloud } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Project } from '@/features/admin/types'
import { useProjectImage } from '../hooks/use-project-image'

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

type ProjectCoverDialogProps = {
  project: Project | null
  onOpenChange: (open: boolean) => void
}

export function ProjectCoverDialog({ project, onOpenChange }: ProjectCoverDialogProps) {
  const { uploadMutation, clearMutation } = useProjectImage(project?.id ?? null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleOpenChange(open: boolean) {
    if (!open) setIsDragging(false)
    onOpenChange(open)
  }

  function handleFile(fileList: FileList | null) {
    const file = fileList?.[0]
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      toast.error(validationError)
      return
    }

    uploadMutation.mutate(file, {
      onSuccess: () => toast.success('Cover image updated'),
      onError: (error) =>
        toast.error(error instanceof Error ? error.message : 'Failed to upload cover'),
    })
  }

  function handleClear() {
    clearMutation.mutate(undefined, {
      onSuccess: () => toast.success('Cover image removed'),
      onError: (error) =>
        toast.error(error instanceof Error ? error.message : 'Failed to remove cover'),
    })
  }

  const isBusy = uploadMutation.isPending || clearMutation.isPending

  return (
    <Dialog open={!!project} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cover image</DialogTitle>
          <DialogDescription>
            {project
              ? `Shown beside ${project.title} on the public projects page. One image per project.`
              : null}
          </DialogDescription>
        </DialogHeader>

        {project?.imageUrl ? (
          <figure className="overflow-hidden border border-border/70 bg-muted/30">
            <img
              src={project.imageUrl}
              alt={`Cover for ${project.title}`}
              className="aspect-video w-full object-cover"
            />
          </figure>
        ) : null}

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
            handleFile(event.dataTransfer.files)
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
            {uploadMutation.isPending
              ? 'Uploading…'
              : project?.imageUrl
                ? 'Drop a new image to replace it'
                : 'Drop an image here or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WebP, GIF or AVIF · up to 5MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            className="hidden"
            onChange={(event) => {
              handleFile(event.target.files)
              event.target.value = ''
            }}
          />
        </div>

        {project?.imageUrl ? (
          <Button
            type="button"
            variant="outline"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={isBusy}
            onClick={handleClear}
          >
            <ImageOff className="size-4" />
            {clearMutation.isPending ? 'Removing…' : 'Remove cover image'}
          </Button>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
