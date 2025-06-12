'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/db/supabase'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { user, error } = await auth.getCurrentUser()
      
      if (error || !user) {
        router.push('/login')
      } else {
        setUser(user)
      }
      
      setIsLoading(false)
    }

    checkUser()
  }, [router])

  const handleSignOut = async () => {
    await auth.signOut()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Compass AI Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Привет, {user?.user_metadata?.full_name || user?.email}!
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Добро пожаловать в Compass AI!
            </h2>
            <p className="text-gray-600 mb-6">
              Вы успешно вошли в систему. Это ваша личная панель управления.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Информация о пользователе:</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Имя:</strong> {user?.user_metadata?.full_name || 'Не указано'}</p>
                <p><strong>ID:</strong> {user?.id}</p>
                <p><strong>Дата регистрации:</strong> {new Date(user?.created_at).toLocaleDateString('ru-RU')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 