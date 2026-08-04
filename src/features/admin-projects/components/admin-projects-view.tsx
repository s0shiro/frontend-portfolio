import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, FolderKanban, ImageIcon, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { AdminEmptyState, AdminLoadingState, AdminPageHeader } from '@/features/admin/components/admin-page'
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
import { useAdminProjects } from '../hooks/use-admin-projects'
import { useProjectMutations } from '../hooks/use-project-mutations'
import { ProjectFormDialog } from './project-form-dialog'
import { ProjectCoverDialog } from './project-cover-dialog'
import type { AdminProjectFormValues } from '../types'
import type { Project } from '@/features/admin/types'
import { toast } from 'sonner'

export function AdminProjectsView() {
  const { projects, isLoading } = useAdminProjects()
  const { createMutation, updateMutation, deleteMutation } = useProjectMutations()

  const [formOpen, setFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [coverTarget, setCoverTarget] = useState<Project | null>(null)

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
    <div className="space-y-12">
      <AdminPageHeader
        eyebrow="Projects"
        title="Curate project content"
        description="Manage featured work, descriptions, tags, and ordering for the public portfolio pages."
        action={(
          <Button type="button" onClick={openCreate}>
            <Plus className="size-4" />
            New project
          </Button>
        )}
      />

      {isLoading ? (
        <AdminLoadingState description="Loading projects..." />
      ) : projects.length === 0 ? (
        <AdminEmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Add your first project and it will appear on the public projects page."
        />
      ) : (
        <div className="border-t border-border/60">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className="grid gap-x-6 gap-y-3 border-b border-border/60 py-6 md:grid-cols-[3rem_1fr_auto]"
            >
              <div className="space-y-2">
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {String(project.orderIndex).padStart(2, '0')}
                </span>
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt=""
                    aria-hidden
                    className="aspect-video w-12 border border-border/70 object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-foreground">
                  {project.title}
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${project.title}`}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : null}
                </h2>

                <p className="max-w-xl pt-1.5 text-sm leading-6 text-muted-foreground">
                  {project.description}
                </p>

                {project.tags.length > 0 ? (
                  <ul className="flex flex-wrap gap-x-3 gap-y-1 pt-3">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="font-mono text-[0.6875rem] text-muted-foreground before:mr-1.5 before:text-border before:content-['/']"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="flex items-start justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="icon" />}>
                    <MoreVertical className="size-4" />
                    <span className="sr-only">Actions for {project.title}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(project)}>
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCoverTarget(project)}>
                      <ImageIcon className="mr-2 size-4" />
                      Cover image
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteTarget(project)} className="text-destructive">
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

      <ProjectFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        project={editingProject}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <ProjectCoverDialog
        // Read the live row so the preview refreshes after an upload.
        project={coverTarget ? (projects.find((p) => p.id === coverTarget.id) ?? coverTarget) : null}
        onOpenChange={(open) => !open && setCoverTarget(null)}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              Delete &ldquo;{deleteTarget?.title}&rdquo;? This removes it from the public
              portfolio and cannot be undone.
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
