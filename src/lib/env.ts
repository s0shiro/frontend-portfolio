import { z } from 'zod'

const clientEnvSchema = z.object({
  VITE_API_URL: z.string().url().transform((url) => url.replace(/\/$/, '')),
})

const parseResult = clientEnvSchema.safeParse(import.meta.env)

if (!parseResult.success) {
  const errors = parseResult.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ')

  throw new Error(`Invalid frontend environment variables: ${errors}`)
}

export const clientEnv = parseResult.data
