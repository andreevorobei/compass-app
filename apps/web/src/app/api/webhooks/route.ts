import { NextRequest, NextResponse } from 'next/server'

// API роут для обработки внешних webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({ 
      message: 'Webhooks API endpoint - POST method',
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