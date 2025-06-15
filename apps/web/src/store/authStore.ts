import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Типы для пользователя
interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

// Состояние аутентификации
interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Действия для управления аутентификацией
interface AuthActions {
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  login: (user: User) => void
  logout: () => void
  reset: () => void
}

// Объединенный тип store
type AuthStore = AuthState & AuthActions

// Начальное состояние
const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
}

// Создаем Zustand store для аутентификации
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Установить пользователя
        setUser: (user) => set((state) => ({ 
          user, 
          isAuthenticated: !!user,
          isLoading: false 
        })),
        
        // Установить состояние загрузки
        setLoading: (isLoading) => set({ isLoading }),
        
        // Вход пользователя
        login: (user) => set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        }),
        
        // Выход пользователя
        logout: () => set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        }),
        
        // Сброс состояния
        reset: () => set(initialState),
      }),
      {
        name: 'compass-auth-storage',
        // Сохраняем только основную информацию
        partialize: (state) => ({ 
          user: state.user,
          isAuthenticated: state.isAuthenticated 
        }),
      }
    ),
    { name: 'AuthStore' }
  )
) 