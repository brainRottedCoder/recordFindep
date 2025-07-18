import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createSession } from "@/lib/auth"

const googleAuthSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  picture: z.string().url().optional(),
  sub: z.string(), // Google user ID
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, picture, sub } = googleAuthSchema.parse(body)

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: sub },
        })
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name,
          avatar: picture,
          googleId: sub,
          emailVerified: new Date(), // Google accounts are pre-verified
        },
      })
    }

    // Create session
    await createSession(user.id, user.email)

    return NextResponse.json({
      message: "Google authentication successful",
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

    console.error("Google auth error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
