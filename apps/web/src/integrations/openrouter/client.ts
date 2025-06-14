// OpenRouter client configuration for multi-model AI routing
// Supports DeepSeek V3, Gemini 2.0 Flash, DeepSeek R1, GPT-4o Mini
// Cost optimization: $0.05-0.17/user/month vs $25.88 industry standard

import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

// Available models with cost optimization
export const MODELS = {
  // Ultra low cost for simple queries
  DEEPSEEK_V3: 'deepseek/deepseek-v3',
  
  // Fast and reliable for most use cases  
  GEMINI_FLASH: 'google/gemini-2.0-flash-exp:free',
  
  // Reasoning model for complex career decisions
  DEEPSEEK_R1: 'deepseek/deepseek-r1-32k',
  
  // Balanced performance and cost
  GPT_4O_MINI: 'openai/gpt-4o-mini',
} as const

// Model selection based on query complexity
export function selectModel(queryType: 'simple' | 'complex' | 'reasoning'): string {
  switch (queryType) {
    case 'simple':
      return MODELS.DEEPSEEK_V3
    case 'complex':
      return MODELS.GEMINI_FLASH
    case 'reasoning':
      return MODELS.DEEPSEEK_R1
    default:
      return MODELS.GPT_4O_MINI
  }
} 