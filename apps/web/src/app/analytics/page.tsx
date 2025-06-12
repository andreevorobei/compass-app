'use client'

import Link from 'next/link'
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Target } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

export default function AnalyticsPage() {
  const skillProgressData = [
    { month: 'Jan', javascript: 70, react: 65, leadership: 45 },
    { month: 'Feb', javascript: 75, react: 68, leadership: 50 },
    { month: 'Mar', javascript: 78, react: 72, leadership: 55 },
    { month: 'Apr', javascript: 82, react: 75, leadership: 60 },
    { month: 'May', javascript: 85, react: 78, leadership: 65 },
  ]

  const goalCompletionData = [
    { name: 'Technical Skills', completed: 8, total: 12 },
    { name: 'Soft Skills', completed: 5, total: 8 },
    { name: 'Leadership', completed: 3, total: 6 },
    { name: 'Certifications', completed: 2, total: 4 },
  ]

  const learningTimeData = [
    { name: 'AI Chat Sessions', value: 45, color: '#3b82f6' },
    { name: 'Skill Assessments', value: 25, color: '#10b981' },
    { name: 'Goal Planning', value: 20, color: '#f59e0b' },
    { name: 'Analytics Review', value: 10, color: '#8b5cf6' },
  ]

  const weeklyActivity = [
    { day: 'Mon', sessions: 3, goals: 1 },
    { day: 'Tue', sessions: 4, goals: 2 },
    { day: 'Wed', sessions: 2, goals: 0 },
    { day: 'Thu', sessions: 5, goals: 1 },
    { day: 'Fri', sessions: 3, goals: 2 },
    { day: 'Sat', sessions: 1, goals: 0 },
    { day: 'Sun', sessions: 2, goals: 1 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Career Analytics</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">127</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Skills Improved</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Goals Achieved</p>
                <p className="text-2xl font-bold text-gray-900">18</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Learning Streak</p>
                <p className="text-2xl font-bold text-gray-900">7 days</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Skill Progress Over Time */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Progress Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={skillProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="javascript" stroke="#f59e0b" strokeWidth={2} name="JavaScript" />
                  <Line type="monotone" dataKey="react" stroke="#3b82f6" strokeWidth={2} name="React" />
                  <Line type="monotone" dataKey="leadership" stroke="#10b981" strokeWidth={2} name="Leadership" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Learning Time Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Time Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={learningTimeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {learningTimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Goal Completion */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Completion Rate</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goalCompletionData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value, name) => [value, name === 'completed' ? 'Completed' : 'Total']} />
                  <Bar dataKey="completed" fill="#10b981" name="completed" />
                  <Bar dataKey="total" fill="#e5e7eb" name="total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#3b82f6" name="Chat Sessions" />
                  <Bar dataKey="goals" fill="#8b5cf6" name="Goals Set" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 AI-Generated Insights</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📈 Growth Trend</h4>
              <p className="text-blue-800 text-sm">
                Your technical skills show consistent 15% monthly improvement. 
                Leadership skills are accelerating - great progress this month!
              </p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg">
              <h4 className="font-medium text-emerald-900 mb-2">🎯 Recommendations</h4>
              <p className="text-emerald-800 text-sm">
                Focus on Data Analysis skills next quarter. Your JavaScript foundation 
                makes this a natural progression for senior roles.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">⚡ Peak Performance</h4>
              <p className="text-purple-800 text-sm">
                Thursday sessions show highest engagement. Consider scheduling 
                important career discussions on Thursdays.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">🔥 Streak Motivation</h4>
              <p className="text-orange-800 text-sm">
                7-day learning streak! Keep it up to unlock the "Consistency Master" 
                achievement and boost your profile visibility.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            📊 Analytics are updated in real-time based on your AI coaching sessions.
          </p>
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