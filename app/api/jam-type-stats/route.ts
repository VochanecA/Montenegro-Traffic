import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const dayStats = await sql`
      SELECT
        jam_type,
        COUNT(*) as count
      FROM
        traffic_jams
      WHERE
        created_at >= CURRENT_DATE
      GROUP BY
        jam_type
    `

    const monthStats = await sql`
      SELECT
        jam_type,
        COUNT(*) as count
      FROM
        traffic_jams
      WHERE
        created_at >= DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY
        jam_type
    `

    const yearStats = await sql`
      SELECT
        jam_type,
        COUNT(*) as count
      FROM
        traffic_jams
      WHERE
        created_at >= DATE_TRUNC('year', CURRENT_DATE)
      GROUP BY
        jam_type
    `

    const totalStats = await sql`
      SELECT
        jam_type,
        COUNT(*) as count
      FROM
        traffic_jams
      GROUP BY
        jam_type
    `

    return NextResponse.json({
      day: dayStats,
      month: monthStats,
      year: yearStats,
      total: totalStats,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jam type stats" },
      { status: 500 }
    )
  }
}
