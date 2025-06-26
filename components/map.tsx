"use client"

import { useEffect, useRef } from "react"
import type { TrafficJam } from "@/lib/db"

// Grab the global Leaflet that the layout <script> injects.
function getLeaflet(): typeof import("leaflet") | null {
  if (typeof window !== "undefined" && (window as any).L) {
    return (window as any).L
  }
  return null
}

// Fix for default markers in Leaflet
const L = getLeaflet()
if (L) {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  })
}

interface MapProps {
  trafficJams: TrafficJam[]
  onMarkerClick?: (jam: TrafficJam) => void
  onMapClick?: (lat: number, lng: number) => void
}

export default function Map({ trafficJams, onMarkerClick, onMapClick }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map centered on Montenegro
    const L = getLeaflet()
    if (!L) return
    const map = L.map(mapRef.current).setView([42.7087, 19.3744], 8)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map)

    mapInstanceRef.current = map

    // Add click handler for map
    if (onMapClick) {
      map.on("click", (e) => {
        onMapClick(e.latlng.lat, e.latlng.lng)
      })
    }

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [onMapClick])

  useEffect(() => {
    const L = getLeaflet()
    if (!L || !mapInstanceRef.current) return

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker)
    })
    markersRef.current = []

    // Create red icon for traffic jams
    const redIcon = L.divIcon({
      className: "custom-marker",
      html: `<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
               <div class="w-2 h-2 bg-white rounded-full"></div>
             </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })

    // Add markers for traffic jams
    trafficJams.forEach((jam) => {
      const marker = L.marker([jam.latitude, jam.longitude], { icon: redIcon }).addTo(mapInstanceRef.current!)

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-sm">${jam.title}</h3>
          <p class="text-xs text-gray-600 mt-1">${jam.description || ""}</p>
          <p class="text-xs text-gray-500 mt-1">Type: ${jam.jam_type}</p>
          <p class="text-xs text-gray-500">Severity: ${jam.severity}</p>
        </div>
      `)

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(jam))
      }

      markersRef.current.push(marker)
    })
  }, [trafficJams, onMarkerClick])

  return <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg" />
}
