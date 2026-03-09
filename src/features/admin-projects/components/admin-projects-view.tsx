import { useState } from 'react'
import { motion } from 'framer-motion'
import { FolderKanban, GripVertical, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react'
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
import { useAdminProjects } from '../hooks/use-admin-projects'
import { useProjectMutations } from '../hooks/use-project-mutations'
import { ProjectFormDialog } from './project-form-dialog'
import type { AdminProjectFormValues } from '../types'
import type { Project } from '@/features/admin/types'
import { toast } from 'sonner'

export function AdminProjectsView() {
  const { projects, isLoading } = useAdminProjects()
  const { createMutation, updateMutation, deleteMutation } = useProjectMutations()

  const [formOpen, setFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  function openCreate() {
    setEditingProject(null)
    setFormOpen(true)
  }

  function openEdit(project: Project) {
    setEditingProject(project)
    setFormOpen(true)
  }

  function handleFormSubmit(values: AdminProjectFormValues) {
    const tags = values.tags
      ? values.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : []

    if (editingProject) {
      updateMutation.mutate(
        { id: editingProject.id, data: { ...values, tags } },
        {
          onSuccess: () => {
            toast.success('Project updated')
            setFormOpen(false)
          },
          onError: () => toast.error('Failed to update project'),
        },
      )
    } else {
      createMutation.mutate(
        { ...values, tags },
        {
          onSuccess: () => {
            toast.success('Project created')
            setFormOpen(false)
          },
          onError: () => toast.error('Failed to create project'),
        },
      )
    }
  }

  function handleDelete() {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Project deleted')
        setDeleteTarget(null)
      },
      onError: () => toast.error('Failed to delete project'),
    })
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Projects</p>
          <h1 className="text-4xl font-bold tracking-tighter">Curate project content</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage featured work, descriptions, tags, and ordering for the public portfolio pages.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          <Plus className="size-4" />
          New project
        </Button>
      </section>

      <div className="grid gap-4">
        {isLoading
          ? <Card className="border-border/60 bg-background/70 backdrop-blur-md"><CardContent className="py-8 text-sm text-muted-foreground">Loading projects...</CardContent></Card>
          : projects.length === 0
            ? <Card className="border-border/60 bg-background/70 backdrop-blur-md"><CardContent className="py-8 text-sm text-muted-foreground">No projects yet. Click "New project" to get started.</CardContent></Card>
            : projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
              >
                <Card className="border-border/60 bg-background/70 backdrop-blur-md">
                  <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2 text-xl tracking-tight">
                        <FolderKanban className="size-4" />
                        {project.title}
                      </CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Order {project.orderIndex}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="icon" />}>
                          <MoreVertical className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(project)}>
                            <Pencil className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteTarget(project)} className="text-destructive">
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
                  <CardContent className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      <ProjectFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        project={editingProject}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? This action cannot be undone.
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