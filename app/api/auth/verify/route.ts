import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail, getWelcomeEmailTemplate } from "@/lib/email"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid verification token" }, { status: 400 })
    }

    // Check if token is expired
    if (verificationToken.expiresAt < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      })

      return NextResponse.json({ error: "Verification token has expired" }, { status: 400 })
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    })

    // Delete verification token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    })

    // Send welcome email
    await sendEmail({
      to: verificationToken.user.email,
      subject: "Welcome to FinVerse!",
      html: getWelcomeEmailTemplate(verificationToken.user.name || "there"),
    })

    // Redirect to success page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth?verified=true`)
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
