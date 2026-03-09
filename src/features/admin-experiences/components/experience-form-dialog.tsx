import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import type { AdminExperienceFormValues } from '../types'
import type { Experience } from '@/features/admin/types'

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'] as const

const experienceFormSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  employmentType: z.string().optional(),
  skills: z.string().optional(),
})

type ExperienceFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: AdminExperienceFormValues) => void
  experience?: Experience | null
  isPending?: boolean
}

export function ExperienceFormDialog({
  open,
  onOpenChange,
  onSubmit,
  experience,
  isPending,
}: ExperienceFormDialogProps) {
  const isEditing = !!experience
  const form = useForm<AdminExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      company: '',
      role: '',
      description: '',
      startDate: '',
      endDate: '',
      employmentType: '',
      skills: '',
    },
  })

  useEffect(() => {
    if (experience) {
      form.reset({
        company: experience.company,
        role: experience.role,
        description: experience.description,
        startDate: experience.startDate.slice(0, 10),
        endDate: experience.endDate?.slice(0, 10) ?? '',
        employmentType: experience.employmentType ?? '',
        skills: (experience.skills ?? []).join(', '),
      })
    } else {
      form.reset({ company: '', role: '', description: '', startDate: '', endDate: '', employmentType: '', skills: '' })
    }
  }, [experience, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Experience' : 'New Experience'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the experience details below.' : 'Fill in the details to add a new experience.'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <Controller
            name="company"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Company</FieldLabel>
                <Input {...field} placeholder="Company name" />
                <FieldError errors={fieldState.error ? [{ message: fieldState.error.message }] : []} />
              </Field>
            )}
          />

          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Role</FieldLabel>
                <Input {...field} placeholder="Job title" />
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
                <Textarea {...field} placeholder="What did you do? (supports markdown)" rows={3} />
                <FieldError errors={fieldState.error ? [{ message: fieldState.error.message }] : []} />
              </Field>
            )}
          />

          <Controller
            name="employmentType"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Employment Type</FieldLabel>
                <select
                  {...field}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select type...</option>
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
            )}
          />

          <Controller
            name="skills"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Skills</FieldLabel>
                <Input {...field} placeholder="React, TypeScript, Agile (comma-separated)" />
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="startDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Start Date</FieldLabel>
                  <Input {...field} type="date" />
                  <FieldError errors={fieldState.error ? [{ message: fieldState.error.message }] : []} />
                </Field>
              )}
            />
            <Controller
              name="endDate"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>End Date</FieldLabel>
                  <Input {...field} type="date" />
                </Field>
              )}
            />
          </div>

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
