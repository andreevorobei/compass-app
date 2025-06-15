import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Типы для сообщений
interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  model?: string
  tokens?: number
}

// Типы для чата
interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  model: string
  createdAt: Date
  updatedAt: Date
}

// Состояние чата
interface ChatState {
  // Текущая сессия
  currentSession: ChatSession | null
  
  // Все сессии
  sessions: Record<string, ChatSession>
  
  // Состояние загрузки
  isLoading: boolean
  isTyping: boolean
  
  // Настройки чата
  settings: {
    model: string
    temperature: number
    maxTokens: number
    systemPrompt: string
  }
}

// Действия для чата
interface ChatActions {
  // Сессии
  createSession: (title?: string) => string
  setCurrentSession: (sessionId: string | null) => void
  deleteSession: (sessionId: string) => void
  updateSessionTitle: (sessionId: string, title: string) => void
  
  // Сообщения
  addMessage: (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  updateMessage: (sessionId: string, messageId: string, content: string) => void
  deleteMessage: (sessionId: string, messageId: string) => void
  clearMessages: (sessionId: string) => void
  
  // Состояние
  setLoading: (loading: boolean) => void
  setTyping: (typing: boolean) => void
  
  // Настройки
  updateSettings: (settings: Partial<ChatState['settings']>) => void
  
  // Сброс состояния
  reset: () => void
}

// Объединенный тип store
type ChatStore = ChatState & ChatActions

// Функция для создания нового сообщения
const createMessage = (content: string, role: ChatMessage['role']): ChatMessage => ({
  id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  content,
  role,
  timestamp: new Date(),
})

// Функция для создания новой сессии
const createSessionObject = (title?: string): ChatSession => ({
  id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  title: title || `Чат ${new Date().toLocaleDateString()}`,
  messages: [],
  model: 'gpt-4',
  createdAt: new Date(),
  updatedAt: new Date(),
})

// Начальное состояние
const initialState: ChatState = {
  currentSession: null,
  sessions: {},
  isLoading: false,
  isTyping: false,
  settings: {
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: 'Ты полезный AI ассистент.',
  },
}

// Создаем Zustand store для чата с Immer middleware
export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        // Создать новую сессию
        createSession: (title) => {
          const session = createSessionObject(title)
          set((state) => {
            state.sessions[session.id] = session
            state.currentSession = session
          })
          return session.id
        },
        
        // Установить текущую сессию
        setCurrentSession: (sessionId) => set((state) => {
          state.currentSession = sessionId ? state.sessions[sessionId] || null : null
        }),
        
        // Удалить сессию
        deleteSession: (sessionId) => set((state) => {
          delete state.sessions[sessionId]
          if (state.currentSession?.id === sessionId) {
            state.currentSession = null
          }
        }),
        
        // Обновить заголовок сессии
        updateSessionTitle: (sessionId, title) => set((state) => {
          if (state.sessions[sessionId]) {
            state.sessions[sessionId].title = title
            state.sessions[sessionId].updatedAt = new Date()
          }
        }),
        
        // Добавить сообщение
        addMessage: (sessionId, messageData) => set((state) => {
          if (state.sessions[sessionId]) {
            const message = createMessage(messageData.content, messageData.role)
            state.sessions[sessionId].messages.push(message)
            state.sessions[sessionId].updatedAt = new Date()
          }
        }),
        
        // Обновить сообщение
        updateMessage: (sessionId, messageId, content) => set((state) => {
          const session = state.sessions[sessionId]
          if (session) {
            const message = session.messages.find(m => m.id === messageId)
            if (message) {
              message.content = content
              session.updatedAt = new Date()
            }
          }
        }),
        
        // Удалить сообщение
        deleteMessage: (sessionId, messageId) => set((state) => {
          const session = state.sessions[sessionId]
          if (session) {
            session.messages = session.messages.filter(m => m.id !== messageId)
            session.updatedAt = new Date()
          }
        }),
        
        // Очистить сообщения
        clearMessages: (sessionId) => set((state) => {
          if (state.sessions[sessionId]) {
            state.sessions[sessionId].messages = []
            state.sessions[sessionId].updatedAt = new Date()
          }
        }),
        
        // Состояние загрузки
        setLoading: (isLoading) => set((state) => {
          state.isLoading = isLoading
        }),
        
        setTyping: (isTyping) => set((state) => {
          state.isTyping = isTyping
        }),
        
        // Обновить настройки
        updateSettings: (newSettings) => set((state) => {
          Object.assign(state.settings, newSettings)
        }),
        
        // Сброс состояния
        reset: () => set(initialState),
      })),
      {
        name: 'compass-chat-storage',
        // Сохраняем все кроме состояний загрузки
        partialize: (state) => ({
          sessions: state.sessions,
          currentSession: state.currentSession,
          settings: state.settings,
        }),
      }
    ),
    { name: 'ChatStore' }
  )
)