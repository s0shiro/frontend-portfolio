import { clientEnv } from '@/lib/env'

export type ContactFormValues = {
  name: string
  email: string
  message: string
}

export async function submitContactForm(values: ContactFormValues) {
  const response = await fetch(`${clientEnv.VITE_API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: values.name,
      email: values.email,
      body: values.message,
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to send message.')
  }
  
  return response.json()
}
