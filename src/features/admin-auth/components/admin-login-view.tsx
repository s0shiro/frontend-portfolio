import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, useReducedMotion } from 'framer-motion'
import { z } from 'zod'
import { useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAdminSignIn } from '../hooks/use-admin-sign-in'
// --- ReactBits Aurora background ---
import PixelBlast from '@/components/reactbits/pixel-blast'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type LoginValues = z.infer<typeof loginSchema>

export function AdminLoginView() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const prefersReducedMotion = useReducedMotion()
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
    <div className="relative flex h-screen w-screen overflow-hidden bg-background">
      {/* Left: Animated PixelBlast background (static gradient fallback when reduced motion is preferred) */}
      <div className="hidden md:flex w-1/2 h-full items-center justify-center bg-background/90">
        {prefersReducedMotion ? (
          <div
            aria-hidden="true"
            className="h-full w-full bg-gradient-to-br from-primary/15 via-background to-accent/20"
          />
        ) : (
          <PixelBlast
            variant="square"
            pixelSize={4}
            color="#B19EEF"
            patternScale={2}
            patternDensity={1}
            pixelSizeJitter={0}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid={false}
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.5}
            edgeFade={0.25}
            transparent
            className="w-full h-full"
          />
        )}
      </div>
      {/* Right: Login form */}
      <div className="flex w-full md:w-1/2 h-full items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          <div className="bg-background/80 backdrop-blur-md shadow-2xl rounded-2xl px-6 py-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold tracking-tighter text-foreground mb-1">Welcome back</h2>
              <p className="text-muted-foreground text-sm">Sign in to the admin panel.</p>
            </div>
            {/* Root auth error — styled alert */}
            {form.formState.errors.root && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{form.formState.errors.root.message}</span>
              </div>
            )}
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Email Field */}
              <Field data-invalid={!!form.formState.errors.email} className="bg-transparent p-0 border-none">
                <FieldLabel className="text-sm text-muted-foreground mb-1">Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  {...form.register('email')}
                  className="bg-background/60 border-none shadow-none focus-visible:ring-2 focus-visible:ring-primary/60 text-foreground"
                />
                <FieldError errors={form.formState.errors.email ? [{ message: form.formState.errors.email.message }] : []} />
              </Field>
              {/* Password Field */}
              <Field data-invalid={!!form.formState.errors.password} className="bg-transparent p-0 border-none">
                <FieldLabel className="text-sm text-muted-foreground mb-1">Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    autoComplete="current-password"
                    {...form.register('password')}
                    className="bg-background/60 border-none shadow-none focus-visible:ring-2 focus-visible:ring-primary/60 text-foreground pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FieldError errors={form.formState.errors.password ? [{ message: form.formState.errors.password.message }] : []} />
              </Field>
              {/* Submit Button */}
              <motion.div whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button className="w-full font-bold tracking-tight text-base py-2 bg-primary text-background rounded-lg shadow-none border-none" type="submit" disabled={isPending}>
                  {isPending ? 'Continue...' : 'Continue'}
                </Button>
              </motion.div>
            </form>
            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
              <span>Restricted area — authorized access only.</span>
            </div>
            <div className="mt-4 text-center">
              <button
                type="button"
                className="rounded-sm text-xs font-medium text-primary/80 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                onClick={() => navigate({ to: '/' })}
              >
                &larr; Back to Home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
