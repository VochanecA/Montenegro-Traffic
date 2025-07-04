"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FiMapPin, FiCamera, FiX } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import dynamic from 'next/dynamic'

interface User {
  id: number
  email: string
  full_name: string
  avatar_url?: string
}

interface JamFormProps {
  selectedLocation?: { lat: number; lng: number }
  onLocationSelect?: (lat: number, lng: number) => void
  isAuthenticated: boolean
  user?: User
}

export default function JamForm({
  selectedLocation,
  onLocationSelect,
  isAuthenticated,
  user
}: JamFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showMapPicker, setShowMapPicker] = useState(false)
  const MapPicker = dynamic(
    () => import('@/components/map-picker'),
    { ssr: false }
  )
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    latitude: selectedLocation?.lat || 0,
    longitude: selectedLocation?.lng || 0,
    address: "",
    jam_type: "traffic_jam",
    severity: "medium",
  })
  const [photos, setPhotos] = useState<File[]>([])
  const router = useRouter()
  const { toast } = useToast()

  const handleOpenChange = (open: boolean) => {
    if (open && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to report traffic jams",
        variant: "default",
      })
      router.push("/login")
    } else {
      setIsOpen(open)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setFormData((prev) => ({ ...prev, latitude, longitude }))
          onLocationSelect?.(latitude, longitude)
          toast({
            title: "Location detected",
            description: "Your current location has been set.",
          })
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Could not get your current location.",
            variant: "destructive",
          })
        },
      )
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files)
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, 5))
    }
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to report traffic jams",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setLoading(true)

    try {
      let photoUrls: string[] = []
      if (photos.length > 0) {
        const formDataPhotos = new FormData()
        photos.forEach((photo, index) => {
          formDataPhotos.append(`photo-${index}`, photo)
        })

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataPhotos,
        })

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          photoUrls = uploadResult.urls
        }
      }

      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1]

      const response = await fetch("/api/jams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          photo_urls: photoUrls,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Traffic jam reported successfully.",
        })
        setIsOpen(false)
        setFormData({
          title: "",
          description: "",
          latitude: 0,
          longitude: 0,
          address: "",
          jam_type: "traffic_jam",
          severity: "medium",
        })
        setPhotos([])
        router.refresh()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to report traffic jam. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white">
          Report Traffic Jam
        </Button>
      </DialogTrigger>

      {isAuthenticated && (
        <DialogContent className={`sm:max-w-[500px] max-h-[90vh] overflow-y-auto z-[1000] ${showMapPicker ? "h-[90vh]" : ""}`}>
          <DialogHeader>
            <DialogTitle>Report Traffic Jam or Blockage</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the traffic situation"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jam_type">Type</Label>
                <Select
                  value={formData.jam_type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, jam_type: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="z-[1001]">
                    <SelectItem value="traffic_jam">Traffic Jam</SelectItem>
                    <SelectItem value="accident">Accident</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="weather">Weather</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, severity: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent className="z-[1001]">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Street address or landmark"
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData((prev) => ({ ...prev, latitude: Number.parseFloat(e.target.value) || 0 }))}
                  placeholder="Latitude"
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, longitude: Number.parseFloat(e.target.value) || 0 }))
                  }
                  placeholder="Longitude"
                  className="flex-1"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  title="Use my current location"
                  className="flex items-center flex-1"
                >
                  <FiMapPin className="h-4 w-4 mr-1" />
                  Use my location
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMapPicker(true)}
                  title="Pick location on map"
                  className="flex items-center flex-1"
                >
                  <FiMapPin className="h-4 w-4 mr-1" />
                  Pick on map
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="photos">Photos (max 5)</Label>
              <div className="mt-2">
                <input
                  id="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("photos")?.click()}
                  className="w-full"
                >
                  <FiCamera className="mr-2 h-4 w-4" />
                  Add Photos
                </Button>
              </div>
              {photos.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo) || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => removePhoto(index)}
                      >
                        <FiX className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.title || !formData.latitude || !formData.longitude}
                className="bg-teal-500 hover:bg-teal-600"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
          {showMapPicker && (
            <MapPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onPick={(lat, lng) => {
                setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
                setShowMapPicker(false);
              }}
            />
          )}
        </DialogContent>
      )}
    </Dialog>
  )
}