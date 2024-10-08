import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// You could store this in an environment variable or Edge Config
const MAINTENANCE_MODE = true

export function middleware(request: NextRequest) {
  if (MAINTENANCE_MODE) {
    return NextResponse.rewrite(new URL('/maintainance', request.url))
  }
}

export const config = {
  matcher: '/:path*',
}
