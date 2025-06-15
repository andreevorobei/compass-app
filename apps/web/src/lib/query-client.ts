import { QueryClient } from '@tanstack/react-query'

// Создаем QueryClient для управления server state
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Данные актуальны 5 минут
      staleTime: 5 * 60 * 1000,
      // Кэш хранится 10 минут
      gcTime: 10 * 60 * 1000,
      // Повторные попытки при ошибке
      retry: (failureCount, error) => {
        // Не повторяем запросы с 4xx ошибками
        if (error && typeof error === 'object' && 'status' in error) {
          const status = error.status as number
          if (status >= 400 && status < 500) return false
        }
        return failureCount < 3
      },
      // Refetch при фокусе окна
      refetchOnWindowFocus: true,
    },
    mutations: {
      // Повторные попытки для мутаций
      retry: 1,
    },
  },
}) 