import { z } from 'zod'

export const adminProjectFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  link: z.string().optional(),
  imageUrl: z.string().optional(),
  tags: z.string().optional().default(''),
})