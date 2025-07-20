// Environment variable validation
export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "file:./prisma/dev.db",
  JWT_SECRET: process.env.JWT_SECRET || "fallback-secret-key-for-development",
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  FROM_EMAIL: process.env.FROM_EMAIL || "noreply@finverse.app",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
} as const

// Validate required environment variables
export function validateEnv() {
  const required = ['JWT_SECRET']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`)
    console.warn('Using fallback values for development')
  }
} 