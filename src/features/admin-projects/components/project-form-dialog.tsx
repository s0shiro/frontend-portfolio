import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { adminProjectFormSchema } from '../utils/project-form'
import type { AdminProjectFormValues } from '../types'
import type { Project } from '@/features/admin/types'

type ProjectFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: AdminProjectFormValues) => void
  project?: Project | null
  isPending?: boolean
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  onSubmit,
  project,
  isPending,
}: ProjectFormDialogProps) {
  const isEditing = !!project
  const form = useForm<AdminProjectFormValues>({
    resolver: zodResolver(adminProjectFormSchema),
    defaultValues: {
      title: '',
      description: '',
      link: '',
      tags: '',
    },
  })

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        description: project.description,
        link: project.link ?? '',
        tags: project.tags.join(', '),
      })
    } else {
      form.reset({ title: '', description: '', link: '', tags: '' })
    }
  }, [project, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Project' : 'New Project'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the project details below.' : 'Fill in the details to create a new project.'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Title</FieldLabel>
                <Input {...field} placeholder="Project title" />
                <FieldError errors={fieldState.error ? [{ message: fieldState.error.message }] : []} />
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Description</FieldLabel>
                <Textarea {...field} placeholder="Short description" rows={3} />
                <FieldError errors={fieldState.error ? [{ message: fieldState.error.message }] : []} />
              </Field>
            )}
          />

          {/* Cover image is uploaded separately via the row's "Cover image" action,
              which needs an existing project id to attach the file to. */}
          <Controller
            name="link"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Link</FieldLabel>
                <Input {...field} placeholder="https://..." />
              </Field>
            )}
          />

          <Controller
            name="tags"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Tags (comma-separated)</FieldLabel>
                <Input {...field} placeholder="React, TypeScript, Tailwind" />
              </Field>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
