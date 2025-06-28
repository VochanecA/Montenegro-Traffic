import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const topUsers = await sql`
      SELECT
        u.id,
        u.full_name,
        u.avatar_url,
        COUNT(tj.id) as jam_count
      FROM
        users u
      LEFT JOIN
        traffic_jams tj ON u.id = tj.user_id
      GROUP BY
        u.id, u.full_name, u.avatar_url
      ORDER BY
        jam_count DESC
      LIMIT 10
    `
    return NextResponse.json(topUsers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch top users" }, { status: 500 })
  }
}
