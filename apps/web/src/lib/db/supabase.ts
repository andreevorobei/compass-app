import { createClient } from '@supabase/supabase-js'

// Проверяем наличие переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔧 Инициализация Supabase клиента...', {
  url: supabaseUrl ? 'установлен' : 'НЕ УСТАНОВЛЕН',
  key: supabaseAnonKey ? 'установлен' : 'НЕ УСТАНОВЛЕН',
  urlValue: supabaseUrl?.substring(0, 30) + '...',
  keyValue: supabaseAnonKey?.substring(0, 20) + '...'
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('🚨 КРИТИЧЕСКАЯ ОШИБКА: Отсутствуют переменные окружения Supabase!')
  console.error('Проверьте файл .env.local в папке apps/web/')
  throw new Error(
    'Отсутствуют переменные окружения Supabase. Проверьте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local'
  )
}

// Создаем клиент Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('✅ Supabase клиент создан успешно!')

// Типы для базы данных
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  full_name: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

// Функции для аутентификации
export const auth = {
  // Регистрация пользователя
  async signUp(email: string, password: string, fullName?: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (error) throw error

      // Если регистрация успешна, создаем профиль
      if (data.user && !error) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: data.user.id,
              full_name: fullName || '',
              avatar_url: null,
              bio: null
            }
          ])
        
        if (profileError) {
          console.error('Ошибка создания профиля:', profileError)
        }
      }

      return { data, error: null }
    } catch (error: any) {
      console.error('Ошибка регистрации:', error)
      return { data: null, error }
    }
  },

  // Вход пользователя
  async signIn(email: string, password: string) {
    try {
      console.log('🔑 Попытка входа через Supabase...', { email })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📦 Ответ от Supabase:', { 
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        errorCode: error?.status,
        errorMessage: error?.message 
      })

      if (error) {
        console.error('❌ Supabase вернул ошибку:', error)
        throw error
      }
      
      console.log('✅ Вход успешен!')
      return { data, error: null }
    } catch (error: any) {
      console.error('💥 Ошибка в signIn функции:', error)
      return { data: null, error }
    }
  },

  // Вход через Google OAuth
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error('Ошибка OAuth:', error)
      return { data: null, error }
    }
  },

  // Выход
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      console.error('Ошибка выхода:', error)
      return { error }
    }
  },

  // Получить текущего пользователя
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { user, error: null }
    } catch (error: any) {
      console.error('Ошибка получения пользователя:', error)
      return { user: null, error }
    }
  },

  // Получить сессию
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return { session, error: null }
    } catch (error: any) {
      console.error('Ошибка получения сессии:', error)
      return { session: null, error }
    }
  },

  // Сброс пароля
  async resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error('Ошибка сброса пароля:', error)
      return { data: null, error }
    }
  },

  // Обновление пароля
  async updatePassword(newPassword: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error('Ошибка обновления пароля:', error)
      return { data: null, error }
    }
  }
}

// Функции для работы с профилями
export const profiles = {
  // Получить профиль пользователя
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error('Ошибка получения профиля:', error)
      return { data: null, error }
    }
  },

  // Обновить профиль
  async updateProfile(userId: string, updates: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error('Ошибка обновления профиля:', error)
      return { data: null, error }
    }
  }
} 