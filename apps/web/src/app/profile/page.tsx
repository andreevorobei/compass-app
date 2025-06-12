'use client'

import Link from 'next/link'
import { ArrowLeft, User, TrendingUp, Award } from 'lucide-react'
import ProgressBar from '@ramonak/react-progress-bar'

export default function ProfilePage() {
  const skills = [
    { name: 'JavaScript', level: 85, category: 'Technical' },
    { name: 'React', level: 78, category: 'Technical' },
    { name: 'Leadership', level: 65, category: 'Soft Skills' },
    { name: 'Communication', level: 72, category: 'Soft Skills' },
    { name: 'Project Management', level: 58, category: 'Management' },
    { name: 'Data Analysis', level: 45, category: 'Technical' },
  ]

  const achievements = [
    { title: 'Quick Learner', description: 'Completed 5 skill assessments', icon: '🚀' },
    { title: 'Goal Setter', description: 'Set and tracked 3 career goals', icon: '🎯' },
    { title: 'Consistent', description: '7-day learning streak', icon: '⚡' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Alex Thompson</h2>
                <p className="text-gray-600 mb-1">Software Developer</p>
                <p className="text-sm text-gray-500">3 years experience</p>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xl">{achievement.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{achievement.title}</p>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Skills Progress
              </h3>
              
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={index} className="progress-skill">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({skill.category})</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{skill.level}%</span>
                    </div>
                    <ProgressBar
                      completed={skill.level}
                      height="8px"
                      borderRadius="4px"
                      baseBgColor="#e5e7eb"
                      bgColor={
                        skill.level >= 80 ? "#10b981" :
                        skill.level >= 60 ? "#3b82f6" :
                        skill.level >= 40 ? "#f59e0b" : "#ef4444"
                      }
                      labelClassName="hidden"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 AI Insight:</strong> Your JavaScript and React skills are strong! 
                  Consider focusing on Data Analysis to complement your technical skills, 
                  or develop Leadership skills for senior roles.
                </p>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">
                  🚧 Skills are automatically updated based on your conversations with the AI coach.
                </p>
                <Link 
                  href="/chat"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  Start Learning Session
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 