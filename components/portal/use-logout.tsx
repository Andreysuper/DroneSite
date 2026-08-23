'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Ends the portal session. The cookie is httpOnly, so clearing it must happen
 * server-side via the logout route.
 */
export function useLogout() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function logout() {
    setPending(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.replace('/')
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  return { logout, pending }
}
