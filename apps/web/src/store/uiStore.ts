import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Типы для тем
export type Theme = 'light' | 'dark' | 'system'

// Состояние UI
interface UiState {
  // Sidebar состояние
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  
  // Тема
  theme: Theme
  
  // Мобильное меню
  mobileMenuOpen: boolean
  
  // Загрузка страницы
  pageLoading: boolean
  
  // Модальные окна
  modals: {
    settingsOpen: boolean
    profileOpen: boolean
  }
}

// Действия для UI
interface UiActions {
  // Sidebar действия
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebarCollapsed: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Тема
  setTheme: (theme: Theme) => void
  
  // Мобильное меню
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  
  // Загрузка
  setPageLoading: (loading: boolean) => void
  
  // Модальные окна
  openModal: (modal: keyof UiState['modals']) => void
  closeModal: (modal: keyof UiState['modals']) => void
  closeAllModals: () => void
  
  // Сброс состояния
  reset: () => void
}

// Объединенный тип store
type UiStore = UiState & UiActions

// Начальное состояние
const initialState: UiState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: 'system',
  mobileMenuOpen: false,
  pageLoading: false,
  modals: {
    settingsOpen: false,
    profileOpen: false,
  },
}

// Создаем Zustand store для UI
export const useUiStore = create<UiStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Sidebar действия
        toggleSidebar: () => set((state) => ({ 
          sidebarOpen: !state.sidebarOpen 
        })),
        
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
        
        toggleSidebarCollapsed: () => set((state) => ({ 
          sidebarCollapsed: !state.sidebarCollapsed 
        })),
        
        setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
        
        // Тема
        setTheme: (theme) => set({ theme }),
        
        // Мобильное меню
        toggleMobileMenu: () => set((state) => ({ 
          mobileMenuOpen: !state.mobileMenuOpen 
        })),
        
        setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
        
        // Загрузка
        setPageLoading: (pageLoading) => set({ pageLoading }),
        
        // Модальные окна
        openModal: (modal) => set((state) => ({
          modals: { ...state.modals, [modal]: true }
        })),
        
        closeModal: (modal) => set((state) => ({
          modals: { ...state.modals, [modal]: false }
        })),
        
        closeAllModals: () => set((state) => ({
          modals: Object.keys(state.modals).reduce((acc, key) => ({
            ...acc,
            [key]: false
          }), {} as UiState['modals'])
        })),
        
        // Сброс состояния
        reset: () => set(initialState),
      }),
      {
        name: 'compass-ui-storage',
        // Сохраняем только UI настройки
        partialize: (state) => ({ 
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
        }),
      }
    ),
    { name: 'UiStore' }
  )
) 