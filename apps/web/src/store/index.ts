// Экспорт всех Zustand stores для centralized state management
export { useAuthStore } from './authStore'
export { useUiStore } from './uiStore'
export { useChatStore } from './chatStore'
export { useProfileStore } from './profileStore'

// Типы для re-export
export type { Theme } from './uiStore'

// Импорты для utility функций
import { useAuthStore } from './authStore'
import { useUiStore } from './uiStore'
import { useChatStore } from './chatStore'
import { useProfileStore } from './profileStore'

// Utility функции для работе со stores
export const resetAllStores = () => {
  useAuthStore.getState().reset()
  useUiStore.getState().reset()
  useChatStore.getState().reset()
  useProfileStore.getState().reset()
}

// Функция для очистки пользовательских данных при logout
export const clearUserData = () => {
  useAuthStore.getState().logout()
  useChatStore.getState().reset()
  useProfileStore.getState().reset()
  // UI store сохраняем для пользовательского опыта
} 