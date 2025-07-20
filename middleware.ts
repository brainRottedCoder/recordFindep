import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/settings",
  "/chat",
  "/simulator",
  "/learn",
  "/api/user",
  "/api/expenses",
  "/api/savings",
  "/api/investments",
]

// Define auth routes (redirect to dashboard if authenticated)
const authRoutes = ["/auth", "/onboarding"]

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-development")
const COOKIE_NAME = "finverse-session"

// Simple JWT verification without Prisma
async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Get session token from cookie
  const token = request.cookies.get(COOKIE_NAME)?.value
  let isAuthenticated = false

  if (token) {
    const payload = await verifyToken(token)
    isAuthenticated = !!payload
  }

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
