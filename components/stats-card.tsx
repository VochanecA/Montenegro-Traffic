"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FiAlertTriangle, FiUsers, FiMapPin, FiTrendingUp } from "react-icons/fi"

interface Stats {
  totalJams: number
  activeJams: number
  totalUsers: number
  todayJams: number
}

export default function StatsCard() {
  const [stats, setStats] = useState<Stats>({
    totalJams: 0,
    activeJams: 0,
    totalUsers: 0,
    todayJams: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <FiAlertTriangle className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Jams</p>
              <p className="text-2xl font-bold text-red-600">{stats.activeJams}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <FiMapPin className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Reports</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalJams}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <FiUsers className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Users</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <FiTrendingUp className="h-4 w-4 text-teal-500" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Today</p>
              <p className="text-2xl font-bold text-teal-600">{stats.todayJams}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
