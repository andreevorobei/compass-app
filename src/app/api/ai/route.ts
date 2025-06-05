// API route for AI interactions via OpenRouter
// Function calling implementation for profile updates
// Cost tracking and model selection logic

import { NextRequest, NextResponse } from 'next/server'
import { aiRouter } from '@/integrations/openrouter/router'
import { ASSISTANT_CONFIG } from '@/integrations/assistant-ui/config'
import { createServerClient } from '@/integrations/supabase/client'
import { CacheManager } from '@/integrations/upstash/client'

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, userId, context } = await request.json()

    // Validate required fields
    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: message, userId' },
        { status: 400 }
      )
    }

    // Get Supabase client for database operations
    const supabase = createServerClient()

    // Check cache for similar queries to save costs
    const promptHash = hashPrompt(message, context)
    const cachedResponse = await CacheManager.getAIResponse(promptHash)
    
    if (cachedResponse) {
      return NextResponse.json({
        content: cachedResponse.content,
        model: cachedResponse.model,
        cached: true,
        cost: 0
      })
    }

    // Route AI request through OpenRouter
    const aiResponse = await aiRouter.route(message, {
      context: context?.type || 'career-advice',
      maxCost: 0.01 // Maximum $0.01 per request
    })

    // Process function calls if any
    let functionResults = null
    if (aiResponse.response.function_calls) {
      functionResults = await processFunctionCalls(
        aiResponse.response.function_calls,
        userId,
        supabase
      )
    }

    // Save conversation to database
    await saveConversation({
      sessionId,
      userId,
      userMessage: message,
      aiResponse: aiResponse.response.content,
      model: aiResponse.model,
      cost: aiResponse.cost,
      functionCalls: functionResults
    }, supabase)

    // Cache the response for future similar queries
    await CacheManager.cacheAIResponse(promptHash, {
      content: aiResponse.response.content,
      model: aiResponse.model,
      cost: aiResponse.cost
    })

    // Track AI usage for analytics
    await trackAIUsage({
      userId,
      sessionId,
      model: aiResponse.model,
      tokensUsed: aiResponse.response.tokens_used || 0,
      cost: aiResponse.cost,
      requestType: functionResults ? 'function_call' : 'chat'
    }, supabase)

    return NextResponse.json({
      content: aiResponse.response.content,
      model: aiResponse.model,
      cost: aiResponse.cost,
      functionResults,
      cached: false
    })

  } catch (error) {
    console.error('AI API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process AI request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper function to hash prompts for caching
function hashPrompt(message: string, context?: any): string {
  const combined = JSON.stringify({ message, context })
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

// Process function calls from AI
async function processFunctionCalls(
  functionCalls: any[],
  userId: string,
  supabase: any
) {
  const results = []

  for (const call of functionCalls) {
    try {
      let result = null

      switch (call.name) {
        case 'updateUserProfile':
          result = await updateUserProfile(call.arguments, userId, supabase)
          break
        
        case 'setCareerGoals':
          result = await setCareerGoals(call.arguments, userId, supabase)
          break
        
        case 'trackProgress':
          result = await trackProgress(call.arguments, userId, supabase)
          break
        
        default:
          result = { error: `Unknown function: ${call.name}` }
      }

      results.push({
        function: call.name,
        arguments: call.arguments,
        result
      })

    } catch (error) {
      results.push({
        function: call.name,
        arguments: call.arguments,
        error: error instanceof Error ? error.message : 'Function execution failed'
      })
    }
  }

  return results
}

// Function implementations
async function updateUserProfile(args: any, userId: string, supabase: any) {
  const { skills, experience, interests } = args

  // Update skills if provided
  if (skills && Array.isArray(skills)) {
    for (const skillName of skills) {
      await supabase
        .from('skills')
        .upsert({
          user_id: userId,
          name: skillName,
          category: 'AI-Identified',
          proficiency_level: 1, // Default level
          is_core_skill: false
        })
    }
  }

  // Update profile fields
  const updateData: any = {}
  if (experience) updateData.experience_years = experience
  if (interests) updateData.interests = interests

  if (Object.keys(updateData).length > 0) {
    await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', userId)
  }

  return { 
    message: 'Profile updated successfully',
    updated: { skills, experience, interests }
  }
}

async function setCareerGoals(args: any, userId: string, supabase: any) {
  const { shortTerm, longTerm, priority } = args

  const goals = []
  
  // Add short-term goals
  if (shortTerm && Array.isArray(shortTerm)) {
    for (const goal of shortTerm) {
      goals.push({
        user_id: userId,
        title: goal,
        category: 'short_term',
        priority: priority || 'medium',
        status: 'not_started',
        progress_percentage: 0
      })
    }
  }

  // Add long-term goals
  if (longTerm && Array.isArray(longTerm)) {
    for (const goal of longTerm) {
      goals.push({
        user_id: userId,
        title: goal,
        category: 'long_term',
        priority: priority || 'medium',
        status: 'not_started',
        progress_percentage: 0
      })
    }
  }

  if (goals.length > 0) {
    await supabase.from('goals').insert(goals)
  }

  return {
    message: 'Goals created successfully',
    goalsCreated: goals.length
  }
}

async function trackProgress(args: any, userId: string, supabase: any) {
  const { skillName, progressPercentage, notes } = args

  // Find the skill
  const { data: skill } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', userId)
    .eq('name', skillName)
    .single()

  if (skill) {
    // Update skill progress
    await supabase
      .from('skills')
      .update({ proficiency_level: Math.ceil(progressPercentage / 10) })
      .eq('id', skill.id)

    // Record progress entry
    await supabase
      .from('progress_tracking')
      .insert({
        user_id: userId,
        skill_id: skill.id,
        metric_name: 'proficiency_level',
        metric_value: progressPercentage,
        notes
      })
  }

  return {
    message: 'Progress tracked successfully',
    skill: skillName,
    progress: progressPercentage
  }
}

// Save conversation to database
async function saveConversation(data: any, supabase: any) {
  // Save to chat_messages table
  await supabase.from('chat_messages').insert([
    {
      session_id: data.sessionId,
      user_id: data.userId,
      role: 'user',
      content: data.userMessage
    },
    {
      session_id: data.sessionId,
      user_id: data.userId,
      role: 'assistant',
      content: data.aiResponse,
      metadata: {
        model: data.model,
        cost: data.cost,
        function_calls: data.functionCalls
      }
    }
  ])
}

// Track AI usage for analytics
async function trackAIUsage(data: any, supabase: any) {
  await supabase.from('ai_usage').insert({
    user_id: data.userId,
    session_id: data.sessionId,
    model_name: data.model,
    tokens_used: data.tokensUsed,
    cost_usd: data.cost,
    request_type: data.requestType
  })
} 