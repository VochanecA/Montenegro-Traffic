// components/top-users-card.tsx
"use client"

import { useEffect, useState } from "react"
import { FiUser, FiAward, FiStar } from "react-icons/fi" // Added FiAward and FiStar for more icon options
import Image from "next/image" // Use Next.js Image for optimized avatars

interface TopUser {
  id: number
  full_name: string
  avatar_url?: string
  jam_count: number
}

// Updated color pills for top ranks with better contrasts and gradients
const rankColors = [
  "bg-gradient-to-br from-yellow-300 to-amber-500 text-yellow-900 shadow-md", // 1st Place (Gold)
  "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-800 shadow-md",     // 2nd Place (Silver)
  "bg-gradient-to-br from-orange-300 to-rose-500 text-orange-900 shadow-md", // 3rd Place (Bronze-ish)
  "bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 shadow-sm", // Others
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
      <div className="w-full max-w-md mx-auto rounded-3xl shadow-2xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 p-6 animate-pulse">
        <div className="flex items-center mb-6">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-12 h-12 mr-4"></div>
          <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-inner">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-6 w-1/5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl shadow-2xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 p-6">
      <div className="flex items-center mb-6">
        <span className="bg-white/50 dark:bg-gray-800/50 rounded-full p-3 shadow-lg mr-4 flex-shrink-0">
          <FiAward className="text-blue-500 text-3xl" /> {/* Changed icon to FiAward */}
        </span>
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight leading-tight">
          Top Contributors
        </h2>
      </div>
      <div className="space-y-4">
        {topUsers.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 italic py-4">No top contributors found yet.</p>
        ) : (
          topUsers.map((user, idx) => (
            <div
              key={user.id}
              className={`flex items-center gap-4 p-3 rounded-2xl shadow-inner transform hover:scale-[1.01] transition-all duration-200 ease-out ${
                idx === 0
                  ? "bg-yellow-50/70 dark:bg-yellow-950/40" // Lighter gold background for 1st
                  : idx === 1
                  ? "bg-gray-100/70 dark:bg-gray-800/40" // Lighter silver background for 2nd
                  : idx === 2
                  ? "bg-orange-50/70 dark:bg-orange-950/40" // Lighter bronze background for 3rd
                  : "bg-white/40 dark:bg-gray-800/20" // Default for others with more transparency
              }`}
            >
              {/* Avatar or icon */}
              <div className="flex-shrink-0">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.full_name}
                    width={48} // Consistent size with other avatars
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/60 dark:border-gray-700 shadow-md"
                  />
                ) : (
                  <span className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200/50 dark:bg-gray-700/50 shadow-md">
                    <FiUser className="text-2xl text-gray-500 dark:text-gray-400" />
                  </span>
                )}
              </div>
              {/* Name and rank pill */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span
                    className={`px-3 py-1 rounded-full font-bold text-xs sm:text-sm shadow-md ${
                      rankColors[idx] || rankColors[3]
                    }`}
                  >
                    {idx === 0
                      ? "🥇 Top 1st"
                      : idx === 1
                      ? "🥈 Top 2nd"
                      : idx === 2
                      ? "🥉 Top 3rd"
                      : `#${idx + 1}`} {/* Changed "th" to "#" for consistency, more professional */}
                  </span>
                  <span className="truncate text-base font-semibold text-gray-800 dark:text-white mt-1 sm:mt-0">
                    {user.full_name}
                  </span>
                </div>
              </div>
              {/* Jam count pill */}
              <span className="flex-shrink-0 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-900/80 text-blue-700 dark:text-blue-200 font-bold text-sm shadow">
                {user.jam_count} reports
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}