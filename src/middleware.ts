import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For demo: skip auth check
  // In production, check for valid session token
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/projects/:path*',
    '/team/:path*',
    '/reports/:path*',
    '/settings/:path*',
  ],
}
