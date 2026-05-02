import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/env'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

  // refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // protected routes protection
  const { pathname } = request.nextUrl
  
  // Create an array of routes that strictly require authentication
  const protectedRoutes = [
    '/dashboard/my-events',
    '/dashboard/settings',
    '/dashboard/manage-events',
    '/dashboard/members',
    '/admin' // Explicit admin protection
  ]

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // if user is not logged in and trying to access a strictly protected route
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // if user is logged in, and tries to go to login or register
  if (user && (pathname === '/login' || pathname === '/register')) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const isAdmin = profile?.role === 'admin' || user?.user_metadata?.role === 'admin';
    const url = request.nextUrl.clone()
    url.pathname = isAdmin ? '/admin/dashboard' : '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
