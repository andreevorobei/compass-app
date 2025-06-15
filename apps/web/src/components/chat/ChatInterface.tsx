'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Plus, MessageCircle, Bot, User as UserIcon } from 'lucide-react'
import { useChatStore, useAuthStore } from '@/store'
import { cn } from '@/lib/utils'

export function ChatInterface() {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { 
    currentSession, 
    sessions, 
    createSession, 
    setCurrentSession, 
    addMessage,
    isTyping,
    setTyping 
  } = useChatStore()

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentSession?.messages])

  // Create initial session if none exists
  useEffect(() => {
    if (Object.keys(sessions).length === 0) {
      const sessionId = createSession('AI Chat')
      setCurrentSession(sessionId)
    }
  }, [sessions, createSession, setCurrentSession])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentSession || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue('')
    setIsLoading(true)

    // Add user message
    addMessage(currentSession.id, {
      content: userMessage,
      role: 'user'
    })

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Это интересный вопрос! Давайте разберем его подробнее...",
        "Я понимаю вашу ситуацию. Вот что я рекомендую...",
        "Отличная цель! Давайте создадим план для её достижения."
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      addMessage(currentSession.id, {
        content: randomResponse,
        role: 'assistant'
      })
      
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">AI Ассистент</h2>
            <p className="text-sm text-gray-500">Онлайн</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentSession?.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Начните новый разговор
            </h3>
            <p className="text-gray-500">
              Задайте вопрос AI ассистенту
            </p>
          </div>
        ) : (
          currentSession?.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
              )}
              
              <div
                className={cn(
                  'max-w-md px-4 py-3 rounded-lg',
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Напишите сообщение..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}