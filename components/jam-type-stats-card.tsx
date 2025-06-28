"use client"

import { useEffect, useState, ReactElement } from "react"
import { FiPieChart, FiSun, FiCalendar, FiClock, FiAward } from "react-icons/fi"

interface JamTypeStats {
  day: { jam_type: string; count: number }[]
  month: { jam_type: string; count: number }[]
  year: { jam_type: string; count: number }[]
  total: { jam_type: string; count: number }[]
}

// Color for each jam type pill
const jamTypeColors: Record<string, string> = {
  Strawberry: "bg-pink-400/80 text-white",
  Blueberry: "bg-blue-400/80 text-white",
  Raspberry: "bg-red-400/80 text-white",
  Apricot: "bg-orange-400/80 text-white",
  Default: "bg-gray-200/70 text-gray-800",
}

// Brighter background, text, icon, and label for each period
const periodMeta: Record<
  string,
  {
    bg: string
    text: string
    size: string
    icon: ReactElement
    label: string
  }
> = {
  day: {
    bg: "bg-yellow-300/90",
    text: "text-yellow-900",
    size: "text-base",
    icon: <FiSun className="inline mr-2 text-yellow-600" />,
    label: "Day",
  },
  month: {
    bg: "bg-blue-300/90",
    text: "text-blue-900",
    size: "text-lg",
    icon: <FiCalendar className="inline mr-2 text-blue-600" />,
    label: "Month",
  },
  year: {
    bg: "bg-emerald-300/90",
    text: "text-emerald-900",
    size: "text-xl",
    icon: <FiClock className="inline mr-2 text-emerald-600" />,
    label: "Year",
  },
  total: {
    bg: "bg-pink-400/90",
    text: "text-pink-50",
    size: "text-2xl",
    icon: <FiAward className="inline mr-2 text-pink-100" />,
    label: "Total",
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
    return stats.map(({ jam_type, count }) => {
      const color = jamTypeColors[jam_type] || jamTypeColors.Default
      return (
        <div
          key={jam_type}
          className="flex items-center justify-between py-1"
        >
          <span
            className={`px-3 py-1 rounded-full font-semibold text-sm shadow-sm transition-all ${color}`}
          >
            {jam_type}
          </span>
          <span className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {((count / (total || 1)) * 100).toFixed(1)}%
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/60 text-gray-700 text-xs font-bold shadow">
              {count}
            </span>
          </span>
        </div>
      )
    })
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
          <FiPieChart className="text-pink-500 text-2xl" />
        </span>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
          Jam Type Statistics
        </h2>
      </div>
      <div className="space-y-6">
        {["day", "month", "year", "total"].map((period) => {
          const { bg, text, size, icon, label } = periodMeta[period]
          return (
            <div
              key={period}
              className={`rounded-2xl p-4 mb-1 ${bg} shadow-inner`}
            >
              <h3
                className={`uppercase font-semibold mb-2 tracking-wider flex items-center gap-2 ${text} ${size}`}
              >
                {icon}
                {label}
              </h3>
              <div className="space-y-2">
                {renderStats(jamTypeStats[period as keyof JamTypeStats])}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
