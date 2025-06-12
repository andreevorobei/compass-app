// Application constants for Compass career coaching platform
// Centralized configuration values and enums

// Application metadata
export const APP_CONFIG = {
  name: 'Compass',
  description: 'AI-powered career coaching platform',
  version: '1.0.0',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const

// Skill categories for career development
export const SKILL_CATEGORIES = [
  'Technical Skills',
  'Leadership',
  'Communication',
  'Project Management',
  'Data Analysis',
  'Design',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'Strategy',
  'Other'
] as const

// Career goal categories
export const GOAL_CATEGORIES = [
  'skill_development',
  'career_change',
  'promotion',
  'salary_increase',
  'networking',
  'education',
  'certification',
  'work_life_balance'
] as const

// Goal priorities
export const GOAL_PRIORITIES = [
  'low',
  'medium', 
  'high',
  'critical'
] as const

// Goal statuses
export const GOAL_STATUSES = [
  'not_started',
  'in_progress',
  'completed',
  'paused',
  'cancelled'
] as const

// Skill proficiency levels (1-10 scale)
export const SKILL_LEVELS = {
  BEGINNER: { min: 1, max: 2, label: 'Beginner' },
  NOVICE: { min: 3, max: 4, label: 'Novice' },
  INTERMEDIATE: { min: 5, max: 6, label: 'Intermediate' },
  ADVANCED: { min: 7, max: 8, label: 'Advanced' },
  EXPERT: { min: 9, max: 10, label: 'Expert' }
} as const

// AI model types for different use cases
export const AI_USE_CASES = [
  'career_advice',
  'skill_assessment', 
  'goal_planning',
  'resume_review',
  'interview_prep',
  'market_analysis'
] as const

// Time periods for analytics
export const TIME_PERIODS = [
  '7d',   // 7 days
  '30d',  // 30 days
  '90d',  // 3 months
  '1y',   // 1 year
  'all'   // All time
] as const

// Progress tracking metrics
export const METRICS = {
  SKILLS_IMPROVED: 'skills_improved',
  GOALS_ACHIEVED: 'goals_achieved',
  SESSIONS_COMPLETED: 'sessions_completed',
  AI_INTERACTIONS: 'ai_interactions',
  PROFILE_UPDATES: 'profile_updates',
  ASSESSMENTS_TAKEN: 'assessments_taken'
} as const

// Default pagination settings
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1
} as const

// File upload constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  AVATAR_MAX_SIZE: 2 * 1024 * 1024, // 2MB for avatars
} as const

// Rate limiting settings
export const RATE_LIMITS = {
  AI_REQUESTS_PER_HOUR: 100,
  API_REQUESTS_PER_MINUTE: 60,
  PROFILE_UPDATES_PER_DAY: 50
} as const

// Chat settings
export const CHAT_SETTINGS = {
  MAX_MESSAGE_LENGTH: 4000,
  MAX_MESSAGES_PER_SESSION: 100,
  TYPING_INDICATOR_DELAY: 1000,
  AUTO_SAVE_DELAY: 2000
} as const

// Industry categories
export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Marketing',
  'Real Estate',
  'Media',
  'Government',
  'Non-Profit',
  'Other'
] as const

// Experience levels
export const EXPERIENCE_LEVELS = [
  'entry_level',
  'junior',
  'mid_level',
  'senior',
  'lead',
  'manager',
  'director',
  'executive'
] as const

// Common career paths
export const CAREER_PATHS = [
  'individual_contributor',
  'management',
  'consulting',
  'entrepreneurship',
  'freelance',
  'academic',
  'government',
  'non_profit'
] as const

// Notification types
export const NOTIFICATION_TYPES = [
  'goal_reminder',
  'skill_suggestion',
  'progress_update',
  'achievement',
  'system_update',
  'chat_message'
] as const

// Achievement types
export const ACHIEVEMENT_TYPES = [
  'first_goal',
  'skill_master',
  'consistent_learner',
  'goal_achiever',
  'profile_complete',
  'session_milestone'
] as const

// Color palette for charts and UI
export const COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#06b6d4',
  PURPLE: '#8b5cf6',
  PINK: '#ec4899',
  ORANGE: '#f97316'
} as const 