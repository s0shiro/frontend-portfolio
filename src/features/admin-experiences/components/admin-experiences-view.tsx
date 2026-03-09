import { useState } from 'react'
import { motion } from 'framer-motion'
import { BriefcaseBusiness, GripVertical, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import type { AdminExperienceFormValues } from '../types'
import type { Experience } from '@/features/admin/types'
import { toast } from 'sonner'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
}

export function AdminExperiencesView() {
  const { experiences, isLoading } = useAdminExperiences()
  const { createMutation, updateMutation, deleteMutation } = useExperienceMutations()

  const [formOpen, setFormOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null)

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
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Experiences</p>
          <h1 className="text-4xl font-bold tracking-tighter">Shape the timeline</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Maintain experience entries, chronology, and narrative summaries for the about page timeline.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          <Plus className="size-4" />
          New experience
        </Button>
      </section>

      <div className="grid gap-4">
        {isLoading ? (
          <Card className="border-border/60 bg-background/70 backdrop-blur-md">
            <CardContent className="py-8 text-sm text-muted-foreground">Loading experiences...</CardContent>
          </Card>
        ) : experiences.length === 0 ? (
          <Card className="border-border/60 bg-background/70 backdrop-blur-md">
            <CardContent className="py-8 text-sm text-muted-foreground">
              No experiences yet. Click &ldquo;New experience&rdquo; to get started.
            </CardContent>
          </Card>
        ) : (
          experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
            >
              <Card className="border-border/60 bg-background/70 backdrop-blur-md">
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-xl tracking-tight">
                      <BriefcaseBusiness className="size-4" />
                      {exp.role}
                    </CardTitle>
                    <CardDescription>
                      {exp.company} &middot; {formatDate(exp.startDate)}&ndash;{exp.endDate ? formatDate(exp.endDate) : 'Present'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {exp.employmentType && <Badge variant="secondary">{exp.employmentType}</Badge>}
                    <Badge variant="outline">Order {exp.orderIndex}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="icon" />}>
                        <MoreVertical className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(exp)}>
                          <Pencil className="mr-2 size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteTarget(exp)} className="text-destructive">
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button type="button" variant="ghost" size="icon">
                      <GripVertical className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                  <p>{exp.description}</p>
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {exp.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="font-mono text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <ExperienceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        experience={editingExperience}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete experience</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the &ldquo;{deleteTarget?.role}&rdquo; role at {deleteTarget?.company}? This action cannot be undone.
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