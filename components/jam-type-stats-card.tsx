// components/jam-type-stats-card.tsx
"use client"

import { useEffect, useState, ReactElement } from "react"
import { FiPieChart, FiSun, FiCalendar, FiClock, FiAward } from "react-icons/fi"

interface JamTypeStats {
  day: { jam_type: string; count: number }[]
  month: { jam_type: string; count: number }[]
  year: { jam_type: string; count: number }[]
  total: { jam_type: string; count: number }[]
}

// Modern and distinct colors for each real jam type
const jamTypeColors: Record<string, string> = {
  accident: "bg-red-500/90 text-white", // Red for accidents
  construction: "bg-yellow-500/90 text-gray-900", // Yellow for construction
  weather: "bg-blue-500/90 text-white", // Blue for weather-related jams
  traffic_jam: "bg-orange-500/90 text-white", // Orange for general traffic
  other: "bg-purple-500/90 text-white", // Purple for miscellaneous
  Default: "bg-gray-300/90 text-gray-800", // Fallback for unknown types
}

// Redesigned period metadata with gradients and refined text colors
const periodMeta: Record<
  string,
  {
    bg: string // Background gradient
    text: string // Text color for heading
    icon: ReactElement // Icon for the period
    label: string // Display label for the period
  }
> = {
  day: {
    bg: "bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-700 dark:to-amber-800",
    text: "text-yellow-800 dark:text-yellow-200",
    icon: <FiSun className="inline-block mr-2 text-yellow-600 dark:text-yellow-300" />,
    label: "Today",
  },
  month: {
    bg: "bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-700 dark:to-indigo-800",
    text: "text-blue-800 dark:text-blue-200",
    icon: <FiCalendar className="inline-block mr-2 text-blue-600 dark:text-blue-300" />,
    label: "This Month",
  },
  year: {
    bg: "bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-700 dark:to-emerald-800",
    text: "text-green-800 dark:text-green-200",
    icon: <FiClock className="inline-block mr-2 text-emerald-600 dark:text-emerald-300" />,
    label: "This Year",
  },
  total: {
    bg: "bg-gradient-to-br from-pink-200 to-rose-300 dark:from-pink-800 dark:to-rose-900",
    text: "text-pink-900 dark:text-pink-100",
    icon: <FiAward className="inline-block mr-2 text-pink-600 dark:text-pink-300" />,
    label: "Overall Total",
  },
}

export default function JamTypeStatsCard() {
  const [jamTypeStats, setJamTypeStats] = useState<JamTypeStats>({
    day: [],
    month: [],
    year: [],
    total: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJamTypeStats()
  }, [])

  const fetchJamTypeStats = async () => {
    try {
      const response = await fetch("/api/jam-type-stats")
      if (response.ok) {
        const data = await response.json()
        setJamTypeStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch jam type stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderStats = (stats: { jam_type: string; count: number }[]) => {
    const total = stats.reduce((sum, { count }) => sum + count, 0)
    if (stats.length === 0 || total === 0) { // Added total === 0 check
      return (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No data available for this period.</p>
      );
    }
    return stats.map(({ jam_type, count }) => {
      // Normalize jam_type for consistent display (e.g., "traffic_jam" -> "Traffic Jam")
      const displayJamType = jam_type
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const color = jamTypeColors[jam_type] || jamTypeColors.Default;
      const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";

      return (
        <div
          key={jam_type}
          className="flex items-center justify-between py-1 px-2 rounded-md transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-800/50"
        >
          <span
            className={`px-3 py-1 rounded-full font-semibold text-sm shadow-sm ${color}`}
          >
            {displayJamType}
          </span>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {percentage}%
            </span>
            <span className="min-w-[32px] text-center px-2 py-0.5 rounded-full bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-white text-xs font-bold shadow-sm">
              {count}
            </span>
          </div>
        </div>
      )
    })
  }

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto rounded-3xl shadow-2xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 p-6 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-12 h-12 mr-3"></div>
          <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-4 h-32 bg-gray-100 dark:bg-gray-800 shadow-inner">
              <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-4 w-1/6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-4 w-1/6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
              </div>
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
          <FiPieChart className="text-teal-500 text-3xl" />
        </span>
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight leading-tight">
          Traffic Type Breakdown
        </h2>
      </div>
      <div className="space-y-6">
        {["day", "month", "year", "total"].map((period) => {
          const { bg, text, icon, label } = periodMeta[period]
          return (
            <div
              key={period}
              className={`rounded-2xl p-5 ${bg} shadow-inner transform hover:scale-[1.02] transition-transform duration-300 ease-out`}
            >
              <h3
                className={`text-xl font-bold mb-3 tracking-wide flex items-center ${text}`}
              >
                {icon}
                {label}
              </h3>
              <div className="space-y-3">
                {renderStats(jamTypeStats[period as keyof JamTypeStats])}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}