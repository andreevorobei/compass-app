'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  BarChart3, 
  MessageSquare, 
  Target, 
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react'

// Mock данные для демонстрации
const stats = [
  {
    name: 'Всего целей',
    value: '12',
    change: '+2.5%',
    changeType: 'positive' as const,
    icon: Target,
  },
  {
    name: 'Завершено целей',
    value: '8',
    change: '+12%',
    changeType: 'positive' as const,
    icon: CheckCircle,
  },
  {
    name: 'AI сессий',
    value: '24',
    change: '+4.1%',
    changeType: 'positive' as const,
    icon: MessageSquare,
  },
  {
    name: 'Активное время',
    value: '2.4ч',
    change: '-0.5%',
    changeType: 'negative' as const,
    icon: Clock,
  },
]

const recentActivities = [
  {
    id: 1,
    type: 'goal',
    title: 'Завершена цель "Изучить React"',
    time: '2 часа назад',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    id: 2,
    type: 'chat',
    title: 'AI сессия: Планирование карьеры',
    time: '4 часа назад',
    icon: MessageSquare,
    color: 'text-blue-600',
  },
  {
    id: 3,
    type: 'analytics',
    title: 'Новый отчет по прогрессу',
    time: '1 день назад',
    icon: BarChart3,
    color: 'text-purple-600',
  },
]

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()

  // Демо: автоматический логин для тестирования
  useEffect(() => {
    if (!isAuthenticated) {
      const demoLogin = () => {
        const { login } = useAuthStore.getState()
        login({
          id: 'demo-user',
          email: 'demo@compass.ai',
          name: 'Demo User',
        })
      }
      // Небольшая задержка для демонстрации
      setTimeout(demoLogin, 500)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Добро пожаловать, {user?.name || 'Пользователь'}! 👋
          </h1>
          <p className="text-blue-100">
            Вот краткий обзор вашего прогресса и активности
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Последняя активность</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center ${activity.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <MessageSquare className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Новый AI чат</p>
                <p className="text-xs text-gray-500">Задать вопрос ассистенту</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Target className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Добавить цель</p>
                <p className="text-xs text-gray-500">Создать новую цель</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <BarChart3 className="w-6 h-6 text-purple-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Посмотреть отчеты</p>
                <p className="text-xs text-gray-500">Анализ прогресса</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Calendar className="w-6 h-6 text-orange-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Планировщик</p>
                <p className="text-xs text-gray-500">Управление временем</p>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Chart Placeholder */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Прогресс за неделю</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <p>График прогресса</p>
              <p className="text-sm">Будет реализован в следующих фазах</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
