import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const profileUpdateFunction = {
  name: 'update_profile',
  description: 'Updates user profile based on conversation analysis',
  parameters: {
    type: 'object',
    properties: {
      skills: {
        type: 'array',
        items: {
          type: 'object',  
          properties: {
            name: { type: 'string', description: 'Skill name' },
            level: { type: 'number', minimum: 0, maximum: 100, description: 'Skill level 0-100' },
            change: { type: 'string', description: 'What changed about this skill' }
          },
          required: ['name', 'level', 'change']
        }
      },
      current_role: { type: 'string', description: 'Current job title' },
      target_role: { type: 'string', description: 'Desired job title' },
      experience_years: { type: 'number', description: 'Years of experience' },
      goals: {
        type: 'array',
        items: { type: 'string' },
        description: 'Career goals mentioned'
      }
    }
  }
}

export async function POST(req: Request) {
  console.log('🚀 API /ai called')
  
  try {
    const { messages } = await req.json()
    
    console.log('📨 Received messages:', messages?.length || 0)
    console.log('📨 Last message:', messages?.[messages.length - 1])
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.log('❌ Invalid messages format')
      return Response.json({ 
        error: 'Invalid messages format' 
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

    console.log('🤖 Calling OpenAI with function calling...')
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Ты AI карьерный коуч по имени Compass. 
      
Твоя задача:
- Помогать пользователю в карьерном развитии
- Анализировать разговор и выявлять информацию о навыках, опыте, целях
- Когда пользователь упоминает конкретные навыки, роли, цели или опыт - вызывай функцию update_profile
- ВСЕГДА отвечай дружелюбно, профессионально, мотивирующе на русском языке
- Задавай уточняющие вопросы о карьерных планах

ВАЖНО: Даже если ты вызываешь функцию update_profile, ОБЯЗАТЕЛЬНО давай текстовый ответ пользователю!

Примеры:
- "Я Frontend разработчик" → вызови update_profile И ответь: "Отлично! Я записал что ты Frontend разработчик. Расскажи больше о своем опыте!"
- "Хочу стать PM" → вызови update_profile И ответь: "Понял! Product Manager - отличная цель. Что привлекает тебя в этой роли?"
- "Работаю 3 года" → вызови update_profile И ответь: "3 года опыта - хорошая база! В какой области работаешь?"

Всегда комбинируй function calling с полезным текстовым ответом!`
        },
        ...messages
      ],
      functions: [profileUpdateFunction],
      function_call: 'auto',
      temperature: 0.7,
      max_tokens: 1000
    })

    console.log('✅ OpenAI response received')

    const message = response.choices[0]?.message
    
    if (!message) {
      throw new Error('No response from OpenAI')
    }

    let functionCallResult = null
    if (message.function_call) {
      try {
        functionCallResult = JSON.parse(message.function_call.arguments)
        console.log('🔄 Function Call Result:', functionCallResult)
      } catch (error) {
        console.error('❌ Error parsing function call:', error)
      }
    }

    // Убеждаемся что всегда есть контент для ответа
    let content = message.content || ''
    
    // Если нет контента, но есть function call, создаем базовый ответ
    if (!content && functionCallResult) {
      content = 'Отлично! Я обновил информацию о твоем профиле. Расскажи еще что-нибудь о своей карьере!'
    }
    
    // Если вообще нет ответа, создаем дефолтный
    if (!content) {
      content = 'Извини, что-то пошло не так. Можешь повторить свой вопрос?'
    }

    console.log('📤 Sending response with content:', content.substring(0, 100) + '...')

    return Response.json({
      content: content,
      functionCall: functionCallResult,
      model: 'gpt-4o-mini'
    })

  } catch (error) {
    console.error('❌ AI API Error:', error)
    
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return Response.json({ 
      error: 'AI service temporarily unavailable. Please try again.',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}
