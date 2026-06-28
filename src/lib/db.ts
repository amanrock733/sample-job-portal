import { PrismaClient } from '@prisma/client'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let datasourceUrl = process.env.DATABASE_URL;

// Vercel Serverless environment changes the working directory, 
// so we MUST provide an absolute path to the bundled SQLite file.
if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
  datasourceUrl = `file:${path.join(process.cwd(), "prisma", "db", "custom.db")}`;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl,
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db