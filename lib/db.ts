import { neon } from "@neondatabase/serverless"

let _sql: ReturnType<typeof neon> | null = null

export function sql(...args: Parameters<ReturnType<typeof neon>>) {
  if (!_sql) {
    const url = process.env.DATABASE_URL
    if (!url) {
      // Warn instead of crashing during build/preview;
      // still fail fast at runtime if a query is attempted.
      console.error(
        "❌ DATABASE_URL environment variable is not set. " +
          "Set it in your Vercel/locally `.env` before querying the database.",
      )
      throw new Error("DATABASE_URL environment variable is not set")
    }
    _sql = neon(url)
  }

  return _sql(...args)
}

/* ---- Types (unchanged) ---- */
export interface User {
  id: number
  email: string
  password_hash: string
  full_name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface TrafficJam {
  id: number
  user_id: number
  title: string
  description?: string
  latitude: number
  longitude: number
  address?: string
  jam_type: "traffic_jam" | "accident" | "construction" | "weather" | "other"
  severity: "low" | "medium" | "high"
  status: "active" | "resolved"
  photo_urls?: string[]
  created_at: string
  updated_at: string
  user?: { full_name: string; avatar_url?: string }
}
