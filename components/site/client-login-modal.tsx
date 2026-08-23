'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export function ClientLoginModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(data.get('email') ?? ''),
          password: String(data.get('password') ?? ''),
          remember,
        }),
      })
      const payload = (await res.json()) as {
        success?: boolean
        redirectTo?: string
        error?: string
      }

      if (!res.ok || !payload.success) {
        setError(payload.error ?? 'Unable to sign in. Please try again.')
        return
      }

      onOpenChange(false)
      form.reset()
      router.push(payload.redirectTo ?? '/portal')
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        {/* Brand band */}
        <div className="bg-forest px-6 pt-6 pb-5 text-cream">
          <span className="text-xl font-bold tracking-tight">
            <span className="font-normal">AGRO</span>
            <span>SKY</span>
            <span className="text-gold">TECH</span>
          </span>
          <DialogHeader className="mt-4 gap-1 text-left">
            <DialogTitle className="text-2xl text-cream">
              Welcome Back
            </DialogTitle>
            <DialogDescription className="text-cream/75">
              Access your AgroSkyTech service dashboard.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email">Email Address</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@yourfarm.ca"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <Input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Label className="flex cursor-pointer items-center gap-2 text-sm font-normal">
              <Checkbox
                checked={remember}
                onCheckedChange={(v) => setRemember(Boolean(v))}
              />
              Remember me
            </Label>
            <a
              href="mailto:hello@agroskytech.ca?subject=Portal%20password%20reset"
              className="text-sm font-medium text-forest underline-offset-4 transition-colors hover:text-gold hover:underline"
            >
              Forgot Password?
            </a>
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
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3" aria-hidden />
            Secure client access
          </p>

          <div className="mt-1 border-t pt-4 text-center text-sm text-muted-foreground">
            Need access to your client portal?{' '}
            <a
              href="mailto:hello@agroskytech.ca?subject=Client%20portal%20access"
              className="font-semibold text-forest underline-offset-4 transition-colors hover:text-gold hover:underline"
            >
              Contact AgroSkyTech
            </a>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
