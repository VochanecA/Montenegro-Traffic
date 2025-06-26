import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const [totalJamsResult, activeJamsResult, totalUsersResult, todayJamsResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM traffic_jams`,
      sql`SELECT COUNT(*) as count FROM traffic_jams WHERE status = 'active'`,
      sql`SELECT COUNT(*) as count FROM users`,
      sql`SELECT COUNT(*) as count FROM traffic_jams WHERE DATE(created_at) = CURRENT_DATE`,
    ])

    return NextResponse.json({
      totalJams: Number.parseInt(totalJamsResult[0].count),
      activeJams: Number.parseInt(activeJamsResult[0].count),
      totalUsers: Number.parseInt(totalUsersResult[0].count),
      todayJams: Number.parseInt(todayJamsResult[0].count),
    })
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
