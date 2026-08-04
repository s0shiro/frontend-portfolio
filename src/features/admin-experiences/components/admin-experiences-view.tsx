import { useState } from 'react'
import { motion } from 'framer-motion'
import { BriefcaseBusiness, Images, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { AdminEmptyState, AdminLoadingState, AdminPageHeader, AdminStatus } from '@/features/admin/components/admin-page'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useAdminExperiences } from '../hooks/use-admin-experiences'
import { useExperienceMutations } from '../hooks/use-experience-mutations'
import { ExperienceFormDialog } from './experience-form-dialog'
import { AccomplishmentsDialog } from './accomplishments-dialog'
import type { AdminExperienceFormValues } from '../types'
import type { Experience } from '@/features/admin/types'
import { toast } from 'sonner'

function formatPeriod(startDate: string, endDate: string | null) {
  const format = (value: string) => {
    const date = new Date(value)
    return `${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
  }

  return endDate ? `${format(startDate)} — ${format(endDate)}` : `${format(startDate)} — NOW`
}

export function AdminExperiencesView() {
  const { experiences, isLoading } = useAdminExperiences()
  const { createMutation, updateMutation, deleteMutation } = useExperienceMutations()

  const [formOpen, setFormOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null)
  const [imagesTarget, setImagesTarget] = useState<Experience | null>(null)

  function openCreate() {
    setEditingExperience(null)
    setFormOpen(true)
  }

  function openEdit(exp: Experience) {
    setEditingExperience(exp)
    setFormOpen(true)
  }

  function handleFormSubmit(values: AdminExperienceFormValues) {
    const payload = {
      company: values.company,
      role: values.role,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate || null,
      employmentType: values.employmentType || undefined,
      skills: values.skills
        ? values.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined,
    }

    if (editingExperience) {
      updateMutation.mutate(
        { id: editingExperience.id, data: payload },
        {
          onSuccess: () => {
            toast.success('Experience updated')
            setFormOpen(false)
          },
          onError: () => toast.error('Failed to update experience'),
        },
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Experience created')
          setFormOpen(false)
        },
        onError: () => toast.error('Failed to create experience'),
      })
    }
  }

  function handleDelete() {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Experience deleted')
        setDeleteTarget(null)
      },
      onError: () => toast.error('Failed to delete experience'),
    })
  }

  return (
    <div className="space-y-12">
      <AdminPageHeader
        eyebrow="Experiences"
        title="Shape the timeline"
        description="Maintain roles, chronology, skills, and the accomplishment images shown on the about page."
        action={(
          <Button type="button" onClick={openCreate}>
            <Plus className="size-4" />
            New experience
          </Button>
        )}
      />

      {isLoading ? (
        <AdminLoadingState description="Loading experiences..." />
      ) : experiences.length === 0 ? (
        <AdminEmptyState
          icon={BriefcaseBusiness}
          title="No experiences yet"
          description="Add a role and it will appear on the public experience record."
        />
      ) : (
        <div className="border-t border-border/60">
          {experiences.map((exp, index) => (
            <motion.article
              key={exp.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className="grid gap-x-6 gap-y-3 border-b border-border/60 py-6 md:grid-cols-[8.5rem_1fr_auto]"
            >
              <div className="flex items-baseline gap-3 md:flex-col md:gap-1">
                <p className="font-mono text-xs tabular-nums text-foreground">
                  {formatPeriod(exp.startDate, exp.endDate)}
                </p>
                {exp.employmentType ? (
                  <p className="font-mono text-[0.6875rem] text-muted-foreground">
                    {exp.employmentType}
                  </p>
                ) : null}
                {!exp.endDate ? <AdminStatus label="Current" tone="active" /> : null}
              </div>

              <div className="min-w-0">
                <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
                  {exp.role}
                </h2>
                <p className="font-mono text-xs text-muted-foreground">{exp.company}</p>

                <p className="max-w-xl pt-2 text-sm leading-6 text-muted-foreground">
                  {exp.description}
                </p>

                {exp.skills && exp.skills.length > 0 ? (
                  <ul className="flex flex-wrap gap-x-3 gap-y-1 pt-3">
                    {exp.skills.map((skill) => (
                      <li
                        key={skill}
                        className="font-mono text-[0.6875rem] text-muted-foreground before:mr-1.5 before:text-border before:content-['/']"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <button
                  type="button"
                  onClick={() => setImagesTarget(exp)}
                  className="mt-4 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  <Images className="size-3.5" />
                  Manage images
                </button>
              </div>

              <div className="flex items-start justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="icon" />}>
                    <MoreVertical className="size-4" />
                    <span className="sr-only">Actions for {exp.role}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(exp)}>
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setImagesTarget(exp)}>
                      <Images className="mr-2 size-4" />
                      Manage images
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteTarget(exp)} className="text-destructive">
                      <Trash2 className="mr-2 size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <ExperienceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        experience={editingExperience}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <AccomplishmentsDialog
        experience={imagesTarget}
        onOpenChange={(open) => !open && setImagesTarget(null)}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete experience</DialogTitle>
            <DialogDescription>
              Delete the &ldquo;{deleteTarget?.role}&rdquo; role at {deleteTarget?.company}? Any
              uploaded accomplishment images go with it. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
