import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Обновляем сессию пользователя
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  // Дополнительная проверка для пользователя
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  // Если это redirect после логина, даем больше времени для обновления сессии
  const isRedirectFromLogin = req.nextUrl.searchParams.has('redirectTo')
  if (isRedirectFromLogin && !session && !user) {
    console.log('⏳ Redirect после логина, ждем обновления сессии...')
    // Пробуем еще раз через небольшую задержку
    await new Promise(resolve => setTimeout(resolve, 100))
    const { data: { session: sessionRetry } } = await supabase.auth.getSession()
    const { data: { user: userRetry } } = await supabase.auth.getUser()
    console.log('🔄 Повторная проверка:', { session: !!sessionRetry, user: !!userRetry })
  }

  // Защищенные маршруты (требуют аутентификации)
  const protectedPaths = ['/dashboard', '/profile', '/chat', '/goals', '/analytics']
  
  // Публичные маршруты (только для неаутентифицированных)
  const authPaths = ['/login', '/register']
  
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )
  
  const isAuthPath = authPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  // ВРЕМЕННО ОТКЛЮЧЕНО для отладки redirect после логина
  // Если пользователь не аутентифицирован и пытается зайти на защищенную страницу
  if (isProtectedPath && !session && !user) {
    console.log('🚫 MIDDLEWARE БЛОКИРУЕТ:', req.nextUrl.pathname, 'session:', !!session, 'user:', !!user)
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    // ВРЕМЕННО ОТКЛЮЧЕНО: return NextResponse.redirect(redirectUrl)
  }

  // Если пользователь аутентифицирован и пытается зайти на страницы входа/регистрации
  if (isAuthPath && (session || user)) {
    return NextResponse.redirect(new URL('/chat', req.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 