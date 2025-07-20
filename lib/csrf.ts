import { cookies } from 'next/headers'
import crypto from 'crypto'

const CSRF_COOKIE_NAME = 'finverse-csrf'
const CSRF_HEADER_NAME = 'x-csrf-token'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Generate CSRF token
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Set CSRF token in cookie
export async function setCSRFToken(): Promise<string> {
  // Don't run in browser
  if (isBrowser) throw new Error('setCSRFToken cannot run in browser')
  
  const token = generateCSRFToken()
  const cookieStore = await cookies()
  
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  })
  
  return token
}

// Verify CSRF token
export async function verifyCSRFToken(request: Request): Promise<boolean> {
  // Don't run in browser
  if (isBrowser) return false
  
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value
  const headerToken = request.headers.get(CSRF_HEADER_NAME)
  
  if (!cookieToken || !headerToken) {
    return false
  }
  
  return cookieToken === headerToken
}

// Get CSRF token for client-side
export async function getCSRFToken(): Promise<string | null> {
  // Don't run in browser
  if (isBrowser) return null
  
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_COOKIE_NAME)?.value || null
} 