'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { ServiceDetailModal } from './service-detail-modal'
import { type ServiceDetail, SERVICE_DETAILS } from './services-data'

type ServiceModalContextValue = {
  /** Opens the service detail modal for the given service title. */
  openService: (title: string) => void
}

const ServiceModalContext = createContext<ServiceModalContextValue | null>(null)

export function useServiceModal() {
  const ctx = useContext(ServiceModalContext)
  if (!ctx)
    throw new Error('useServiceModal must be used within ServiceModalProvider')
  return ctx
}

export function ServiceModalProvider({ children }: { children: ReactNode }) {
  const [activeService, setActiveService] = useState<ServiceDetail | null>(null)

  function openService(title: string) {
    setActiveService(SERVICE_DETAILS[title] ?? null)
  }

  return (
    <ServiceModalContext.Provider value={{ openService }}>
      {children}
      <ServiceDetailModal
        service={activeService}
        onOpenChange={(next) => {
          if (!next) setActiveService(null)
        }}
      />
    </ServiceModalContext.Provider>
  )
}
