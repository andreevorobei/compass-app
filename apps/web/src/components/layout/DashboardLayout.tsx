'use client'

import { ReactNode, useEffect } from 'react'
import { useUiStore } from '@/store'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const { sidebarCollapsed, mobileMenuOpen, setMobileMenuOpen } = useUiStore()

  // Close mobile menu on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileMenuOpen, setMobileMenuOpen])

  // Sync mobile menu with sidebar open state
  useEffect(() => {
    const { sidebarOpen, setSidebarOpen } = useUiStore.getState()
    if (mobileMenuOpen !== sidebarOpen) {
      setSidebarOpen(mobileMenuOpen)
    }
  }, [mobileMenuOpen])

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main 
          className={cn(
            'flex-1 overflow-auto',
            className
          )}
        >
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 