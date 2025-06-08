import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export async function POST(req: Request) {
  console.log('🚀 /api/career-recommendations called')
  
  try {
    const { profileData } = await req.json()
    
    console.log('📨 Received profile data:', {
      interests: profileData.interests?.length || 0,
      skills: profileData.skills?.length || 0,
      preferences: profileData.preferences,
      messages: profileData.messages?.length || 0
    })
    
    if (!profileData || !profileData.messages) {
      console.log('❌ Invalid profile data format')
      return Response.json({ 
        error: 'Invalid profile data format' 
      }, { status: 400 })
    }

    // Проверим есть ли OpenAI API ключ
    const hasApiKey = !!process.env.OPENAI_API_KEY
    console.log('🔑 OpenAI API Key present:', hasApiKey)
    
    if (!hasApiKey) {
      console.log('❌ No OpenAI API key found')
      return Response.json({ 
        error: 'OpenAI API key not configured' 
      }, { status: 500 })
    }

    // Формируем контекст для AI из разговора пользователя
    const conversationContext = profileData.messages
      .filter((msg: any) => msg.role === 'user')
      .map((msg: any) => msg.content)
      .join('\n\n')

    const prompt = `Ты - опытный карьерный консультант и HR-аналитик. Проанализируй данные пользователя из карьерного интервью и создай 5 наиболее подходящих карьерных рекомендаций.

ДАННЫЕ ПОЛЬЗОВАТЕЛЯ:
Интересы: ${profileData.interests?.join(', ') || 'не указаны'}
Навыки: ${profileData.skills?.join(', ') || 'не указаны'}  
Предпочтения: ${JSON.stringify(profileData.preferences)}

ПОЛНЫЙ РАЗГОВОР С ПОЛЬЗОВАТЕЛЕМ:
${conversationContext}

ЗАДАЧА:
Проанализируй ответы пользователя и создай 5 персональных карьерных рекомендаций. Каждая рекомендация должна быть в JSON формате:

{
  "title": "Точное название профессии",
  "match": число от 75 до 98 (процент совпадения с профилем пользователя),
  "description": "Краткое описание профессии 1-2 предложения",
  "skills": ["Навык 1", "Навык 2", "Навык 3", "Навык 4"],
  "growth": "Высокий/Очень высокий/Стабильный",
  "salary": "Диапазон зарплаты в рублях, например: 120-280k ₽"
}

ВАЖНО:
- Анализируй именно ответы пользователя, а не стандартные шаблоны
- Учитывай современные тренды рынка труда 2024 года
- Делай рекомендации максимально персонализированными
- Профессии должны быть реальными и востребованными
- Зарплаты указывай реалистичные для российского рынка

Верни ТОЛЬКО массив из 5 JSON объектов, без дополнительного текста:`

    console.log('🤖 Calling OpenAI for career recommendations...')
    
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 2000,
    })

    console.log('✅ AI Response received:', result.text.substring(0, 200) + '...')

    // Пытаемся распарсить ответ AI как JSON
    let careerPaths
    try {
      // Очищаем ответ от лишнего текста если он есть
      let cleanedResponse = result.text.trim()
      
      // Ищем JSON массив в ответе
      const startIndex = cleanedResponse.indexOf('[')
      const endIndex = cleanedResponse.lastIndexOf(']') + 1
      
      if (startIndex !== -1 && endIndex !== -1) {
        cleanedResponse = cleanedResponse.substring(startIndex, endIndex)
      }
      
      careerPaths = JSON.parse(cleanedResponse)
      
      if (!Array.isArray(careerPaths)) {
        throw new Error('Response is not an array')
      }
      
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON:', parseError)
      console.log('Raw AI response:', result.text)
      
      // Fallback: возвращаем обобщенную рекомендацию
      careerPaths = [{
        title: "Карьерная консультация",
        match: 85,
        description: "Рекомендуем индивидуальную консультацию с карьерным консультантом для более точных рекомендаций",
        skills: ["Самоанализ", "Планирование карьеры", "Изучение рынка труда"],
        growth: "Высокий",
        salary: "По результатам консультации"
      }]
    }

    console.log('📋 Generated career paths:', careerPaths.length)

    return Response.json({ 
      careerPaths: careerPaths,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Career recommendations error:', error)
    return Response.json({ 
      error: 'Failed to generate career recommendations' 
    }, { status: 500 })
  }
} 