'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ProfileUpdate {
  timestamp: string
  data: any
}

// Функции для извлечения данных из разговора
const extractInterests = (messages: Message[]): string[] => {
  const interests: string[] = []
  messages.forEach(msg => {
    if (msg.role === 'user') {
      const content = msg.content.toLowerCase()
      if (content.includes('нравится') || content.includes('увлечения') || 
          content.includes('ходить') || content.includes('создавать') ||
          content.includes('управлять') || content.includes('писать')) {
        const items = msg.content.split(',').map(item => item.trim()).filter(item => item.length > 2)
        interests.push(...items)
      }
    }
  })
  return Array.from(new Set(interests)) // убираем дубликаты
}

const extractSkills = (messages: Message[]): string[] => {
  const skills: string[] = []
  messages.forEach(msg => {
    if (msg.role === 'user') {
      const content = msg.content.toLowerCase()
      if (content.includes('умею') || content.includes('навыки') ||
          content.includes('читать') || content.includes('код') ||
          content.includes('анализ') || content.includes('управление')) {
        const items = msg.content.split(',').map(item => item.trim()).filter(item => item.length > 2)
        skills.push(...items)
      }
    }
  })
  return Array.from(new Set(skills))
}

const extractPreferences = (messages: Message[]): any => {
  const preferences: any = {}
  messages.forEach(msg => {
    if (msg.role === 'user') {
      const content = msg.content.toLowerCase()
      if (content.includes('команд')) preferences.teamwork = 'командная'
      if (content.includes('самостоятельн')) preferences.teamwork = 'самостоятельная'
      if (content.includes('люди')) preferences.workType = 'с людьми'
      if (content.includes('данные')) preferences.workType = 'с данными'
      if (content.includes('создавать')) preferences.workType = 'создание'
      if (content.includes('стабильность')) preferences.priority = 'стабильность'
      if (content.includes('вызов')) preferences.priority = 'новые вызовы'
    }
  })
  return preferences
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Привет! Я Jess, твой карьерный коуч в Compass. Сейчас мы пройдем быстрый анализ, чтобы найти идеальные карьерные пути именно для тебя. Это займет всего 5-7 минут.\n\nНачнем с первого списка: напиши 5-10 вещей, которые тебе НРАВИТСЯ делать и приносят удовольствие. Это могут быть хобби, увлечения, типы задач - пиши первое, что приходит в голову, не обдумывай.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [currentStage, setCurrentStage] = useState<string>('data_collection')
  const [isCompleted, setIsCompleted] = useState(false)
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      console.log('🚀 Sending message to API:', userMessage.content)
      
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const text = await response.text()
      console.log('📦 Full response text:', text)
      
      let content = ''
      try {
        // Пытаемся распарсить как JSON
        const data = JSON.parse(text)
        console.log('📋 Parsed JSON:', data)
        content = data.content || data.message || text
      } catch (e) {
        // Если не JSON, используем как есть
        console.log('📝 Using raw text')
        content = text
      }
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: content || 'Привет! Я Jess, давайте начнем ваш карьерный анализ. Расскажите мне о ваших интересах!',
        timestamp: new Date()
      }
      setMessages(prev => {
        const newMessages = [...prev, assistantMessage]
        
        // Проверяем завершение анализа
        if (content.includes('Переходи к результатам') || 
            content.includes('карьерных путей') || 
            content.includes('перенаправлю тебя на страницу') ||
            content.includes('Перейти к результатам')) {
          setIsCompleted(true)
          
          // Сохраняем данные разговора для страницы результатов
          const conversationData = {
            interests: extractInterests(newMessages),
            skills: extractSkills(newMessages),
            preferences: extractPreferences(newMessages),
            messages: newMessages,
            completedAt: new Date().toISOString()
          }
          localStorage.setItem('compass_profile_data', JSON.stringify(conversationData))
        }
        
        return newMessages
      })

      console.log('✅ Message completed successfully')

    } catch (error) {
      console.error('❌ Chat Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте еще раз.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const getStageDescription = (stage: string) => {
    switch(stage) {
      case 'data_collection': return '📝 Сбор информации'
      case 'summary_confirmation': return '📋 Подтверждение резюме'
      case 'additions': return '✏️ Дополнения'
      case 'ready_for_results': return '🎯 Готовность к результатам'
      default: return '🚀 Карьерный анализ'
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col py-4">
      <div className="max-w-6xl mx-auto px-4 flex-1 flex flex-col">
        <div className="flex gap-6 flex-1">
          {/* Chat Section */}
          <div className="flex-1 bg-white rounded-lg shadow-lg flex flex-col">
            <div className="p-6 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">AI Career Coach - Jess</h2>
                  <p className="text-gray-600">Найдем идеальные карьерные пути именно для тебя</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600">{getStageDescription(currentStage)}</div>
                  <div className="text-xs text-gray-500">Этап {currentStage === 'data_collection' ? '1' : currentStage === 'summary_confirmation' ? '2' : currentStage === 'additions' ? '3' : '4'} из 4</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-lg p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {message.role === 'assistant' ? (
                        <div 
                          dangerouslySetInnerHTML={{
                            __html: message.content
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/(?<!\*)\\*([^*]+)\\*(?!\*)/g, '<em>$1</em>')
                              .replace(/\n/g, '<br/>')
                          }}
                        />
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-4 rounded-lg max-w-lg">
                    <div className="flex items-center space-x-2">
                      <div className="text-gray-500">Jess печатает...</div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Кнопка перехода к результатам */}
              {isCompleted && (
                <div className="flex justify-center p-6">
                  <button
                    onClick={() => router.push('/results')}
                    className="bg-green-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors shadow-lg animate-pulse"
                  >
                    🚀 Перейти к рекомендованным карьерным путям
                  </button>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 border-t flex-shrink-0">
              <div className="flex gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Напиши свой ответ..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Send size={18} />
                  Отправить
                </button>
              </div>
            </form>
          </div>

          {/* Progress Panel */}
          <div className="w-80 bg-white rounded-lg shadow-lg p-6 flex flex-col">
            <div className="flex-shrink-0">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">📊 Прогресс анализа</h3>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="space-y-3 mb-6">
                <div className={`p-3 rounded-lg border-2 transition-all ${currentStage === 'data_collection' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="font-medium text-sm">1. Сбор данных</div>
                  <div className="text-xs text-gray-600">Интересы и навыки</div>
                </div>
                <div className={`p-3 rounded-lg border-2 transition-all ${currentStage === 'summary_confirmation' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="font-medium text-sm">2. Резюме профиля</div>
                  <div className="text-xs text-gray-600">Подтверждение данных</div>
                </div>
                <div className={`p-3 rounded-lg border-2 transition-all ${currentStage === 'additions' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="font-medium text-sm">3. Дополнения</div>
                  <div className="text-xs text-gray-600">Уточнения и правки</div>
                </div>
                <div className={`p-3 rounded-lg border-2 transition-all ${currentStage === 'ready_for_results' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="font-medium text-sm">4. Результаты</div>
                  <div className="text-xs text-gray-600">Карьерные рекомендации</div>
                </div>
              </div>

              {profileData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-auto">
                  <div className="font-medium text-green-800 mb-2">📋 Собранные данные:</div>
                  <div className="text-sm text-green-700 space-y-1">
                    {profileData.interests && <div>✓ Интересы: {profileData.interests.length}</div>}
                    {profileData.skills && <div>✓ Навыки: {profileData.skills.length}</div>}
                    {profileData.preferences && <div>✓ Предпочтения: заполнены</div>}
                    {profileData.summary && <div>✓ Резюме: создано</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 