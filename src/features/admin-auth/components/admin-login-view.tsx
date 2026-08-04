import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAdminSignIn } from '../hooks/use-admin-sign-in'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type LoginValues = z.infer<typeof loginSchema>

export function AdminLoginView() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { mutateAsync: signInEmail, isPending } = useAdminSignIn()
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginValues) {
    try {
      await signInEmail({
        email: values.email,
        password: values.password,
      })
      navigate({ to: '/admin' })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in'
      form.setError('root', { message: errorMessage })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <div className="py-8">
            <div className="mb-8">
              <p className="eyebrow">Console</p>
              <h2 className="display-lg pt-2 text-foreground">Sign in</h2>
              <p className="pt-2 text-sm text-muted-foreground">
                Portfolio administration. Authorized access only.
              </p>
            </div>

            {form.formState.errors.root && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2 border-y border-destructive/40 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{form.formState.errors.root.message}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <Field data-invalid={!!form.formState.errors.email} className="border-none bg-transparent p-0">
                <FieldLabel className="eyebrow mb-2">Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...form.register('email')}
                  className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:border-violet-500 focus-visible:ring-0 dark:bg-transparent"
                />
                <FieldError errors={form.formState.errors.email ? [{ message: form.formState.errors.email.message }] : []} />
              </Field>

              <Field data-invalid={!!form.formState.errors.password} className="border-none bg-transparent p-0">
                <FieldLabel className="eyebrow mb-2">Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...form.register('password')}
                    className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 pr-10 shadow-none focus-visible:border-violet-500 focus-visible:ring-0 dark:bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FieldError errors={form.formState.errors.password ? [{ message: form.formState.errors.password.message }] : []} />
              </Field>

              <Button className="h-11 w-full" type="submit" disabled={isPending}>
                {isPending ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-border/60 pt-5">
              <span className="flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
                Restricted
              </span>
              <button
                type="button"
                className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => navigate({ to: '/' })}
              >
                &larr; Back to portfolio
              </button>
            </div>
        </div>
      </motion.div>
    </div>
  )
}
