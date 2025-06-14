import { NextRequest, NextResponse } from 'next/server'

// API роут для обработки сообщений чата с AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({ 
      message: 'Chat API endpoint - POST method',
      status: 'development',
      received: body
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    )
  }
} 