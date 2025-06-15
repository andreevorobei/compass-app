'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ChatInterface } from '@/components/chat/ChatInterface'

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Чат</h1>
          <p className="text-gray-600">
            Общайтесь с AI ассистентом для получения советов по карьере и целям
          </p>
        </div>

        <div className="flex-1 min-h-0">
          <ChatInterface />
        </div>
      </div>
    </DashboardLayout>
  )
} 