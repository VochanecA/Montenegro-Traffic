import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

// Define the type for your jam with user info
interface TrafficJamWithUser {
  id: number
  user_id: number | null
  title: string
  description?: string | null
  latitude: number
  longitude: number
  address?: string | null
  jam_type: string
  severity: string
  status: string
  photo_urls: string[] | null
  created_at: string
  updated_at: string
  full_name?: string | null
  avatar_url?: string | null
}

export async function GET() {
  try {
    // Raw result from DB
const rawResult = await sql`
  SELECT
    tj.*,
    u.full_name,
    u.avatar_url
  FROM traffic_jams tj
  LEFT JOIN users u ON tj.user_id = u.id
  WHERE tj.status = 'active'
  -- AND tj.created_at > NOW() - INTERVAL '6 hours'
  ORDER BY tj.created_at DESC
`;

// console.log("Raw SQL Result:", rawResult)
    // Cast rawResult to an array of TrafficJamWithUser
    const jams = rawResult as unknown as TrafficJamWithUser[]

    return NextResponse.json(
      jams.map((jam) => ({
        ...jam,
        user: jam.full_name
          ? {
              full_name: jam.full_name,
              avatar_url: jam.avatar_url,
            }
          : undefined,
      })),
    )
  } catch (error) {
    console.error("Failed to fetch jams:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { title, description, latitude, longitude, address, jam_type, severity, photo_urls } = await request.json()

    if (!title || !latitude || !longitude) {
      return NextResponse.json({ error: "Title, latitude, and longitude are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO traffic_jams (
        user_id, title, description, latitude, longitude, 
        address, jam_type, severity, photo_urls
      )
      VALUES (
        ${user.id}, ${title}, ${description || null}, ${latitude}, ${longitude},
        ${address || null}, ${jam_type || "traffic_jam"}, ${severity || "medium"}, 
        ${photo_urls || []}
      )
      RETURNING *
    `

    // Cast result to an array of jams, then get first element safely
    const jams = result as unknown as TrafficJamWithUser[]
    const newJam = jams.at(0)

    if (!newJam) {
      return NextResponse.json({ error: "Failed to create jam" }, { status: 500 })
    }

    return NextResponse.json(newJam)
  } catch (error) {
    console.error("Failed to create jam:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
