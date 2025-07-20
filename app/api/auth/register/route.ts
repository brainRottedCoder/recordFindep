import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { hashPassword, generateToken } from "@/lib/auth"
import { sendEmail, getVerificationEmailTemplate } from "@/lib/email"
import { verifyCSRFToken } from "@/lib/csrf"

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
})

export async function POST(request: NextRequest) {
  try {
    // Verify CSRF token
    const isValidCSRF = await verifyCSRFToken(request)
    if (!isValidCSRF) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, name } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log("User with this email already exists")
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    console.log("creating new user");
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        // Auto-verify email in development
        emailVerified: process.env.NODE_ENV === "development" ? new Date() : null,
      },
    })

    // Generate verification token (only in production)
    if (process.env.NODE_ENV === "production") {
      const verificationToken = generateToken()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      await prisma.verificationToken.create({
        data: {
          userId: user.id,
          token: verificationToken,
          expiresAt,
        },
      })

      // Send verification email
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${verificationToken}`

      await sendEmail({
        to: email,
        subject: "Verify your email - FinVerse",
        html: getVerificationEmailTemplate(name, verificationUrl),
      })

      return NextResponse.json({
        message: "Registration successful! Please check your email to verify your account.",
        userId: user.id,
      })
    } else {
      // In development, return success immediately
      return NextResponse.json({
        message: "Registration successful! You can now log in.",
        userId: user.id,
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
