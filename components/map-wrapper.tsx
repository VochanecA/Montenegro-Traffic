"use client"

import dynamic from "next/dynamic"
import type { TrafficJam } from "@/lib/db"

const Map = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
})

interface MapWrapperProps {
  trafficJams: TrafficJam[]
}

export default function MapWrapper({ trafficJams }: MapWrapperProps) {
  return <Map trafficJams={trafficJams} />
}
