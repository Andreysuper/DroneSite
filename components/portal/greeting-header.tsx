'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from './page-header'

function greetingFor(hour: number) {
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

/**
 * Time-of-day greeting. Resolved after mount so the server-rendered markup
 * cannot disagree with the visitor's local clock.
 */
export function GreetingHeader({ name }: { name: string }) {
  const [greeting, setGreeting] = useState('Good Morning')

  useEffect(() => {
    setGreeting(greetingFor(new Date().getHours()))
  }, [])

  return (
    <PageHeader
      title={`${greeting}, ${name}`}
      subtitle="Here’s what’s happening with your AgroSkyTech services."
    />
  )
}
