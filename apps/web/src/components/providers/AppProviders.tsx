'use client'

import { QueryProvider } from './QueryProvider'

interface AppProvidersProps {
  children: React.ReactNode
}

/**
 * Главный компонент провайдеров для всего приложения
 * Объединяет все context провайдеры в одном месте
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  )
} 