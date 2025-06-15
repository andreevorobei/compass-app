import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Типы для профиля пользователя
interface UserProfile {
  id: string
  email: string
  name?: string
  avatar_url?: string
  bio?: string
  settings: {
    language: string
    timezone: string
    emailNotifications: boolean
    pushNotifications: boolean
  }
  preferences: {
    defaultModel: string
    theme: 'light' | 'dark' | 'system'
    sidebarLayout: 'expanded' | 'collapsed'
  }
}

// Состояние профиля
interface ProfileState {
  profile: UserProfile | null
  isLoading: boolean
  lastUpdated: Date | null
}

// Действия для профиля
interface ProfileActions {
  setProfile: (profile: UserProfile | null) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  updateSettings: (settings: Partial<UserProfile['settings']>) => void
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

// Объединенный тип store
type ProfileStore = ProfileState & ProfileActions

// Начальное состояние
const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  lastUpdated: null,
}

// Создаем Zustand store для профиля
export const useProfileStore = create<ProfileStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Установить профиль
        setProfile: (profile) => set({ 
          profile,
          lastUpdated: new Date(),
          isLoading: false 
        }),
        
        // Обновить профиль
        updateProfile: (updates) => set((state) => {
          if (!state.profile) return state
          
          return {
            profile: { ...state.profile, ...updates },
            lastUpdated: new Date(),
          }
        }),
        
        // Обновить настройки
        updateSettings: (settings) => set((state) => {
          if (!state.profile) return state
          
          return {
            profile: {
              ...state.profile,
              settings: { ...state.profile.settings, ...settings }
            },
            lastUpdated: new Date(),
          }
        }),
        
        // Обновить предпочтения
        updatePreferences: (preferences) => set((state) => {
          if (!state.profile) return state
          
          return {
            profile: {
              ...state.profile,
              preferences: { ...state.profile.preferences, ...preferences }
            },
            lastUpdated: new Date(),
          }
        }),
        
        // Установить состояние загрузки
        setLoading: (isLoading) => set({ isLoading }),
        
        // Сброс состояния
        reset: () => set(initialState),
      }),
      {
        name: 'compass-profile-storage',
        // Сохраняем весь профиль
        partialize: (state) => ({ 
          profile: state.profile,
          lastUpdated: state.lastUpdated 
        }),
      }
    ),
    { name: 'ProfileStore' }
  )
)