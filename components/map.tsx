"use client";

import { useEffect, useRef } from "react";
import type { TrafficJam } from "@/lib/db";
import { fetchWeather, WeatherData, montenegrinCities } from "@/lib/weather";

// Ensure Leaflet is properly imported and initialized
const L = getLeaflet();

interface MapProps {
  trafficJams: TrafficJam[];
  onMarkerClick?: (jam: TrafficJam) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

export default function Map({ trafficJams, onMarkerClick, onMapClick }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const cityWeatherLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize map with two base tile layers and layer control
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = getLeaflet();
    if (!L) return;

    // Define base tile layers
    const osmStandard = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    });

    const osmHumanitarian = L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        "© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France",
      maxZoom: 19,
    });

    // Layer group for city weather overlays
    const cityWeatherLayer = L.layerGroup();
    cityWeatherLayerRef.current = cityWeatherLayer;

    // Initialize map with default layer
    const map = L.map(mapRef.current, {
      center: [42.7087, 19.3744],
      zoom: 8,
      layers: [osmStandard],
    });

    // Add layer control: base layers and overlays
    const baseLayers = {
      "OpenStreetMap Standard": osmStandard,
      "OpenStreetMap Humanitarian": osmHumanitarian,
    };
    const overlays = {
      "Major Cities Weather": cityWeatherLayer,
    };
    L.control.layers(baseLayers, overlays).addTo(map);

    mapInstanceRef.current = map;

    if (onMapClick) {
      map.on("click", (e) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onMapClick]);

  // Weather markers for all major cities (as an overlay group)
  useEffect(() => {
    const L = getLeaflet();
    if (!L || !mapInstanceRef.current || !cityWeatherLayerRef.current) return;

    // Clear previous city weather markers
    cityWeatherLayerRef.current.clearLayers();

    // For each city, fetch weather and add marker to the group
    montenegrinCities.forEach(async (city) => {
      try {
        const data = await fetchWeather(city.lat, city.lon);

        const iconHtml = `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <img src="${data.icon.startsWith("http") ? data.icon : `https:${data.icon}`}" 
                 alt="${data.conditions}" style="width:36px;height:36px;" />
            <span style="margin-top:2px; font-weight:bold; color:#222; background:rgba(255,255,255,0.85); border-radius:4px; padding:2px 6px; font-size:15px;">
              ${data.temp}°C
            </span>
          </div>
        `;

        const weatherIcon = L.divIcon({
          className: "weather-marker",
          html: iconHtml,
          iconSize: [44, 56],
          iconAnchor: [22, 56],
        });

        const marker = L.marker([city.lat, city.lon], { icon: weatherIcon })
          .bindPopup(`
            <div style="text-align:center;">
              <strong>${city.name}</strong><br/>
              <img src="${data.icon.startsWith("http") ? data.icon : `https:${data.icon}`}" alt="${data.conditions}" width="48" height="48"/><br/>
              <span style="font-size:18px;">
                ${data.temp}°C
                <span style="color:#888;font-size:15px;">(feels like ${data.feelslike}°C)</span>
              </span><br/>
              <span>${data.conditions}</span><br/>
              <span>Wind: ${data.windSpeed} km/h <b>${data.windDir}</b></span><br/>
              <span style="font-size:12px; color:#888;">Updated: ${data.lastUpdated}</span>
            </div>
          `);

        marker.addTo(cityWeatherLayerRef.current!);
      } catch (err) {
        // Optionally handle error
      }
    });

    // Add the overlay to the map (if not already)
    cityWeatherLayerRef.current.addTo(mapInstanceRef.current);

    // Cleanup: clear markers on unmount
    return () => {
      cityWeatherLayerRef.current?.clearLayers();
    };
  }, []); // Only run on mount

  // Traffic jam markers (unchanged)
  useEffect(() => {
    const L = getLeaflet();
    if (!L || !mapInstanceRef.current) return;

    markersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    const redIcon = L.divIcon({
      className: "custom-marker",
      html: `<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    trafficJams.forEach((jam) => {
      const marker = L.marker([jam.latitude, jam.longitude], {
        icon: redIcon,
      }).addTo(mapInstanceRef.current!);

      (marker as any).jamId = jam.id;
      marker.bindPopup(createPopupContent(jam));

      marker.on("popupopen", async () => {
        // ... your existing popup logic ...
      });

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(jam));
      }

      markersRef.current.push(marker);
    });
  }, [trafficJams, onMarkerClick]);

  function createPopupContent(jam: TrafficJam, weather?: WeatherData): string {
    return `
      <div class="p-2 max-w-xs">
        <h3 class="font-semibold text-sm">${jam.title}</h3>
        <p class="text-xs text-gray-600 mt-1">${jam.description || ""}</p>
        <div class="grid grid-cols-2 gap-1 mt-2">
          <span class="text-xs text-gray-500">Type: ${jam.jam_type}</span>
          <span class="text-xs text-gray-500">Severity: ${jam.severity}</span>
        </div>
        ${
          weather
            ? `
          <div class="mt-3 pt-3 border-t">
            <div class="flex items-center space-x-2">
              <img src="${
                weather.icon.startsWith("http")
                  ? weather.icon
                  : `https:${weather.icon}`
              }"
                   alt="${weather.conditions}" class="w-8 h-8">
              <div>
                <span class="text-sm font-medium">${weather.temp}°C</span>
                <span class="text-xs text-gray-500">(feels like ${weather.feelslike}°C)</span>
                <span class="text-xs block">${weather.conditions}</span>
                <span class="text-xs text-gray-500">Updated: ${formatTime(weather.lastUpdated)}</span>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div class="flex items-center">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                ${weather.windSpeed} km/h
              </div>
              <div class="flex items-center">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                </svg>
                ${weather.humidity}%
              </div>
            </div>
          </div>
        `
            : ""
        }
      </div>
    `;
  }

  function formatTime(timeString: string): string {
    return new Date(timeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  }

  return (
    <div
      ref={mapRef}
      className="w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg"
    />
  );
}

function getLeaflet(): typeof import("leaflet") | null {
  if (typeof window !== "undefined" && (window as any).L) {
    return (window as any).L;
  }
  return null;
}
