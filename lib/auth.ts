import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { env } from "./env"

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET)
const COOKIE_NAME = "finverse-session"

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

export interface SessionPayload {
  userId: string
  email: string
  expiresAt: Date
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Create JWT token
export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

// Create session
export async function createSession(userId: string, email: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const sessionPayload: SessionPayload = { userId, email, expiresAt }

  const token = await createToken(sessionPayload)

  // Store session in database
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })

  // Set HTTP-only cookie
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  return token
}

// Get current session
export async function getSession(): Promise<SessionPayload | null> {
  // Don't run in browser
  if (isBrowser) return null
  
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  // Verify token
  const payload = await verifyToken(token)
  if (!payload) return null

  // Check if session exists in database
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    // Clean up expired session
    if (session) {
      await prisma.session.delete({ where: { id: session.id } })
    }
    return null
  }

  return payload
}

// Get current user
export async function getCurrentUser() {
  // Don't run in browser
  if (isBrowser) return null
  
  const session = await getSession()
  if (!session) return null

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      age: true,
      income: true,
      currency: true,
      emailVerified: true,
      createdAt: true,
    },
  })
}

// Delete session
export async function deleteSession() {
  // Don't run in browser
  if (isBrowser) return
  
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (token) {
    // Remove from database
    await prisma.session.deleteMany({
      where: { token },
    })
  }

  // Clear cookie
  cookieStore.delete(COOKIE_NAME)
}

// Generate random token
export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Verify session from request (for API routes)
export async function verifySessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  // Don't run in browser
  if (isBrowser) return null
  
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload) return null

  // Check database
  const session = await prisma.session.findUnique({
    where: { token },
  })

  if (!session || session.expiresAt < new Date()) {
    return null
  }

  return payload
}
