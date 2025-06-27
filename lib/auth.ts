import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sql } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Define the User type
interface User {
  id: number
  email: string
  full_name: string
  avatar_url?: string
  created_at?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number }
  } catch {
    return null
  }
}

export async function getUserFromToken(token: string): Promise<User | null> {
  const decoded = verifyToken(token)
  if (!decoded) return null

  const users = await sql`
    SELECT id, email, full_name, avatar_url, created_at
    FROM users
    WHERE id = ${decoded.userId}
  ` as User[]

  return users[0] || null
}