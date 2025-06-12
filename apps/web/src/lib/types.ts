// Global TypeScript types for Compass career coaching platform
// Shared interfaces and type definitions

// User and authentication types
export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

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
  skills: Skill[]
  goals: Goal[]
  created_at: string
  updated_at: string
}

// Skill-related types
export interface Skill {
  id: string
  user_id: string
  name: string
  category: string
  proficiency_level: number // 1-10 scale
  target_level?: number
  is_core_skill: boolean
  progress_history: ProgressEntry[]
  created_at: string
  updated_at: string
}

export interface SkillAssessment {
  skill_id: string
  skill_name: string
  current_level: number
  target_level: number
  gap: number
  suggestions: string[]
  priority: 'low' | 'medium' | 'high'
}

// Goal-related types
export interface Goal {
  id: string
  user_id: string
  title: string
  description?: string
  category: GoalCategory
  target_date?: string
  status: GoalStatus
  priority: GoalPriority
  progress_percentage: number
  milestones: Milestone[]
  created_at: string
  updated_at: string
}

export interface Milestone {
  id: string
  goal_id: string
  title: string
  description?: string
  due_date?: string
  completed: boolean
  completed_at?: string
}

export type GoalCategory = 
  | 'skill_development'
  | 'career_change'
  | 'promotion'
  | 'salary_increase'
  | 'networking'
  | 'education'
  | 'certification'
  | 'work_life_balance'

export type GoalStatus = 
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'paused'
  | 'cancelled'

export type GoalPriority = 'low' | 'medium' | 'high' | 'critical'

// Chat and AI types
export interface ChatSession {
  id: string
  user_id: string
  title?: string
  status: 'active' | 'archived'
  messages: ChatMessage[]
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
  metadata?: {
    model?: string
    tokens_used?: number
    cost?: number
    function_calls?: FunctionCall[]
    attachments?: string[]
  }
  created_at: string
}

export interface FunctionCall {
  name: string
  arguments: Record<string, any>
  result?: any
  error?: string
}

// AI and model types
export interface AIModel {
  id: string
  name: string
  provider: string
  cost_per_1k_tokens: number
  capabilities: string[]
  max_tokens: number
  use_case: 'chat' | 'analysis' | 'reasoning' | 'function-calling'
}

export interface AIResponse {
  content: string
  model: string
  tokens_used: number
  cost: number
  function_calls?: FunctionCall[]
  metadata?: Record<string, any>
}

// Progress tracking types
export interface ProgressEntry {
  id: string
  user_id: string
  skill_id?: string
  goal_id?: string
  metric_name: string
  metric_value: number
  previous_value?: number
  change_percentage?: number
  notes?: string
  recorded_at: string
}

export interface AnalyticsData {
  user_id: string
  time_period: string
  metrics: {
    skills_improved: number
    goals_achieved: number
    sessions_completed: number
    ai_interactions: number
    profile_updates: number
    assessments_taken: number
  }
  trends: {
    [key: string]: {
      current: number
      previous: number
      change_percentage: number
    }
  }
  skill_progress: {
    skill_name: string
    progress: number[]
    dates: string[]
  }[]
  goal_completion_rate: number
  generated_at: string
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  pagination?: {
    page: number
    page_size: number
    total_pages: number
    total_items: number
  }
}

export interface PaginationParams {
  page?: number
  page_size?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  filter?: Record<string, any>
}

// Form and validation types
export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface FormState<T = any> {
  data: T
  errors: ValidationError[]
  isLoading: boolean
  isSubmitted: boolean
  isDirty: boolean
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface MetricCardProps extends BaseComponentProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
  }
  trend?: number[]
  icon?: React.ComponentType<{ className?: string }>
  color?: string
}

export interface ChartProps extends BaseComponentProps {
  data: any[]
  height?: number
  colors?: string[]
  showGrid?: boolean
  showLegend?: boolean
}

// Cache and storage types
export interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number
}

export interface StorageOptions {
  prefix?: string
  ttl?: number
  serialize?: boolean
}

// Event and tracking types
export interface TrackingEvent {
  event_name: string
  user_id?: string
  session_id?: string
  properties?: Record<string, any>
  timestamp: string
}

export type EventName = 
  | 'page_view'
  | 'skill_updated'
  | 'goal_created'
  | 'chat_message_sent'
  | 'ai_response_received'
  | 'profile_updated'
  | 'assessment_completed'

// Notification types
export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  read: boolean
  data?: Record<string, any>
  created_at: string
}

// Generic utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
} 