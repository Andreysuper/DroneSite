'use client'

import { useEffect, useRef, useState } from 'react'

type CountUpProps = {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  separator?: boolean
  className?: string
}

export function CountUp({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  separator = true,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            const start = performance.now()
            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1)
              // easeOutCubic
              const eased = 1 - Math.pow(1 - progress, 3)
              setValue(Math.round(eased * end))
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [end, duration])

  const formatted = separator
    ? value.toLocaleString('en-US')
    : value.toString()

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
