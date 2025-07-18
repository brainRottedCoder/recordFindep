import { type NextRequest, NextResponse } from "next/server"
import { verifySessionFromRequest } from "@/lib/auth"

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Get session
  const session = await verifySessionFromRequest(request)

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/auth", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && session) {
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
