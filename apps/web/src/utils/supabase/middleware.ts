import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('🔧 MIDDLEWARE: Проверка пользователя для', request.nextUrl.pathname)
  console.log('👤 Пользователь:', user ? `${user.email} (${user.id})` : 'не аутентифицирован')

  // Защищенные маршруты (требуют аутентификации)
  const protectedPaths = ['/chat', '/dashboard', '/profile', '/goals', '/analytics', '/career']
  
  // Публичные маршруты (только для неаутентифицированных)
  const authPaths = ['/login', '/register']
  
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  
  const isAuthPath = authPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Если пользователь не аутентифицирован и пытается зайти на защищенную страницу
  if (isProtectedPath && !user) {
    console.log('🚫 MIDDLEWARE: Блокировка доступа к', request.nextUrl.pathname)
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Если пользователь аутентифицирован и пытается зайти на страницы входа/регистрации
  if (isAuthPath && user) {
    console.log('✅ MIDDLEWARE: Перенаправление аутентифицированного пользователя на /chat')
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  console.log('✅ MIDDLEWARE: Пропуск запроса')
  return supabaseResponse
} 