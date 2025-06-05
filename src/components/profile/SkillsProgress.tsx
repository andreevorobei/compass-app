// Skills progress visualization using @ramonak/react-progress-bar
// Real-time updates from AI conversation analysis
// Animated progress bars with custom styling

'use client'

import React from 'react'
import ProgressBar from '@ramonak/react-progress-bar'
import { formatSkillLevel, calculateSkillGap } from '@/lib/utils'
import { getProgressColor } from '@/integrations/tremor/theme'
import { Skill } from '@/lib/types'
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react'

interface SkillsProgressProps {
  skills: Skill[]
  className?: string
  showTargets?: boolean
  animated?: boolean
}

export function SkillsProgress({ 
  skills, 
  className,
  showTargets = true,
  animated = true 
}: SkillsProgressProps) {
  return (
    <div className={`skill-progress-container ${className || ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Skills Progress</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Award className="w-4 h-4" />
          <span>{skills.length} skills tracked</span>
        </div>
      </div>

      <div className="space-y-6">
        {skills.map((skill) => (
          <SkillProgressItem
            key={skill.id}
            skill={skill}
            showTarget={showTargets}
            animated={animated}
          />
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No skills tracked yet</p>
          <p className="text-sm">Start a conversation with AI to identify your skills</p>
        </div>
      )}
    </div>
  )
}

interface SkillProgressItemProps {
  skill: Skill
  showTarget?: boolean
  animated?: boolean
}

function SkillProgressItem({ skill, showTarget, animated }: SkillProgressItemProps) {
  const currentProgress = (skill.proficiency_level / 10) * 100
  const targetProgress = skill.target_level ? (skill.target_level / 10) * 100 : 100
  
  const gap = calculateSkillGap(skill.proficiency_level, skill.target_level || 10)
  
  return (
    <div className="skill-item p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h4 className="font-medium text-gray-900">{skill.name}</h4>
            <span className="text-sm text-gray-500">{skill.category}</span>
          </div>
          
          {skill.is_core_skill && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Core Skill
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {formatSkillLevel(skill.proficiency_level)}
          </span>
          <span className="text-xs text-gray-500">
            {skill.proficiency_level}/10
          </span>
        </div>
      </div>

      {/* Current Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600">Current Level</span>
          <span className="text-xs text-gray-600">{currentProgress.toFixed(0)}%</span>
        </div>
        
        <ProgressBar
          completed={currentProgress}
          bgcolor={getProgressColor(currentProgress)}
          height="8px"
          isLabelVisible={false}
          animateOnRender={animated}
          transitionDuration="1s"
          transitionTimingFunction="ease-in-out"
        />
      </div>

      {/* Target Progress Bar */}
      {showTarget && skill.target_level && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Target Level
            </span>
            <span className="text-xs text-gray-600">{targetProgress.toFixed(0)}%</span>
          </div>
          
          <ProgressBar
            completed={targetProgress}
            bgcolor="#e5e7eb"
            height="4px"
            isLabelVisible={false}
            animateOnRender={false}
          />
        </div>
      )}

      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProgressIndicator status={gap.status} />
          <span className="text-xs text-gray-600">
            {gap.status === 'on-track' && 'On track'}
            {gap.status === 'at-risk' && 'Needs attention'}
            {gap.status === 'critical' && 'Priority skill'}
          </span>
        </div>

        {skill.target_level && (
          <div className="text-xs text-gray-500">
            {gap.gap > 0 ? `${gap.gap} levels to target` : 'Target achieved!'}
          </div>
        )}
      </div>

      {/* Recent Progress */}
      {skill.progress_history && skill.progress_history.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <RecentProgress history={skill.progress_history.slice(-3)} />
        </div>
      )}
    </div>
  )
}

interface ProgressIndicatorProps {
  status: 'on-track' | 'at-risk' | 'critical'
}

function ProgressIndicator({ status }: ProgressIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'on-track': return 'text-emerald-500'
      case 'at-risk': return 'text-amber-500'
      case 'critical': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'on-track': return <TrendingUp className="w-3 h-3" />
      case 'at-risk': return <TrendingDown className="w-3 h-3" />
      case 'critical': return <TrendingDown className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <div className={`flex items-center ${getStatusColor()}`}>
      {getStatusIcon()}
    </div>
  )
}

interface RecentProgressProps {
  history: any[]
}

function RecentProgress({ history }: RecentProgressProps) {
  if (history.length === 0) return null

  return (
    <div>
      <h5 className="text-xs font-medium text-gray-700 mb-2">Recent Progress</h5>
      <div className="space-y-1">
        {history.map((entry, index) => (
          <div key={index} className="flex items-center justify-between text-xs text-gray-600">
            <span>{entry.metric_name}</span>
            <span className="flex items-center gap-1">
              {entry.change_percentage && entry.change_percentage > 0 ? (
                <TrendingUp className="w-3 h-3 text-emerald-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              {entry.metric_value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Quick stats component for skills overview
interface SkillsStatsProps {
  skills: Skill[]
}

export function SkillsStats({ skills }: SkillsStatsProps) {
  const totalSkills = skills.length
  const coreSkills = skills.filter(s => s.is_core_skill).length
  const averageLevel = skills.length > 0 
    ? skills.reduce((sum, s) => sum + s.proficiency_level, 0) / skills.length 
    : 0

  const skillsOnTrack = skills.filter(s => {
    const gap = calculateSkillGap(s.proficiency_level, s.target_level || 10)
    return gap.status === 'on-track'
  }).length

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center p-4 bg-white rounded-lg border">
        <div className="text-2xl font-bold text-gray-900">{totalSkills}</div>
        <div className="text-sm text-gray-600">Total Skills</div>
      </div>
      
      <div className="text-center p-4 bg-white rounded-lg border">
        <div className="text-2xl font-bold text-blue-600">{coreSkills}</div>
        <div className="text-sm text-gray-600">Core Skills</div>
      </div>
      
      <div className="text-center p-4 bg-white rounded-lg border">
        <div className="text-2xl font-bold text-emerald-600">
          {averageLevel.toFixed(1)}
        </div>
        <div className="text-sm text-gray-600">Avg Level</div>
      </div>
      
      <div className="text-center p-4 bg-white rounded-lg border">
        <div className="text-2xl font-bold text-purple-600">{skillsOnTrack}</div>
        <div className="text-sm text-gray-600">On Track</div>
      </div>
    </div>
  )
} 