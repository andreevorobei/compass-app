// Specialized cache utilities for different data types in Compass
// Optimized for career coaching use cases with smart invalidation

import { CacheManager, CACHE_PREFIXES, CACHE_TTL } from './client'

// User profile caching with smart updates
export class ProfileCache {
  static async getProfile(userId: string) {
    return CacheManager.getUserProfile(userId)
  }

  static async updateProfile(userId: string, updates: Partial<any>) {
    const existing = await this.getProfile(userId)
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() }
    return CacheManager.cacheUserProfile(userId, updated)
  }

  static async invalidateProfile(userId: string) {
    const key = `${CACHE_PREFIXES.USER_PROFILE}${userId}`
    return CacheManager.delete(key)
  }
}

// Skills data caching with progress tracking
export class SkillsCache {
  static async getSkills(userId: string) {
    const key = `${CACHE_PREFIXES.SKILLS_DATA}${userId}`
    return CacheManager.get(key)
  }

  static async updateSkillProgress(
    userId: string, 
    skillName: string, 
    progress: number
  ) {
    const key = `${CACHE_PREFIXES.SKILLS_DATA}${userId}`
    const skills = await this.getSkills(userId) || {}
    
    skills[skillName] = {
      progress,
      lastUpdated: new Date().toISOString(),
      ...skills[skillName]
    }
    
    return CacheManager.set(key, skills, CACHE_TTL.LONG)
  }

  static async addSkill(userId: string, skill: any) {
    const key = `${CACHE_PREFIXES.SKILLS_DATA}${userId}`
    const skills = await this.getSkills(userId) || {}
    
    skills[skill.name] = {
      ...skill,
      addedAt: new Date().toISOString()
    }
    
    return CacheManager.set(key, skills, CACHE_TTL.LONG)
  }
}

// Goals caching with status tracking
export class GoalsCache {
  static async getGoals(userId: string) {
    const key = `${CACHE_PREFIXES.GOALS_DATA}${userId}`
    return CacheManager.get(key)
  }

  static async addGoal(userId: string, goal: any) {
    const key = `${CACHE_PREFIXES.GOALS_DATA}${userId}`
    const goals = await this.getGoals(userId) || []
    
    const newGoal = {
      id: Date.now().toString(),
      ...goal,
      status: 'active',
      createdAt: new Date().toISOString()
    }
    
    goals.push(newGoal)
    return CacheManager.set(key, goals, CACHE_TTL.LONG)
  }

  static async updateGoalStatus(
    userId: string, 
    goalId: string, 
    status: string
  ) {
    const key = `${CACHE_PREFIXES.GOALS_DATA}${userId}`
    const goals = await this.getGoals(userId) || []
    
    const goalIndex = goals.findIndex((g: any) => g.id === goalId)
    if (goalIndex !== -1) {
      goals[goalIndex].status = status
      goals[goalIndex].updatedAt = new Date().toISOString()
    }
    
    return CacheManager.set(key, goals, CACHE_TTL.LONG)
  }
}

// Analytics caching for performance metrics
export class AnalyticsCache {
  static async getAnalytics(userId: string, timeframe: string = '30d') {
    const key = `${CACHE_PREFIXES.ANALYTICS}${userId}:${timeframe}`
    return CacheManager.get(key)
  }

  static async updateAnalytics(
    userId: string, 
    timeframe: string, 
    data: any
  ) {
    const key = `${CACHE_PREFIXES.ANALYTICS}${userId}:${timeframe}`
    return CacheManager.set(key, data, CACHE_TTL.MEDIUM)
  }

  static async incrementMetric(
    userId: string, 
    metricName: string, 
    value: number = 1
  ) {
    const analytics = await this.getAnalytics(userId) || {}
    analytics[metricName] = (analytics[metricName] || 0) + value
    analytics.lastUpdated = new Date().toISOString()
    
    return this.updateAnalytics(userId, '30d', analytics)
  }
}

// Utility function to generate cache keys with hash
export function generateCacheKey(
  prefix: string, 
  ...identifiers: string[]
): string {
  return `${prefix}${identifiers.join(':')}`
}

// Utility function to create prompt hash for AI response caching
export function createPromptHash(prompt: string, context?: any): string {
  const combined = JSON.stringify({ prompt, context })
  // Simple hash function - in production, use a proper hash library
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
} 