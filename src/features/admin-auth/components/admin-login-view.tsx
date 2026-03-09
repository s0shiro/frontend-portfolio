import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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
      // handle error display as needed
      console.error(error)
    }
  }

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-background">
      {/* Left: Animated PixelBlast background */}
      <div className="hidden md:flex w-1/2 h-full items-center justify-center bg-background/90">
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
              <p className="text-muted-foreground text-sm">Please log in to continue.</p>
            </div>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Email Field */}
              <Field data-invalid={!!form.formState.errors.email} className="bg-transparent p-0 border-none">
                <FieldLabel className="text-sm text-muted-foreground mb-1">Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="Email"
                  {...form.register('email')}
                  className="bg-background/60 border-none shadow-none focus:ring-2 focus:ring-primary/60 text-foreground"
                />
                <FieldError errors={form.formState.errors.email ? [{ message: form.formState.errors.email.message }] : []} />
              </Field>
              {/* Password Field */}
              <Field data-invalid={!!form.formState.errors.password} className="bg-transparent p-0 border-none">
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-sm text-muted-foreground mb-1">Password</FieldLabel>
                  <a href="#" className="text-xs font-medium text-primary/80 hover:underline hover:text-primary transition-colors">Forgot your password?</a>
                </div>
                <Input
                  type="password"
                  placeholder="Password"
                  {...form.register('password')}
                  className="bg-background/60 border-none shadow-none focus:ring-2 focus:ring-primary/60 text-foreground"
                />
                <FieldError errors={form.formState.errors.password ? [{ message: form.formState.errors.password.message }] : []} />
              </Field>
              <FieldError errors={form.formState.errors.root ? [{ message: form.formState.errors.root.message }] : []} />
              {/* Submit Button */}
              <motion.div whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button className="w-full font-bold tracking-tight text-base py-2 bg-primary text-background rounded-lg shadow-none border-none" type="submit" disabled={isPending}>
                  {isPending ? 'Continue...' : 'Continue'}
                </Button>
              </motion.div>
            </form>
            <div className="mt-6 text-center text-xs text-muted-foreground">
              Forgot your password? <a href="#" className="text-primary underline">Reset Your Password</a>
            </div>
            <Separator className="my-4 bg-border/30" />
            <div className="text-center text-xs text-muted-foreground">
              Don't have an account? <a href="#" className="text-primary underline">Register</a>
            </div>
            <div className="mt-6 text-center">
              <button
                type="button"
                className="text-xs font-medium text-primary/80 hover:underline hover:text-primary transition-colors"
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