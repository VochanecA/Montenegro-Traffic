import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { full_name, email, password } = await request.json()

    // Validate input
    if (!full_name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password and create user
    const password_hash = await hashPassword(password)

    const result = await sql`
      INSERT INTO users (full_name, email, password_hash)
      VALUES (${full_name}, ${email}, ${password_hash})
      RETURNING id, email, full_name, created_at
    `

    return NextResponse.json({
      message: "User created successfully",
      user: result[0],
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
