// Upstash Redis client for serverless caching
// HTTP-based API perfect for Edge functions
// Pay-per-request pricing model

import { Redis } from '@upstash/redis'

// Initialize Upstash Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache key prefixes for different data types
export const CACHE_PREFIXES = {
  USER_PROFILE: 'profile:',
  CHAT_HISTORY: 'chat:',
  AI_RESPONSES: 'ai:',
  SKILLS_DATA: 'skills:',
  GOALS_DATA: 'goals:',
  ANALYTICS: 'analytics:',
} as const

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 300,     // 5 minutes
  MEDIUM: 3600,   // 1 hour  
  LONG: 86400,    // 24 hours
  PERMANENT: -1,  // No expiration
} as const

// Helper functions for common caching operations
export class CacheManager {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const result = await redis.get(key)
      return result as T
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  static async set<T>(
    key: string, 
    value: T, 
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<boolean> {
    try {
      if (ttl === CACHE_TTL.PERMANENT) {
        await redis.set(key, value)
      } else {
        await redis.setex(key, ttl, value)
      }
      return true
    } catch (error) {
      console.error('Cache set error:', error)
      return false
    }
  }

  static async delete(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.error('Cache delete error:', error)
      return false
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key)
      return result === 1
    } catch (error) {
      console.error('Cache exists error:', error)
      return false
    }
  }

  // Cache user profile with automatic key generation
  static async cacheUserProfile(userId: string, profile: any): Promise<boolean> {
    const key = `${CACHE_PREFIXES.USER_PROFILE}${userId}`
    return this.set(key, profile, CACHE_TTL.LONG)
  }

  // Get cached user profile
  static async getUserProfile<T>(userId: string): Promise<T | null> {
    const key = `${CACHE_PREFIXES.USER_PROFILE}${userId}`
    return this.get<T>(key)
  }

  // Cache AI response to avoid duplicate API calls
  static async cacheAIResponse(
    promptHash: string, 
    response: any
  ): Promise<boolean> {
    const key = `${CACHE_PREFIXES.AI_RESPONSES}${promptHash}`
    return this.set(key, response, CACHE_TTL.MEDIUM)
  }

  // Get cached AI response
  static async getAIResponse<T>(promptHash: string): Promise<T | null> {
    const key = `${CACHE_PREFIXES.AI_RESPONSES}${promptHash}`
    return this.get<T>(key)
  }

  // Cache chat history for session continuity
  static async cacheChatHistory(
    sessionId: string, 
    messages: any[]
  ): Promise<boolean> {
    const key = `${CACHE_PREFIXES.CHAT_HISTORY}${sessionId}`
    return this.set(key, messages, CACHE_TTL.LONG)
  }

  // Get cached chat history
  static async getChatHistory<T>(sessionId: string): Promise<T | null> {
    const key = `${CACHE_PREFIXES.CHAT_HISTORY}${sessionId}`
    return this.get<T>(key)
  }
} 