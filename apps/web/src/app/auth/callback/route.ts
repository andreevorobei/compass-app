import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/integrations/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/chat'

  if (code) {
    const supabase = await createClient()
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(new URL('/login?error=auth_callback_error', request.url))
      }

      // Успешная аутентификация - перенаправляем пользователя
      return NextResponse.redirect(new URL(redirectTo, request.url))
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/login?error=auth_callback_error', request.url))
    }
  }

  // Нет кода - перенаправляем на главную
  return NextResponse.redirect(new URL('/', request.url))
} 