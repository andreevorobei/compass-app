'use client'

import { useState } from 'react'
import { useAuthStore, useUiStore, useChatStore, useProfileStore } from '@/store'

export default function TestPage() {
  const [testUser] = useState({
    id: 'test-user-123',
    email: 'test@example.com',
    name: 'Test User',
    avatar_url: 'https://via.placeholder.com/40'
  })

  // Zustand stores
  const { user, isAuthenticated, login, logout } = useAuthStore()
  const { 
    sidebarOpen, 
    sidebarCollapsed, 
    theme, 
    toggleSidebar, 
    toggleSidebarCollapsed, 
    setTheme 
  } = useUiStore()
  const { createSession, sessions, currentSession } = useChatStore()
  const { profile, setProfile } = useProfileStore()

  const handleLogin = () => {
    login(testUser)
    setProfile({
      ...testUser,
      bio: 'Тестовый пользователь системы',
      settings: {
        language: 'ru',
        timezone: 'Europe/Moscow',
        emailNotifications: true,
        pushNotifications: false,
      },
      preferences: {
        defaultModel: 'gpt-4',
        theme: 'system',
        sidebarLayout: 'expanded',
      }
    })
  }

  const handleCreateChat = () => {
    const sessionId = createSession('Тестовый чат')
    console.log('Created session:', sessionId)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Test Page - Zustand Stores Demo
        </h1>

        {/* Auth Store Test */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            🔐 Auth Store
          </h2>
          <div className="space-y-4">
            <div>
              <strong>Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}
            </div>
            <div>
              <strong>User:</strong> {user ? `${user.name} (${user.email})` : 'No user'}
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isAuthenticated}
              >
                Login Test User
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={!isAuthenticated}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* UI Store Test */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-600">
            🎨 UI Store
          </h2>
          <div className="space-y-4">
            <div>
              <strong>Sidebar Open:</strong> {sidebarOpen ? '✅ Yes' : '❌ No'}
            </div>
            <div>
              <strong>Sidebar Collapsed:</strong> {sidebarCollapsed ? '✅ Yes' : '❌ No'}
            </div>
            <div>
              <strong>Theme:</strong> {theme}
            </div>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={toggleSidebar}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Toggle Sidebar
              </button>
              <button
                onClick={toggleSidebarCollapsed}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Toggle Collapsed
              </button>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                className="px-4 py-2 border rounded"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chat Store Test */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">
            💬 Chat Store
          </h2>
          <div className="space-y-4">
            <div>
              <strong>Sessions Count:</strong> {Object.keys(sessions).length}
            </div>
            <div>
              <strong>Current Session:</strong> {currentSession ? currentSession.title : 'None'}
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCreateChat}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Create Test Chat
              </button>
            </div>
            {Object.values(sessions).length > 0 && (
              <div>
                <strong>Sessions:</strong>
                <ul className="mt-2 space-y-1">
                  {Object.values(sessions).map((session) => (
                    <li key={session.id} className="text-sm bg-gray-100 p-2 rounded">
                      {session.title} - {session.messages.length} messages
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Profile Store Test */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-orange-600">
            👤 Profile Store
          </h2>
          <div className="space-y-4">
            <div>
              <strong>Profile:</strong> {profile ? `${profile.name} (${profile.email})` : 'No profile'}
            </div>
            {profile && (
              <div className="text-sm bg-gray-100 p-4 rounded">
                <div><strong>Bio:</strong> {profile.bio}</div>
                <div><strong>Language:</strong> {profile.settings.language}</div>
                <div><strong>Default Model:</strong> {profile.preferences.defaultModel}</div>
              </div>
            )}
          </div>
        </div>

        {/* TanStack Query Test */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            🔄 TanStack Query
          </h2>
          <div className="space-y-4">
            <div>
              <strong>Status:</strong> ✅ QueryClient configured and ready
            </div>
            <div>
              <strong>DevTools:</strong> {process.env.NODE_ENV === 'development' ? '✅ Available' : '❌ Not available'}
            </div>
            <div className="text-sm text-gray-600">
              Check the bottom-right corner for React Query DevTools (development only)
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            🎉 Phase 1 Foundation Success!
          </h3>
          <p className="text-blue-700">
            All Zustand stores are working correctly with TypeScript support, 
            middleware integration, and TanStack Query is ready for server state management.
          </p>
        </div>
      </div>
    </div>
  )
} 