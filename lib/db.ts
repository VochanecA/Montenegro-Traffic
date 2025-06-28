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

/* ---- Types ---- */
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
  location: string // Added this property
  address?: string
  jam_type: "traffic_jam" | "accident" | "construction" | "weather" | "other"
  severity: "low" | "medium" | "high"
  status: "active" | "resolved"
  photo_urls?: string[]
  created_at: string
  updated_at: string
  user?: { full_name: string; avatar_url?: string }
}

export async function getTrafficJamById(id: number): Promise<TrafficJam | null> {
  const result = await sql`
    SELECT
      tj.*,
      u.full_name,
      u.avatar_url
    FROM traffic_jams tj
    LEFT JOIN users u ON tj.user_id = u.id
    WHERE tj.id = ${id}
    LIMIT 1
  `;

  // Access rows property (result.rows) - adjust if your client uses a different property
  const rows = (result as any).rows || result;

  if (!rows || rows.length === 0) return null;

  const jam = rows[0];

  return {
    ...jam,
    user: {
      full_name: jam.full_name || "Unknown User",
      avatar_url: jam.avatar_url || undefined,
    },
  } as TrafficJam;
}
