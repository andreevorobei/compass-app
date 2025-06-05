// Supabase client for authentication and persistent storage
// Provides real-time database and authentication for career coaching data

import { createClientComponentClient, createServerComponentClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Client-side Supabase client
export const createClient = () =>
  createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  })

// Server-side Supabase client (for API routes and server components)
export const createServerClient = () =>
  createServerComponentClient({
    cookies,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  })

// Database table names
export const TABLES = {
  PROFILES: 'profiles',
  SKILLS: 'skills',
  GOALS: 'goals',
  CHAT_SESSIONS: 'chat_sessions',
  CHAT_MESSAGES: 'chat_messages',
  PROGRESS_TRACKING: 'progress_tracking',
  AI_USAGE: 'ai_usage',
} as const

// Database schemas for TypeScript
export interface Profile {
  id: string
  user_id: string
  full_name: string
  email: string
  avatar_url?: string
  current_role?: string
  experience_years?: number
  industry?: string
  location?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  user_id: string
  name: string
  category: string
  proficiency_level: number // 1-10 scale
  target_level?: number
  is_core_skill: boolean
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description?: string
  category: 'short_term' | 'long_term' | 'skill_development' | 'career_change'
  target_date?: string
  status: 'not_started' | 'in_progress' | 'completed' | 'paused'
  priority: 'low' | 'medium' | 'high'
  progress_percentage: number
  created_at: string
  updated_at: string
}

export interface ChatSession {
  id: string
  user_id: string
  title?: string
  status: 'active' | 'archived'
  message_count: number
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  user_id: string
  role: 'user' | 'assistant' | 'function'
  content: string
  metadata?: any // For function calling results, model info, etc.
  created_at: string
}

export interface ProgressTracking {
  id: string
  user_id: string
  skill_id?: string
  goal_id?: string
  metric_name: string
  metric_value: number
  notes?: string
  recorded_at: string
}

export interface AIUsage {
  id: string
  user_id: string
  session_id?: string
  model_name: string
  tokens_used: number
  cost_usd: number
  request_type: 'chat' | 'function_call' | 'analysis'
  created_at: string
}

// Type for database operations
export type Database = {
  public: {
    Tables: {
      [TABLES.PROFILES]: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      [TABLES.SKILLS]: {
        Row: Skill
        Insert: Omit<Skill, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Skill, 'id' | 'created_at'>>
      }
      [TABLES.GOALS]: {
        Row: Goal
        Insert: Omit<Goal, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Goal, 'id' | 'created_at'>>
      }
      [TABLES.CHAT_SESSIONS]: {
        Row: ChatSession
        Insert: Omit<ChatSession, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ChatSession, 'id' | 'created_at'>>
      }
      [TABLES.CHAT_MESSAGES]: {
        Row: ChatMessage
        Insert: Omit<ChatMessage, 'id' | 'created_at'>
        Update: Partial<Omit<ChatMessage, 'id' | 'created_at'>>
      }
      [TABLES.PROGRESS_TRACKING]: {
        Row: ProgressTracking
        Insert: Omit<ProgressTracking, 'id'>
        Update: Partial<Omit<ProgressTracking, 'id'>>
      }
      [TABLES.AI_USAGE]: {
        Row: AIUsage
        Insert: Omit<AIUsage, 'id' | 'created_at'>
        Update: Partial<Omit<AIUsage, 'id' | 'created_at'>>
      }
    }
  }
} 