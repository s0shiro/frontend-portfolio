'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

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

  async function onSubmit(values: ContactFormValues) {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        body: values.message,
      }),
    })

    if (!response.ok) {
      toast.error('Failed to send message. Please try again.')
      return
    }

    toast.success('Message sent! Thank you for reaching out.')
    form.reset()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-2xl"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="sr-only">Name</FieldLabel>
                <Input 
                  {...field} 
                  placeholder="Name" 
                  className="h-12 bg-background/50 backdrop-blur-sm border-border/40 focus:border-primary/40 focus:ring-primary/20 text-base"
                />
                <FieldError errors={fieldState.error ? [{ message: fieldState.error.message }] : []} />
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="sr-only">Email</FieldLabel>
                <Input 
                  {...field} 
                  type="email" 
                  placeholder="Email" 
                  className="h-12 bg-background/50 backdrop-blur-sm border-border/40 focus:border-primary/40 focus:ring-primary/20 text-base"
                />
                <FieldError errors={fieldState.error ? [{ message: fieldState.error.message }] : []} />
              </Field>
            )}
          />
        </div>

        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="sr-only">Message</FieldLabel>
              <Textarea 
                {...field} 
                placeholder="Message" 
                rows={5}
                className="bg-background/50 backdrop-blur-sm border-border/40 focus:border-primary/40 focus:ring-primary/20 resize-none text-base p-4"
              />
              <FieldError errors={fieldState.error ? [{ message: fieldState.error.message }] : []} />
            </Field>
          )}
        />

        <Button 
          type="submit" 
          disabled={form.formState.isSubmitting}
          className="w-full sm:w-auto px-8"
        >
          {form.formState.isSubmitting ? (
            'Sending...'
          ) : (
            <>
              Send Message
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </motion.div>
  )
}
