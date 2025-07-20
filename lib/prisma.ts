import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Only create Prisma client on server-side
export const prisma = isBrowser 
  ? ({} as PrismaClient) // Return empty object in browser
  : (globalForPrisma.prisma ?? new PrismaClient())

if (process.env.NODE_ENV !== "production" && !isBrowser) globalForPrisma.prisma = prisma
