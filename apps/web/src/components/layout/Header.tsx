'use client'

import { Menu, Bell, Search } from 'lucide-react'
import { useUiStore, useAuthStore } from '@/store'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const { toggleMobileMenu, sidebarCollapsed } = useUiStore()
  const { user } = useAuthStore()

  return (
    <header 
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6',
        className
      )}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        {/* Page title or search will go here */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск..."
              className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
            3
          </span>
        </button>

        {/* User avatar/menu */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.name || 'Пользователь'}
              </p>
              <p className="text-xs text-gray-500">
                Онлайн
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700">
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 