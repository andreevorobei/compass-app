import { NextRequest, NextResponse } from 'next/server'

// API роут для управления профилем пользователя
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Profile API endpoint - GET method',
    status: 'development' 
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({ 
      message: 'Profile API endpoint - POST method',
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({ 
      message: 'Profile API endpoint - PUT method',
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