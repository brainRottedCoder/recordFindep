import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { verifyPassword, createSession } from "@/lib/auth"
import { verifyCSRFToken } from "@/lib/csrf"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: NextRequest) {
  try {
    // Verify CSRF token
    const isValidCSRF = await verifyCSRFToken(request)
    if (!isValidCSRF) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
    }

    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) {
      console.log("Invalid email or password");
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      console.log("Invalid email or password");
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check if email is verified (skip in development)
    if (!user.emailVerified && process.env.NODE_ENV === "production") {
      console.log("Please verify your email before logging in")
      return NextResponse.json({ error: "Please verify your email before logging in" }, { status: 401 })
    }

    // Check if account is active
    if (!user.isActive) {
      console.log("Your account has been deactivated")
      return NextResponse.json({ error: "Your account has been deactivated" }, { status: 401 })
    }

    // Create session
    await createSession(user.id, user.email)

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
