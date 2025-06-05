// Main chat interface using Assistant UI components
// Integration with OpenRouter for AI responses
// Function calling for automatic profile updates

'use client'

import React from 'react'
import { 
  Thread,
  Composer,
  UserMessage,
  AssistantMessage,
  BranchPicker,
  ActionBar,
  MessageIf,
  ThreadWelcome
} from '@assistant-ui/react'
import { AssistantProvider } from '@/integrations/assistant-ui/provider'
import { ASSISTANT_CONFIG } from '@/integrations/assistant-ui/config'
import { cn } from '@/lib/utils'
import { Loader2, Send, Mic, Paperclip } from 'lucide-react'

interface ChatInterfaceProps {
  className?: string
  sessionId?: string
  initialMessage?: string
}

export function ChatInterface({ 
  className, 
  sessionId,
  initialMessage 
}: ChatInterfaceProps) {
  return (
    <AssistantProvider apiUrl="/api/ai">
      <div className={cn('chat-container', className)}>
        {/* Thread displays the conversation */}
        <Thread className="flex-1 overflow-hidden">
          {/* Welcome message for new users */}
          <ThreadWelcome className="p-6 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Compass AI Career Coach
              </h2>
              <p className="text-gray-600 mb-6">
                {ASSISTANT_CONFIG.messages.welcome.text}
              </p>
              
              {/* Suggested prompts */}
              <div className="grid grid-cols-1 gap-2">
                {ASSISTANT_CONFIG.messages.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      // This would trigger sending the suggestion as a message
                      // Implementation depends on Assistant UI's API
                    }}
                  >
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          </ThreadWelcome>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* User messages */}
            <UserMessage className="mb-4">
              <MessageIf hasContent>
                <div className="chat-message-user">
                  <UserMessage.Content className="text-white" />
                </div>
              </MessageIf>
            </UserMessage>

            {/* AI Assistant messages */}
            <AssistantMessage className="mb-4">
              <MessageIf hasContent>
                <div className="chat-message-ai">
                  <AssistantMessage.Content className="text-gray-900" />
                  
                  {/* Action bar for message actions */}
                  <ActionBar className="mt-2 flex items-center gap-2">
                    <ActionBar.Copy className="text-xs text-gray-500 hover:text-gray-700" />
                    <ActionBar.Reload className="text-xs text-gray-500 hover:text-gray-700" />
                  </ActionBar>
                </div>
              </MessageIf>
              
              {/* Loading state for streaming responses */}
              <MessageIf.Loading>
                <div className="chat-message-ai">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-500">AI is thinking...</span>
                  </div>
                </div>
              </MessageIf.Loading>
            </AssistantMessage>

            {/* Branch picker for message variations */}
            <BranchPicker className="my-2">
              <BranchPicker.Previous className="text-xs text-blue-600 hover:text-blue-800" />
              <BranchPicker.Next className="text-xs text-blue-600 hover:text-blue-800" />
            </BranchPicker>
          </div>
        </Thread>

        {/* Message composer */}
        <div className="border-t bg-white p-4">
          <Composer className="relative">
            <div className="flex items-end gap-3">
              {/* Attachment button */}
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Text input */}
              <div className="flex-1 relative">
                <Composer.Input
                  className={cn(
                    "w-full resize-none border border-gray-300 rounded-lg px-4 py-3 pr-12",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    "placeholder:text-gray-400"
                  )}
                  placeholder="Ask about your career goals, skills, or get advice..."
                  autoFocus
                />
                
                {/* Send button */}
                <Composer.Send className="absolute right-2 top-1/2 -translate-y-1/2">
                  <button className="p-2 text-blue-600 hover:text-blue-800 transition-colors">
                    <Send className="w-5 h-5" />
                  </button>
                </Composer.Send>
              </div>

              {/* Voice input button */}
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Mic className="w-5 h-5" />
              </button>
            </div>

            {/* Character count and status */}
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>
                Powered by OpenRouter AI • Cost optimized routing
              </span>
              <Composer.If editing>
                <span>Editing message...</span>
              </Composer.If>
            </div>
          </Composer>
        </div>
      </div>
    </AssistantProvider>
  )
}

// Typing indicator component
export function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="typing-dot" style={{ animationDelay: '0ms' }} />
      <div className="typing-dot" style={{ animationDelay: '150ms' }} />
      <div className="typing-dot" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

// Message bubble component for custom styling
interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
  isLoading?: boolean
  functionCalls?: any[]
}

export function MessageBubble({ 
  role, 
  content, 
  timestamp, 
  isLoading,
  functionCalls 
}: MessageBubbleProps) {
  return (
    <div className={cn(
      'flex w-full mb-4',
      role === 'user' ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
        role === 'user' 
          ? 'bg-blue-500 text-white' 
          : 'bg-white border border-gray-200 text-gray-900'
      )}>
        {isLoading ? (
          <TypingIndicator />
        ) : (
          <>
            <p className="text-sm">{content}</p>
            
            {/* Function call results */}
            {functionCalls && functionCalls.length > 0 && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                <span className="font-medium">Actions performed:</span>
                <ul className="mt-1 space-y-1">
                  {functionCalls.map((call, index) => (
                    <li key={index} className="text-gray-600">
                      • {call.function}: {call.result?.message || 'Completed'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {timestamp && (
              <p className="text-xs mt-1 opacity-70">
                {new Date(timestamp).toLocaleTimeString()}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
} 