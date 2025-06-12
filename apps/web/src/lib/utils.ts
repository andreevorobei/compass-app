// Utility functions for Compass career coaching application
// Common helpers for data processing, formatting, and validation

import { clsx, type ClassValue } from 'clsx'

// Tailwind CSS class name utility
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Format date for display
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffInMs = now.getTime() - target.getTime()
  
  const seconds = Math.floor(diffInMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

// Calculate progress percentage between two values
export function calculateProgress(current: number, target: number): number {
  if (target <= 0) return 0
  return Math.min(Math.round((current / target) * 100), 100)
}

// Generate a simple hash for string (for caching keys)
export function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Format skill level (1-10) to descriptive text
export function formatSkillLevel(level: number): string {
  if (level <= 2) return 'Beginner'
  if (level <= 4) return 'Novice'
  if (level <= 6) return 'Intermediate'
  if (level <= 8) return 'Advanced'
  return 'Expert'
}

// Calculate skill gap (difference between current and target)
export function calculateSkillGap(current: number, target: number): {
  gap: number
  percentage: number
  status: 'on-track' | 'at-risk' | 'critical'
} {
  const gap = target - current
  const percentage = target > 0 ? (current / target) * 100 : 0
  
  let status: 'on-track' | 'at-risk' | 'critical'
  if (percentage >= 80) status = 'on-track'
  else if (percentage >= 50) status = 'at-risk'
  else status = 'critical'
  
  return { gap, percentage, status }
}

// Generate initials from full name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

// Format large numbers (1000 -> 1K, 1000000 -> 1M)
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate random color for avatars/charts
export function generateColor(seed: string): string {
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#14b8a6'
  ]
  
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

// Sleep function for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Safe JSON parse with fallback
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

// Generate unique ID (simple version)
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
} 