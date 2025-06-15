'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  MessageSquare, 
  Target, 
  BarChart3, 
  User, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Compass
} from 'lucide-react'
import { useUiStore, useAuthStore } from '@/store'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    name: 'Главная',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'AI Чат',
    href: '/dashboard/chat',
    icon: MessageSquare,
  },
  {
    name: 'Цели',
    href: '/dashboard/goals',
    icon: Target,
  },
  {
    name: 'Аналитика',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    name: 'Профиль',
    href: '/dashboard/profile',
    icon: User,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { sidebarCollapsed, sidebarOpen, toggleSidebarCollapsed, setSidebarOpen } = useUiStore()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    // Redirect будет обработан в layout или middleware
  }

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
          // Mobile styles
          'lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop width based on collapsed state
          sidebarCollapsed ? 'w-16 lg:w-16' : 'w-64 lg:w-64',
          className
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center px-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Compass AI</h2>
              </div>
            )}
          </div>
          
          {/* Collapse toggle - Desktop only */}
          <button
            onClick={toggleSidebarCollapsed}
            className={cn(
              'hidden lg:flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-100 transition-colors ml-auto',
              sidebarCollapsed && 'ml-0'
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                  sidebarCollapsed && 'justify-center px-2'
                )}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-blue-700')} />
                {!sidebarCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-3">
          {user && (
            <div className={cn('flex items-center gap-3 mb-3', sidebarCollapsed && 'justify-center')}>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Settings and Logout */}
          <div className="space-y-1">
            <Link
              href="/dashboard/settings"
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors',
                sidebarCollapsed && 'justify-center px-2'
              )}
              title={sidebarCollapsed ? 'Настройки' : undefined}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>Настройки</span>}
            </Link>

            <button
              onClick={handleLogout}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-700 rounded-md hover:bg-red-50 transition-colors',
                sidebarCollapsed && 'justify-center px-2'
              )}
              title={sidebarCollapsed ? 'Выйти' : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>Выйти</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 