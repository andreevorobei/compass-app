'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/db/supabase'

export default function SupabaseCheck() {
  const [status, setStatus] = useState<{
    isConnected: boolean
    error?: string
    userCount?: number
  }>({ isConnected: false })

  useEffect(() => {
    checkSupabaseConnection()
  }, [])

  const checkSupabaseConnection = async () => {
    try {
      console.log('🔍 Проверяем подключение к Supabase...')
      
      // Пробуем простой запрос к auth
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('❌ Ошибка подключения:', error)
        setStatus({ 
          isConnected: false, 
          error: `Ошибка: ${error.message}` 
        })
        return
      }

      // Пробуем запрос к базе данных
      try {
        const { count, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })

        if (countError) {
          console.warn('⚠️ Таблица profiles не найдена:', countError)
          setStatus({ 
            isConnected: true, 
            error: 'Подключение есть, но таблицы не созданы' 
          })
        } else {
          console.log('✅ Подключение успешно!')
          setStatus({ 
            isConnected: true, 
            userCount: count || 0 
          })
        }
      } catch (dbError: any) {
        console.warn('⚠️ Ошибка доступа к БД:', dbError)
        setStatus({ 
          isConnected: true, 
          error: 'Подключение есть, но проблемы с базой данных' 
        })
      }

    } catch (error: any) {
      console.error('💥 Критическая ошибка:', error)
      setStatus({ 
        isConnected: false, 
        error: `Критическая ошибка: ${error.message}` 
      })
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="font-semibold text-gray-900 mb-2">🔧 Статус Supabase</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            status.isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span>{status.isConnected ? 'Подключено' : 'Не подключено'}</span>
        </div>

        {status.error && (
          <div className="text-red-600 text-xs">
            {status.error}
          </div>
        )}

        {status.userCount !== undefined && (
          <div className="text-gray-600 text-xs">
            Профилей в БД: {status.userCount}
          </div>
        )}

        <div className="mt-3 text-xs text-gray-500">
          Проверьте консоль (F12) для деталей
        </div>
      </div>
    </div>
  )
} 