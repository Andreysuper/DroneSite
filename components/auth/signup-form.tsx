'use client'

import { useState } from 'react'
import { MailCheck, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function signupErrorMessage(error: unknown): string {
  const { code, status } = (error ?? {}) as { code?: string; status?: number }
  if (code === 'user_already_exists' || code === 'email_exists') {
    return 'An account with this email already exists. Try signing in instead.'
  }
  if (code === 'weak_password') {
    return 'Please choose a stronger password (at least 8 characters).'
  }
  if (code === 'over_email_send_rate_limit' || status === 429) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  if (code === 'email_address_invalid') {
    return 'Please enter a valid email address.'
  }
  return 'Something went wrong creating your account. Please try again.'
}

export function SignupForm() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = String(data.get('email') ?? '').trim()
    const password = String(data.get('password') ?? '')
    const fullName = String(data.get('full_name') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
          data: { full_name: fullName, phone },
        },
      })
      if (error) throw error
      setDone(true)
    } catch (err) {
      console.error('[v0] signup error:', err)
      setError(signupErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-forest/10 text-forest">
          <MailCheck className="size-6" aria-hidden />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Confirm your email</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We&apos;ve sent a confirmation link to your inbox. Click it to
            activate your account, then sign in.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" name="full_name" required placeholder="Jane Grower" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@yourfarm.ca"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" type="tel" placeholder="(306) 555-0142" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="At least 8 characters"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="mt-1 h-12 w-full bg-forest text-base font-semibold text-primary-foreground hover:bg-forest-deep"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Creating account…
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  )
}
