// Intelligent AI model router for cost and performance optimization
// Automatically selects best model based on query complexity and context

import { openrouter, selectModel } from './client'
import { getModelById, ModelConfig } from './models'

export interface RouterOptions {
  maxCost?: number // Maximum cost per query in USD
  preferredCapability?: string
  context?: 'career-advice' | 'skill-assessment' | 'goal-planning'
}

export class AIRouter {
  private costTracker: Map<string, number> = new Map()
  
  async route(
    prompt: string, 
    options: RouterOptions = {}
  ): Promise<{
    model: string
    response: any
    cost: number
  }> {
    // Analyze query complexity
    const complexity = this.analyzeComplexity(prompt)
    
    // Select optimal model
    const modelId = this.selectOptimalModel(complexity, options)
    const modelConfig = getModelById(modelId)
    
    if (!modelConfig) {
      throw new Error(`Model ${modelId} not found`)
    }
    
    // Generate response
    const response = await openrouter.generateObject({
      model: modelId,
      prompt,
      schema: this.getSchemaForContext(options.context)
    })
    
    // Track costs
    const estimatedCost = this.estimateCost(prompt, modelConfig)
    this.trackCost(modelId, estimatedCost)
    
    return {
      model: modelId,
      response,
      cost: estimatedCost
    }
  }
  
  private analyzeComplexity(prompt: string): 'simple' | 'complex' | 'reasoning' {
    const reasoningKeywords = ['why', 'how', 'analyze', 'compare', 'strategy']
    const complexKeywords = ['career path', 'transition', 'skills gap', 'market']
    
    if (reasoningKeywords.some(keyword => prompt.toLowerCase().includes(keyword))) {
      return 'reasoning'
    }
    
    if (complexKeywords.some(keyword => prompt.toLowerCase().includes(keyword))) {
      return 'complex'
    }
    
    return 'simple'
  }
  
  private selectOptimalModel(
    complexity: 'simple' | 'complex' | 'reasoning',
    options: RouterOptions
  ): string {
    // Apply cost constraints
    if (options.maxCost && options.maxCost < 0.001) {
      return selectModel('simple') // Force cheapest model
    }
    
    return selectModel(complexity)
  }
  
  private estimateCost(prompt: string, model: ModelConfig): number {
    const tokenCount = Math.ceil(prompt.length / 4) // Rough estimation
    return (tokenCount / 1000) * model.costPer1k
  }
  
  private trackCost(modelId: string, cost: number): void {
    const currentCost = this.costTracker.get(modelId) || 0
    this.costTracker.set(modelId, currentCost + cost)
  }
  
  private getSchemaForContext(context?: string) {
    // Define schemas based on context - implement as needed
    return null
  }
  
  getCostSummary(): Record<string, number> {
    const summary: Record<string, number> = {}
    this.costTracker.forEach((cost, modelId) => {
      summary[modelId] = cost
    })
    return summary
  }
}

export const aiRouter = new AIRouter() 