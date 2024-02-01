'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProviderProps } from 'next-themes/dist/types'

import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider } from '@/lib/hooks/use-sidebar'

const queryClient = new QueryClient()

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider {...props}>
        <SidebarProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </SidebarProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  )
}
