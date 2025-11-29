"use client"

import { LoadingProvider } from "@/contexts/loading-context"
import { GlobalLoading } from "@/components/global-loading"

export function LoadingProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      {children}
      <GlobalLoading />
    </LoadingProvider>
  )
}

