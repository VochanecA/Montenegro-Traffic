import type { TrafficJam } from "@/lib/db"
import { FiMapPin, FiClock } from "react-icons/fi"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface JamDetailsProps {
  jam: TrafficJam
}

export default function JamDetails({ jam }: JamDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "accident":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "construction":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "weather":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <span className="text-lg font-semibold">{jam.title}</span>
          <Badge className={getSeverityColor(jam.severity)}>{jam.severity}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {jam.description && <p className="text-sm text-gray-600 dark:text-gray-300">{jam.description}</p>}

        <div className="flex items-center space-x-2">
          <Badge className={getTypeColor(jam.jam_type)}>{jam.jam_type.replace("_", " ")}</Badge>
          <Badge
            variant="outline"
            className={jam.status === "active" ? "border-green-500 text-green-700" : "border-gray-500"}
          >
            {jam.status}
          </Badge>
        </div>

        {jam.address && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <FiMapPin className="h-4 w-4" />
            <span>{jam.address}</span>
          </div>
        )}

        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <FiClock className="h-4 w-4" />
          <span>Reported: {formatDate(jam.created_at)}</span>
        </div>

        {jam.user && (
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={jam.user.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">
                {jam.user.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600 dark:text-gray-300">{jam.user.full_name}</span>
          </div>
        )}

        {jam.photo_urls && jam.photo_urls.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Photos:</h4>
            <div className="grid grid-cols-2 gap-2">
              {jam.photo_urls.map((url, index) => (
                <img
                  key={index}
                  src={url || "/placeholder.svg"}
                  alt={`Traffic jam photo ${index + 1}`}
                  className="w-full h-20 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Coordinates: {Number(jam.latitude).toFixed(6)}, {Number(jam.longitude).toFixed(6)}
        </div>
      </CardContent>
    </Card>
  )
}
