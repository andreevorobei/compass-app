'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface CareerDetails {
  title: string
  match: number
  description: string
  longDescription: string
  responsibilities: string[]
  hardSkills: Array<{
    name: string
    required: number
    userLevel: number
  }>
  softSkills: Array<{
    name: string
    required: number
    userLevel: number
  }>
  growth: string
  salary: string
  companies: string[]
  roadmap: string[]
}

interface ProfileData {
  interests: string[]
  skills: string[]
  preferences: any
  messages: any[]
}

// Компонент прогресс-бара для скиллов
const SkillProgressBar = ({ skill }: { skill: { name: string; required: number; userLevel: number } }) => {
  const matchPercentage = Math.min((skill.userLevel / skill.required) * 100, 100)
  const isGoodMatch = matchPercentage >= 70
  const isMediumMatch = matchPercentage >= 40
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{skill.name}</span>
        <span className={`text-sm font-semibold ${
          isGoodMatch ? 'text-green-600' : 
          isMediumMatch ? 'text-yellow-600' : 
          'text-red-600'
        }`}>
          {Math.round(matchPercentage)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${
            isGoodMatch ? 'bg-green-500' : 
            isMediumMatch ? 'bg-yellow-500' : 
            'bg-red-500'
          }`}
          style={{ width: `${matchPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Ваш уровень: {skill.userLevel}/10</span>
        <span>Требуется: {skill.required}/10</span>
      </div>
    </div>
  )
}

// Функция для анализа скиллов пользователя и генерации детальной информации
const generateCareerDetails = (careerTitle: string, profileData: ProfileData): CareerDetails => {
  const { interests, skills, preferences } = profileData
  
  // Базовые данные для разных профессий
  const careerData: Record<string, CareerDetails> = {
    'продуктовый-менеджер': {
      title: 'Продуктовый менеджер',
      match: 95,
      description: 'Управление продуктами от идеи до запуска, работа с командами разработки',
      longDescription: 'Продуктовый менеджер отвечает за весь жизненный цикл продукта - от исследования рынка и анализа пользователей до разработки стратегии и координации команд. Это роль на стыке бизнеса, технологий и пользовательского опыта.',
      responsibilities: [
        'Исследование рынка и анализ конкурентов',
        'Сбор и анализ требований пользователей', 
        'Создание продуктовой стратегии и roadmap',
        'Координация работы команд разработки и дизайна',
        'Анализ метрик и KPI продукта',
        'Проведение интервью с пользователями',
        'Планирование и приоритизация функций'
      ],
      hardSkills: [
        { name: 'Аналитика и метрики', required: 8, userLevel: 7 },
        { name: 'UX/UI понимание', required: 7, userLevel: 6 },
        { name: 'SQL и работа с данными', required: 6, userLevel: 5 },
        { name: 'Agile/Scrum методологии', required: 8, userLevel: 6 },
        { name: 'Wireframing и прототипирование', required: 6, userLevel: 7 },
        { name: 'A/B тестирование', required: 7, userLevel: 5 }
      ],
      softSkills: [
        { name: 'Коммуникация', required: 9, userLevel: 8 },
        { name: 'Лидерство', required: 8, userLevel: 7 },
        { name: 'Стратегическое мышление', required: 9, userLevel: 8 },
        { name: 'Эмпатия к пользователям', required: 9, userLevel: 9 },
        { name: 'Решение проблем', required: 8, userLevel: 8 },
        { name: 'Адаптивность', required: 8, userLevel: 9 }
      ],
      growth: 'Очень высокий',
      salary: '150-350k ₽',
      companies: ['Яндекс', 'VK', 'Ozon', 'Сбер', 'Авито', 'Тинькофф'],
      roadmap: [
        'Изучить основы аналитики (Google Analytics, Amplitude)',
        'Освоить SQL для работы с данными',
        'Изучить Agile/Scrum методологии',
        'Практиковаться в создании wireframes (Figma)',
        'Изучить основы UX/UI дизайна',
        'Получить опыт в управлении командой',
        'Развить навыки стратегического планирования'
      ]
    },
    'фулстек-разработчик': {
      title: 'Фулстек разработчик',
      match: 88,
      description: 'Разработка веб-приложений полного цикла, создание пользовательского опыта',
      longDescription: 'Фулстек разработчик работает как с фронтенд, так и с бэкенд частями приложения. Это универсальный специалист, который может создать продукт от пользовательского интерфейса до серверной логики и баз данных.',
      responsibilities: [
        'Разработка пользовательских интерфейсов',
        'Создание серверной логики и API',
        'Проектирование и работа с базами данных',
        'Интеграция с внешними сервисами',
        'Тестирование и отладка кода',
        'Оптимизация производительности',
        'Code review и менторинг'
      ],
      hardSkills: [
        { name: 'JavaScript/TypeScript', required: 9, userLevel: 8 },
        { name: 'React/Vue/Angular', required: 8, userLevel: 7 },
        { name: 'Node.js/Python/Java', required: 8, userLevel: 6 },
        { name: 'Базы данных (SQL/NoSQL)', required: 7, userLevel: 5 },
        { name: 'Git и контроль версий', required: 8, userLevel: 8 },
        { name: 'DevOps и деплой', required: 6, userLevel: 4 }
      ],
      softSkills: [
        { name: 'Логическое мышление', required: 9, userLevel: 9 },
        { name: 'Внимание к деталям', required: 8, userLevel: 8 },
        { name: 'Самообучение', required: 9, userLevel: 9 },
        { name: 'Работа в команде', required: 7, userLevel: 8 },
        { name: 'Решение проблем', required: 9, userLevel: 8 },
        { name: 'Терпение и настойчивость', required: 8, userLevel: 7 }
      ],
      growth: 'Высокий',
      salary: '120-280k ₽',
      companies: ['Яндекс', 'VK', 'Тинькофф', 'Авито', 'Ozon', 'Мегафон'],
      roadmap: [
        'Углубить знания JavaScript и изучить TypeScript',
        'Освоить современный фреймворк (React/Vue)',
        'Изучить бэкенд технологии (Node.js/Python)',
        'Изучить работу с базами данных',
        'Практиковаться в создании полных проектов',
        'Изучить DevOps основы',
        'Развить навыки архитектуры приложений'
      ]
    }
    // Можно добавить больше профессий
  }

  // Возвращаем данные для запрошенной профессии или дефолтные
  return careerData[careerTitle] || careerData['продуктовый-менеджер']
}

export default function CareerDetailPage() {
  const [careerDetails, setCareerDetails] = useState<CareerDetails | null>(null)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

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
        // Получаем персонализированную информацию о карьере через API
        const careerTitle = decodeURIComponent(slug).replace(/-/g, ' ')
        console.log('🚀 Requesting career analysis for:', careerTitle)
        
        const response = await fetch('/api/career-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profileData: parsedData,
            careerTitle: careerTitle
          })
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const result = await response.json()
        console.log('✅ Received career analysis')
        setCareerDetails(result)

      } catch (error) {
        console.error('❌ Failed to load career analysis:', error)
        
        // Fallback к статичной генерации в случае ошибки
        const careerTitle = decodeURIComponent(slug).replace(/-/g, ' ')
        const details = generateCareerDetails(careerTitle, parsedData)
        setCareerDetails(details)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [slug, router])

  if (isLoading || !careerDetails || !profileData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Загружаем детальную информацию...</div>
        </div>
      </div>
    )
  }

  const overallHardSkillMatch = Math.round(
    careerDetails.hardSkills.reduce((acc, skill) => acc + Math.min((skill.userLevel / skill.required) * 100, 100), 0) / 
    careerDetails.hardSkills.length
  )
  
  const overallSoftSkillMatch = Math.round(
    careerDetails.softSkills.reduce((acc, skill) => acc + Math.min((skill.userLevel / skill.required) * 100, 100), 0) / 
    careerDetails.softSkills.length
  )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span className="text-lg">←</span>
          Назад к результатам
        </button>
      </div>

      {/* Career Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{careerDetails.title}</h1>
          <div className="text-4xl font-bold text-blue-600">{careerDetails.match}%</div>
        </div>
        
        <p className="text-gray-600 mb-6">{careerDetails.longDescription}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">{careerDetails.growth}</div>
            <div className="text-sm text-gray-600">Потенциал роста</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">{careerDetails.salary}</div>
            <div className="text-sm text-gray-600">Зарплата в месяц</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">{Math.round((overallHardSkillMatch + overallSoftSkillMatch) / 2)}%</div>
            <div className="text-sm text-gray-600">Общее соответствие</div>
          </div>
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hard Skills */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">🛠️ Hard Skills</h2>
            <div className="text-lg font-bold text-blue-600">{overallHardSkillMatch}%</div>
          </div>
          
          <div className="space-y-4">
            {careerDetails.hardSkills.map((skill, index) => (
              <SkillProgressBar key={index} skill={skill} />
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">🧠 Soft Skills</h2>
            <div className="text-lg font-bold text-blue-600">{overallSoftSkillMatch}%</div>
          </div>
          
          <div className="space-y-4">
            {careerDetails.softSkills.map((skill, index) => (
              <SkillProgressBar key={index} skill={skill} />
            ))}
          </div>
        </div>
      </div>

      {/* Responsibilities */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Основные обязанности</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {careerDetails.responsibilities.map((responsibility, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">{responsibility}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Roadmap */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🗺️ План развития</h2>
        <div className="space-y-3">
          {careerDetails.roadmap.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>
              <span className="text-gray-700 pt-1">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Companies */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🏢 Популярные компании</h2>
        <div className="flex flex-wrap gap-3">
          {careerDetails.companies.map((company, index) => (
            <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
              {company}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="text-center space-x-4">
        <button 
          onClick={() => router.push('/results')}
          className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Вернуться к результатам
        </button>
        <button className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">
          Сохранить в избранное
        </button>
      </div>
    </div>
  )
} 