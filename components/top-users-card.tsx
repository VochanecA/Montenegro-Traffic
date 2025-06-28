"use client"

import { useEffect, useState } from "react"
import { FiUser } from "react-icons/fi"

interface TopUser {
  id: number
  full_name: string
  avatar_url?: string
  jam_count: number
}

// Color pills for top ranks
const rankColors = [
  "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900", // 1st
  "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800",       // 2nd
  "bg-gradient-to-r from-orange-300 to-orange-500 text-orange-900", // 3rd
  "bg-white/60 text-gray-700",                                      // others
]

export default function TopUsersCard() {
  const [topUsers, setTopUsers] = useState<TopUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopUsers()
  }, [])

  const fetchTopUsers = async () => {
    try {
      const response = await fetch("/api/top-users")
      if (response.ok) {
        const data = await response.json()
        setTopUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch top users:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto rounded-3xl shadow-xl bg-white/30 backdrop-blur-lg border border-white/30 animate-pulse p-6">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl shadow-2xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 p-6">
      <div className="flex items-center mb-4">
        <span className="bg-white/40 dark:bg-gray-800/40 rounded-full p-3 shadow-lg mr-3">
          <FiUser className="text-blue-500 text-2xl" />
        </span>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
          Top 10 Users
        </h2>
      </div>
      <div className="space-y-4">
        {topUsers.map((user, idx) => (
          <div
            key={user.id}
            className={`flex items-center gap-4 p-3 rounded-2xl shadow-inner transition-all ${
              idx === 0
                ? "bg-yellow-50/70"
                : idx === 1
                ? "bg-gray-100/70"
                : idx === 2
                ? "bg-orange-50/70"
                : "bg-white/40 dark:bg-gray-800/40"
            }`}
          >
            {/* Avatar or icon */}
            <div className="flex-shrink-0">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/60 shadow"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(4px)",
                  }}
                />
              ) : (
                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-white/40 shadow">
                  <FiUser className="text-2xl text-gray-400" />
                </span>
              )}
            </div>
            {/* Name and rank pill */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full font-bold text-xs shadow-sm ${
                    rankColors[idx] || rankColors[3]
                  }`}
                >
                  {idx === 0
                    ? "🥇 1st"
                    : idx === 1
                    ? "🥈 2nd"
                    : idx === 2
                    ? "🥉 3rd"
                    : `${idx + 1}th`}
                </span>
                <span className="truncate text-base font-semibold text-gray-800 dark:text-white">
                  {user.full_name}
                </span>
              </div>
            </div>
            {/* Jam count pill */}
            <span className="px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 font-bold text-sm shadow">
              {user.jam_count} reports
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
