import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginPage) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const session = await verifyToken(token)
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  if (isLoginPage && token) {
    const session = await verifyToken(token)
    if (session) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
