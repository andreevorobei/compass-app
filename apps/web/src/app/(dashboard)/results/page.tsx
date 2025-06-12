'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProfileData {
  interests: string[]
  skills: string[]
  preferences: any
  messages: any[]
  completedAt: string
}

interface CareerPath {
  title: string
  match: number
  description: string
  skills: string[]
  growth: string
  salary: string
}

// Функция для генерации карьерных путей на основе данных пользователя
const generateCareerPaths = (profileData: ProfileData): CareerPath[] => {
  const { interests, skills, preferences } = profileData
  const paths: CareerPath[] = []
  
  // Анализируем интересы и навыки пользователя
  const hasManagement = skills.some(skill => skill.toLowerCase().includes('управление') || skill.toLowerCase().includes('управлять'))
  const hasCoding = skills.some(skill => skill.toLowerCase().includes('код') || skill.toLowerCase().includes('программ'))
  const hasWriting = skills.some(skill => skill.toLowerCase().includes('писать') || skill.toLowerCase().includes('написание'))
  const hasAnalytics = skills.some(skill => skill.toLowerCase().includes('анализ'))
  const hasCreative = interests.some(interest => interest.toLowerCase().includes('создавать') || interest.toLowerCase().includes('творч'))
  const likesTeamwork = preferences.teamwork === 'командная'
  const likesChallenges = preferences.priority === 'новые вызовы'
  
  // Генерируем карьерные пути
  if (hasManagement && likesTeamwork) {
    paths.push({
      title: "Продуктовый менеджер",
      match: 95,
      description: "Управление продуктами от идеи до запуска, работа с командами разработки",
      skills: ["Управление командой", "Стратегическое мышление", "Аналитика", "Коммуникация"],
      growth: "Очень высокий",
      salary: "150-350k ₽"
    })
  }
  
  if (hasCoding && hasCreative) {
    paths.push({
      title: "Фулстек разработчик",
      match: hasManagement ? 88 : 92,
      description: "Разработка веб-приложений полного цикла, создание пользовательского опыта",
      skills: ["JavaScript", "React", "Node.js", "Базы данных", "UI/UX"],
      growth: "Высокий",
      salary: "120-280k ₽"
    })
  }
  
  if (hasWriting && hasAnalytics) {
    paths.push({
      title: "Стратегический консультант",
      match: 90,
      description: "Разработка бизнес-стратегий, анализ рынков, консультирование компаний",
      skills: ["Стратегическое планирование", "Аналитика", "Презентации", "Исследования"],
      growth: "Высокий",
      salary: "180-400k ₽"
    })
  }
  
  if (hasCreative && likesTeamwork) {
    paths.push({
      title: "Креативный директор",
      match: 85,
      description: "Руководство креативными проектами, разработка концепций и видения",
      skills: ["Креативное мышление", "Управление командой", "Дизайн-мышление", "Бренд-стратегия"],
      growth: "Высокий",
      salary: "160-320k ₽"
    })
  }
  
  if (hasAnalytics && likesChallenges) {
    paths.push({
      title: "Data Scientist",
      match: 87,
      description: "Анализ больших данных, машинное обучение, бизнес-аналитика",
      skills: ["Python", "Статистика", "Машинное обучение", "Визуализация данных"],
      growth: "Очень высокий",
      salary: "140-300k ₽"
    })
  }
  
  // Если недостаточно совпадений, добавляем универсальные варианты
  if (paths.length < 3) {
    paths.push({
      title: "Бизнес-аналитик",
      match: 75,
      description: "Анализ бизнес-процессов и требований, оптимизация рабочих процессов",
      skills: ["Аналитическое мышление", "Процессы", "Документирование", "SQL"],
      growth: "Стабильный",
      salary: "100-200k ₽"
    })
  }
  
  return paths.slice(0, 5) // Максимум 5 путей
}

export default function ResultsPage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const data = localStorage.getItem('compass_profile_data')
      if (!data) {
        router.push('/chat')
        return
      }

      const parsedData = JSON.parse(data)
      setProfileData(parsedData)

      try {
        console.log('🚀 Requesting AI career recommendations...')
        
        const response = await fetch('/api/career-recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profileData: parsedData
          })
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const result = await response.json()
        console.log('✅ Received AI recommendations:', result.careerPaths?.length || 0)
        
        if (result.careerPaths && Array.isArray(result.careerPaths)) {
          setCareerPaths(result.careerPaths)
        } else {
          throw new Error('Invalid response format')
        }

      } catch (error) {
        console.error('❌ Failed to load career recommendations:', error)
        setError('Не удалось загрузить рекомендации. Попробуйте обновить страницу.')
        
        // Fallback к статичным рекомендациям в случае ошибки
        setCareerPaths(generateCareerPaths(parsedData))
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  if (isLoading || !profileData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Генерируем персональные карьерные рекомендации...</div>
          <div className="text-sm text-gray-500 mt-2">AI анализирует ваши ответы</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Твои персональные карьерные рекомендации</h1>
        <p className="text-gray-600">Сгенерированы AI на основе анализа твоих ответов</p>
        {error && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}
      </div>

      {/* Profile Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Твой профиль</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">🎯 Интересы</h3>
            <div className="flex flex-wrap gap-2">
              {profileData.interests?.map((interest, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">💪 Навыки</h3>
            <div className="flex flex-wrap gap-2">
              {profileData.skills?.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">✨ Предпочтения</h3>
          <div className="text-gray-600 space-y-1">
            {profileData.preferences.teamwork && <p>Работа: {profileData.preferences.teamwork}</p>}
            {profileData.preferences.workType && <p>Тип работы: {profileData.preferences.workType}</p>}
            {profileData.preferences.priority && <p>Приоритет: {profileData.preferences.priority}</p>}
          </div>
        </div>
      </div>

      {/* Career Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">🚀 Рекомендуемые карьерные пути</h2>
          <div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
            🤖 Сгенерировано AI
          </div>
        </div>
        
        {careerPaths.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Рекомендации генерируются...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerPaths.map((career: CareerPath, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{career.title}</h3>
                <div className="text-2xl font-bold text-blue-600">{career.match}%</div>
              </div>
              
              <p className="text-gray-600 mb-4">{career.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Ключевые навыки:</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {career.skills.map((skill: string, skillIndex: number) => (
                      <span key={skillIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-500">Рост:</span>
                    <span className="ml-1 font-medium">{career.growth}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Зарплата:</span>  
                    <span className="ml-1 font-medium">{career.salary}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => router.push(`/career/${encodeURIComponent(career.title.toLowerCase().replace(/\s+/g, '-'))}`)}
                className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Узнать подробнее
              </button>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="text-center space-x-4">
        <button 
          onClick={() => router.push('/chat')}
          className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Пройти анализ заново
        </button>
        <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors">
          Сохранить результаты
        </button>
      </div>
    </div>
  )
} 