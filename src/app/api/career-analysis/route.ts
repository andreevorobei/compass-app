import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

interface ProfileData {
  interests: string[]
  skills: string[]
  preferences: any
  messages: any[]
}

// Функция для анализа скиллов пользователя на основе его ответов
const analyzeUserSkills = (profileData: ProfileData, careerTitle: string) => {
  const { interests, skills, preferences, messages } = profileData
  
  // Анализируем текст сообщений для более точной оценки
  const conversationText = messages.map(m => m.content).join(' ').toLowerCase()
  
  // Базовые скиллы для разных профессий
  const careerSkills: Record<string, any> = {
    'продуктовый-менеджер': {
      hardSkills: [
        { name: 'Аналитика и метрики', keywords: ['анализ', 'метрики', 'аналитика', 'данные'], baseLevel: 5 },
        { name: 'UX/UI понимание', keywords: ['дизайн', 'интерфейс', 'пользователь', 'ux', 'ui'], baseLevel: 4 },
        { name: 'SQL и работа с данными', keywords: ['sql', 'база данных', 'данные'], baseLevel: 3 },
        { name: 'Agile/Scrum методологии', keywords: ['agile', 'scrum', 'методология', 'процессы'], baseLevel: 4 },
        { name: 'Wireframing и прототипирование', keywords: ['wireframe', 'прототип', 'mockup'], baseLevel: 4 },
        { name: 'A/B тестирование', keywords: ['тестирование', 'ab', 'эксперимент'], baseLevel: 3 }
      ],
      softSkills: [
        { name: 'Коммуникация', keywords: ['общение', 'команда', 'коммуникация'], baseLevel: 7 },
        { name: 'Лидерство', keywords: ['управление', 'лидер', 'руководство'], baseLevel: 6 },
        { name: 'Стратегическое мышление', keywords: ['стратегия', 'планирование'], baseLevel: 7 },
        { name: 'Эмпатия к пользователям', keywords: ['пользователь', 'потребности'], baseLevel: 8 },
        { name: 'Решение проблем', keywords: ['проблемы', 'решение'], baseLevel: 7 },
        { name: 'Адаптивность', keywords: ['новое', 'изменения', 'адаптация'], baseLevel: 8 }
      ]
    },
    'фулстек-разработчик': {
      hardSkills: [
        { name: 'JavaScript/TypeScript', keywords: ['javascript', 'js', 'typescript', 'программирование'], baseLevel: 6 },
        { name: 'React/Vue/Angular', keywords: ['react', 'vue', 'angular', 'фреймворк'], baseLevel: 5 },
        { name: 'Node.js/Python/Java', keywords: ['node', 'python', 'java', 'backend'], baseLevel: 4 },
        { name: 'Базы данных (SQL/NoSQL)', keywords: ['база данных', 'sql', 'mongodb'], baseLevel: 4 },
        { name: 'Git и контроль версий', keywords: ['git', 'версия', 'контроль'], baseLevel: 6 },
        { name: 'DevOps и деплой', keywords: ['devops', 'деплой', 'сервер'], baseLevel: 3 }
      ],
      softSkills: [
        { name: 'Логическое мышление', keywords: ['логика', 'мышление'], baseLevel: 8 },
        { name: 'Внимание к деталям', keywords: ['детали', 'точность'], baseLevel: 7 },
        { name: 'Самообучение', keywords: ['обучение', 'изучение'], baseLevel: 8 },
        { name: 'Работа в команде', keywords: ['команда', 'сотрудничество'], baseLevel: 7 },
        { name: 'Решение проблем', keywords: ['проблемы', 'решение'], baseLevel: 8 },
        { name: 'Терпение и настойчивость', keywords: ['терпение', 'настойчивость'], baseLevel: 6 }
      ]
    }
  }

  // Получаем скиллы для профессии
  const relevantSkills = careerSkills[careerTitle.toLowerCase().replace(/\s+/g, '-')] || careerSkills['продуктовый-менеджер']
  
  // Функция для оценки уровня скилла
  const evaluateSkill = (skill: any) => {
    let level = skill.baseLevel
    
    // Проверяем упоминания в навыках пользователя
    const skillMentioned = skills.some(userSkill => 
      skill.keywords.some((keyword: string) => userSkill.toLowerCase().includes(keyword))
    )
    
    // Проверяем упоминания в интересах
    const interestMentioned = interests.some(interest => 
      skill.keywords.some((keyword: string) => interest.toLowerCase().includes(keyword))
    )
    
    // Проверяем упоминания в разговоре
    const conversationMentioned = skill.keywords.some((keyword: string) => 
      conversationText.includes(keyword)
    )
    
    // Корректируем уровень
    if (skillMentioned) level += 2
    if (interestMentioned) level += 1
    if (conversationMentioned) level += 1
    
    // Учитываем предпочтения
    if (skill.name.includes('команда') && preferences.teamwork === 'командная') level += 1
    if (skill.name.includes('данные') && preferences.workType === 'с данными') level += 1
    
    return Math.min(level, 10) // Максимум 10
  }

  return {
    hardSkills: relevantSkills.hardSkills.map((skill: any) => ({
      name: skill.name,
      required: 8, // Базовое требование
      userLevel: evaluateSkill(skill)
    })),
    softSkills: relevantSkills.softSkills.map((skill: any) => ({
      name: skill.name,
      required: 8, // Базовое требование
      userLevel: evaluateSkill(skill)
    }))
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 /api/career-analysis called')
    
    const { profileData, careerTitle } = await request.json()
    
    if (!profileData || !careerTitle) {
      return NextResponse.json(
        { error: 'Profile data and career title are required' },
        { status: 400 }
      )
    }

    console.log('📨 Analyzing career:', careerTitle)
    console.log('📨 Profile data received')

    // Анализируем скиллы пользователя
    const skillAnalysis = analyzeUserSkills(profileData, careerTitle)

    // Генерируем детальную информацию с помощью AI
    const aiPrompt = `
Проанализируй профессию "${careerTitle}" и создай детальное описание для российского рынка труда 2024 года.

Профиль пользователя:
- Интересы: ${profileData.interests?.join(', ')}
- Навыки: ${profileData.skills?.join(', ')}
- Предпочтения: ${JSON.stringify(profileData.preferences)}

Верни JSON объект с полями:
{
  "longDescription": "Подробное описание профессии (2-3 предложения)",
  "responsibilities": ["список", "основных", "обязанностей"],
  "growth": "потенциал роста (Высокий/Очень высокий/Стабильный)",
  "salary": "зарплатная вилка в рублях",
  "companies": ["список", "популярных", "компаний"],
  "roadmap": ["план", "развития", "по", "шагам"],
  "match": число_от_75_до_98
}

Используй реальные данные для российского рынка.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Ты эксперт по карьерному консультированию в России. Отвечай только валидным JSON без дополнительного текста.'
        },
        {
          role: 'user',
          content: aiPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })

    let careerInfo
    try {
      const aiResponse = response.choices[0].message.content || '{}'
      console.log('🤖 AI Response received:', aiResponse.substring(0, 200) + '...')
      careerInfo = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError)
      // Fallback данные
      careerInfo = {
        longDescription: `${careerTitle} - востребованная профессия с хорошими перспективами роста в современной экономике.`,
        responsibilities: ['Выполнение основных задач', 'Работа с командой', 'Развитие навыков'],
        growth: 'Высокий',
        salary: '100-200k ₽',
        companies: ['Яндекс', 'Сбер', 'VK'],
        roadmap: ['Изучить основы', 'Получить опыт', 'Развивать навыки'],
        match: 85
      }
    }

    const result = {
      title: careerTitle,
      ...careerInfo,
      ...skillAnalysis
    }

    console.log('✅ Career analysis completed')
    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Error in career analysis:', error)
    return NextResponse.json(
      { error: 'Failed to analyze career' },
      { status: 500 }
    )
  }
} 