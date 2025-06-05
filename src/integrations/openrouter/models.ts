// OpenRouter AI models configuration and types
// Model pricing and capabilities for career coaching use cases

export interface ModelConfig {
  id: string
  name: string
  costPer1k: number // USD per 1K tokens
  capabilities: string[]
  maxTokens: number
  useCase: 'chat' | 'analysis' | 'reasoning' | 'function-calling'
}

export const MODEL_CONFIGS: ModelConfig[] = [
  {
    id: 'deepseek/deepseek-v3',
    name: 'DeepSeek V3',
    costPer1k: 0.0002,
    capabilities: ['chat', 'function-calling'],
    maxTokens: 32000,
    useCase: 'chat'
  },
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash',
    costPer1k: 0,
    capabilities: ['chat', 'analysis', 'function-calling'],
    maxTokens: 32000,
    useCase: 'analysis'
  },
  {
    id: 'deepseek/deepseek-r1-32k',
    name: 'DeepSeek R1',
    costPer1k: 0.0008,
    capabilities: ['reasoning', 'analysis', 'function-calling'],
    maxTokens: 32000,
    useCase: 'reasoning'
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    costPer1k: 0.0003,
    capabilities: ['chat', 'function-calling', 'analysis'],
    maxTokens: 16000,
    useCase: 'function-calling'
  }
]

export function getModelById(id: string): ModelConfig | undefined {
  return MODEL_CONFIGS.find(model => model.id === id)
}

export function getModelsByUseCase(useCase: ModelConfig['useCase']): ModelConfig[] {
  return MODEL_CONFIGS.filter(model => model.useCase === useCase)
} 