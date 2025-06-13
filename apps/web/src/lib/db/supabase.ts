// Временная заглушка для Supabase
console.warn('Supabase клиент работает в режиме заглушки. Настройте переменные окружения.')

// Тип для пользователя
export interface User {
  id: string
  email: string
  full_name?: string
  created_at: string
}

// Mock функции для аутентификации
export const auth = {
  // Регистрация пользователя (заглушка)
  async signUp(email: string, password: string, fullName?: string) {
    console.warn('signUp: Supabase не настроен')
    return { 
      data: null, 
      error: { message: 'Supabase не настроен. Проверьте переменные окружения.' } 
    }
  },

  // Вход пользователя (заглушка)
  async signIn(email: string, password: string) {
    console.warn('signIn: Supabase не настроен')
    return { 
      data: null, 
      error: { message: 'Supabase не настроен. Проверьте переменные окружения.' } 
    }
  },

  // Вход через Google OAuth (заглушка)
  async signInWithGoogle() {
    console.warn('signInWithGoogle: Supabase не настроен')
    return { 
      data: null, 
      error: { message: 'Supabase не настроен. Проверьте переменные окружения.' } 
    }
  },

  // Выход (заглушка)
  async signOut() {
    console.warn('signOut: Supabase не настроен')
    return { error: null }
  },

  // Получить текущего пользователя (заглушка)
  async getCurrentUser() {
    console.warn('getCurrentUser: Supabase не настроен')
    return { user: null, error: null }
  },

  // Сброс пароля (заглушка)
  async resetPassword(email: string) {
    console.warn('resetPassword: Supabase не настроен')
    return { 
      data: null, 
      error: { message: 'Supabase не настроен. Проверьте переменные окружения.' } 
    }
  }
} 