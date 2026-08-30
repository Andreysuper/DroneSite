import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAuthProfile } from '@/lib/auth/session'
import { landingPathForRole } from '@/lib/auth/roles'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your AgroSkyTech client account.',
  robots: { index: false, follow: false },
}

export default async function SignupPage() {
  const profile = await getAuthProfile()
  if (profile) redirect(landingPathForRole(profile.role))

  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-forest p-10 text-cream lg:flex">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="font-normal">AGRO</span>
          <span>SKY</span>
          <span className="text-gold">TECH</span>
        </Link>
        <div className="flex flex-col gap-4">
          <h1 className="text-balance text-4xl font-bold leading-tight">
            Create your client account.
          </h1>
          <p className="max-w-md text-pretty text-cream/75 leading-relaxed">
            Submit service requests, track your fields and jobs, and access
            maps, reports and invoices — all in one place.
          </p>
        </div>
        <p className="text-sm text-cream/60">
          &copy; {new Date().getFullYear()} AgroSkyTech. All rights reserved.
        </p>
      </div>

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
            <h2 className="text-2xl font-bold tracking-tight">
              Create account
            </h2>
            <p className="text-sm text-muted-foreground">
              Client accounts are for landowners and growers.
            </p>
          </div>
          <SignupForm />
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-forest underline-offset-4 hover:text-gold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
