import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

export async function GET() {
  try {
    const jams = await sql`
      SELECT 
        tj.*,
        u.full_name,
        u.avatar_url
      FROM traffic_jams tj
      LEFT JOIN users u ON tj.user_id = u.id
      WHERE tj.status = 'active'
      ORDER BY tj.created_at DESC
    `

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

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Failed to create jam:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
