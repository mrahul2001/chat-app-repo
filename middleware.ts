import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  
  // This will refresh the session if expired and store in the cookie
  await supabase.auth.getSession()
  
  return res
}

export const config = {
  matcher: [
    // Apply middleware to all routes that are not static files, public routes, or api routes
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
} 