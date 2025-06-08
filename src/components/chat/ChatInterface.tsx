'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ProfileUpdate {
  timestamp: string
  data: any
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Привет! Как я могу помочь тебе в твоем карьерном развитии сегодня? Есть какие-то конкретные вопросы или цели, о которых ты хотел бы поговорить?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [profileUpdates, setProfileUpdates] = useState<ProfileUpdate[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    console.log('📤 Sending message:', userMessage.content)
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      console.log('🔄 Calling API...')
      
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: 'user', content: userMessage.content }
          ]
        }),
      })

      console.log('📡 API Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('❌ API Error:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log('📨 API Response data:', data)

      // Проверяем что есть content в ответе
      if (!data.content) {
        console.error('❌ No content in response:', data)
        throw new Error('AI не вернул ответ')
      }

      // Добавляем ответ AI
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date()
      }

      console.log('✅ Adding AI message:', assistantMessage.content.substring(0, 100) + '...')
      setMessages(prev => [...prev, assistantMessage])

      // Обрабатываем function call если есть
      if (data.functionCall) {
        console.log('🔄 Processing function call:', data.functionCall)
        
        // Отправляем событие для обновления профиля
        const updateEvent = new CustomEvent('profileUpdate', {
          detail: data.functionCall
        })
        window.dispatchEvent(updateEvent)
        console.log('📡 Profile update event dispatched')

        // Добавляем в локальный стейт для отображения в правой панели
        setProfileUpdates(prev => [...prev, {
          timestamp: new Date().toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          data: data.functionCall
        }])
      }

    } catch (error) {
      console.error('❌ Chat error:', error)
      
      const errorMessage: Message = {
        role: 'assistant',
        content: `Извини, произошла ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}. Попробуй еще раз.`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      console.log('✅ Request completed')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-6 h-screen p-4">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">AI Career Coach</h2>
          <p className="text-sm text-gray-600">Расскажи о своей карьере, и я помогу составить план развития</p>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="flex items-start gap-2">
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('ru-RU', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Расскажи о своей карьере..."
              className="flex-1 min-h-[60px] p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Сообщения с ИИ, Запись №1 | Загрузка от OpenAI
          </p>
        </div>
      </div>

      {/* Profile Updates Panel */}
      <div className="w-80 bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-gray-800 mb-4">🔄 Обновления профиля</h3>
        {profileUpdates.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Начни разговор с AI о своей карьере, и здесь будут появляться автоматические обновления твоего профиля!
            <br/><br/>
            <strong>Попробуй рассказать о:</strong>
            <br/>• Твоей роли и опыте
            <br/>• Навыках и технологиях  
            <br/>• Карьерных целях
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {profileUpdates.map((update, index) => (
              <div key={index} className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                <div className="font-medium text-green-800 mb-1">
                  ⏰ {update.timestamp}
                </div>
                <div className="space-y-2">
                  {update.data.current_role && (
                    <div><strong>Роль:</strong> {update.data.current_role}</div>
                  )}
                  {update.data.target_role && (
                    <div><strong>Цель:</strong> {update.data.target_role}</div>
                  )}
                  {update.data.experience_years && (
                    <div><strong>Опыт:</strong> {update.data.experience_years} лет</div>
                  )}
                  {update.data.skills && update.data.skills.length > 0 && (
                    <div>
                      <strong>Навыки:</strong>
                      <ul className="mt-1 space-y-1">
                        {update.data.skills.map((skill: any, skillIndex: number) => (
                          <li key={skillIndex} className="text-xs bg-white p-1 rounded">
                            {skill.name} ({skill.level}/100) - {skill.change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {update.data.goals && update.data.goals.length > 0 && (
                    <div>
                      <strong>Цели:</strong>
                      <ul className="mt-1 space-y-1">
                        {update.data.goals.map((goal: string, goalIndex: number) => (
                          <li key={goalIndex} className="text-xs">• {goal}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 