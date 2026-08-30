import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAuthProfile } from '@/lib/auth/session'
import { landingPathForRole } from '@/lib/auth/roles'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your AgroSkyTech account.',
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const profile = await getAuthProfile()
  if (profile) redirect(landingPathForRole(profile.role))

  const { next } = await searchParams

  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-forest p-10 text-cream lg:flex">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="font-normal">AGRO</span>
          <span>SKY</span>
          <span className="text-gold">TECH</span>
        </Link>
        <div className="flex flex-col gap-4">
          <h1 className="text-balance text-4xl font-bold leading-tight">
            Precision agriculture, managed end to end.
          </h1>
          <p className="max-w-md text-pretty text-cream/75 leading-relaxed">
            Track service requests, field maps, schedules and invoices — and
            let our operations team manage every job from intake to report.
          </p>
        </div>
        <p className="text-sm text-cream/60">
          &copy; {new Date().getFullYear()} AgroSkyTech. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="flex w-full max-w-sm flex-col gap-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-foreground lg:hidden"
          >
            <span className="font-normal">AGRO</span>
            <span>SKY</span>
            <span className="text-gold">TECH</span>
          </Link>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to access your dashboard.
            </p>
          </div>
          <LoginForm next={next} />
          <p className="text-center text-sm text-muted-foreground">
            Need a client account?{' '}
            <Link
              href="/signup"
              className="font-semibold text-forest underline-offset-4 hover:text-gold hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
