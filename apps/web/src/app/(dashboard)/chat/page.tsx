'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { auth } from '@/lib/db/supabase'

export default function ChatPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { user: currentUser } = await auth.getCurrentUser()
        console.log('👤 Текущий пользователь в чате:', currentUser)
        
        if (!currentUser) {
          console.log('❌ Пользователь не авторизован, перенаправляем на логин')
          router.push('/login')
          return
        }
        
        setUser(currentUser)
      } catch (error) {
        console.error('❌ Ошибка получения пользователя:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  const handleLogout = async () => {
    try {
      console.log('🚪 Выходим из системы...')
      await auth.signOut()
      console.log('✅ Выход успешен')
      router.push('/login')
    } catch (error) {
      console.error('❌ Ошибка выхода:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка чата...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                💬 Чат с ИИ-помощником
              </h1>
              <p className="text-gray-600">
                Добро пожаловать, {user?.email}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>

        {/* Chat Interface Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Диалог с ИИ
            </h2>
          </div>
          
          <div className="p-6 min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Чат-интерфейс в разработке
              </h3>
              <p className="text-gray-600 mb-6">
                Скоро здесь будет полноценный чат с ИИ-помощником для карьерного развития
              </p>
              
              <div className="space-y-3 text-left max-w-md mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">✅ Аутентификация работает</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">✅ Supabase подключен</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">✅ Защищенные маршруты работают</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">🚧 Чат-интерфейс в разработке</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Информация о пользователе
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">ID</label>
              <p className="text-gray-900 font-mono text-sm">{user?.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Создан</label>
              <p className="text-gray-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'Неизвестно'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Статус</label>
              <p className="text-green-600 font-medium">Активен</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 