// Assistant UI provider setup for AI chat interface
// Provides composable primitives instead of monolithic chat component
// Handles streaming, auto-scrolling, and accessibility out of the box

'use client'

import React from 'react'
import { AssistantRuntimeProvider } from '@assistant-ui/react'
import { useVercelUseChat } from '@assistant-ui/react/adapters/vercel-ai-chat'
import { useChat } from 'ai/react'

export interface AssistantProviderProps {
  children: React.ReactNode
  apiUrl?: string
}

export function AssistantProvider({ 
  children, 
  apiUrl = '/api/chat' 
}: AssistantProviderProps) {
  // Initialize chat with Vercel AI SDK
  const chat = useChat({
    api: apiUrl,
    body: {
      // Include user context for personalized responses
      userId: 'current-user-id', // TODO: Get from auth
      sessionId: 'current-session-id',
    },
    onError: (error: Error) => {
      console.error('Chat error:', error)
    }
  })

  // Create Assistant UI runtime from Vercel chat
  const runtime = useVercelUseChat(chat)

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  )
}

// Chat interface configuration
export const CHAT_CONFIG = {
  // Enable function calling for profile updates
  enableFunctionCalling: true,
  
  // Stream responses for better UX
  streamMode: true,
  
  // Auto-scroll to new messages
  autoScroll: true,
  
  // Accessibility features
  announceNewMessages: true,
  
  // Message history limit
  maxMessages: 100,
  
  // Typing indicator timeout
  typingTimeout: 2000,
} as const 