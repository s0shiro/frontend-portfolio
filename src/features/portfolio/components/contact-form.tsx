import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { Reveal } from '@/components/shared/portfolio-motion'
import { Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

import { submitContactForm } from '../api/submit-contact'

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.email({
    message: 'Please enter a valid email address.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const mutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      toast.success('Message sent! Thank you for reaching out.')
      form.reset()
    },
    onError: () => {
      toast.error('Failed to send message. Please try again.')
    },
  })

  function onSubmit(values: ContactFormValues) {
    mutation.mutate(values)
  }

  return (
    <Reveal className="w-full max-w-2xl">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="contact-form space-y-8"
        noValidate
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="contact-name"
                  className="text-sm font-medium text-foreground"
                >
                  Name
                </FieldLabel>
                <Input
                  id="contact-name"
                  {...field}
                  autoComplete="name"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.error ? 'contact-name-error' : undefined
                  }
                  placeholder="Your name"
                  className="h-12 bg-background/50 backdrop-blur-sm border-border/40 focus:border-primary/40 focus:ring-primary/20 text-base"
                />
                <FieldError
                  id="contact-name-error"
                  errors={
                    fieldState.error
                      ? [{ message: fieldState.error.message }]
                      : []
                  }
                />
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="contact-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </FieldLabel>
                <Input
                  id="contact-email"
                  {...field}
                  type="email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.error ? 'contact-email-error' : undefined
                  }
                  placeholder="you@example.com"
                  className="h-12 bg-background/50 backdrop-blur-sm border-border/40 focus:border-primary/40 focus:ring-primary/20 text-base"
                />
                <FieldError
                  id="contact-email-error"
                  errors={
                    fieldState.error
                      ? [{ message: fieldState.error.message }]
                      : []
                  }
                />
              </Field>
            )}
          />
        </div>

        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="contact-message"
                className="text-sm font-medium text-foreground"
              >
                Message
              </FieldLabel>
              <Textarea
                id="contact-message"
                {...field}
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.error ? 'contact-message-error' : undefined
                }
                placeholder="Tell me about the role, project, or collaboration you have in mind."
                rows={5}
                className="bg-background/50 backdrop-blur-sm border-border/40 focus:border-primary/40 focus:ring-primary/20 resize-none text-base p-4"
              />
              <FieldError
                id="contact-message-error"
                errors={
                  fieldState.error
                    ? [{ message: fieldState.error.message }]
                    : []
                }
              />
            </Field>
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={mutation.isPending}
          className="contact-submit group w-full sm:w-auto"
        >
          {mutation.isPending ? (
            'Sending...'
          ) : (
            <>
              Send Message
              <Send className="ml-2 h-4 w-4 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 motion-safe:group-focus-visible:-translate-y-0.5 motion-safe:group-focus-visible:translate-x-0.5" />
            </>
          )}
        </Button>
      </form>
    </Reveal>
  )
}
