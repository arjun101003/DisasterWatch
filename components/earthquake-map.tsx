"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "lucide-react"

type Earthquake = {
  id: number
  lat: number
  lng: number
  magnitude: number
  location: string
  time: string
  depth: string
}

type EarthquakeMapProps = {
  onEarthquakeSelect: (earthquake: Earthquake) => void
  timeRange: string
  magnitudeRange: number[]
  region: string
}

export default function EarthquakeMap({ onEarthquakeSelect, timeRange, magnitudeRange, region }: EarthquakeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([])
  const [leaflet, setLeaflet] = useState<any>(null)

  // Dynamically import Leaflet only on the client side
  useEffect(() => {
    import("leaflet").then((L) => {
      setLeaflet(L)
    })
  }, [])

  // Initialize map
  useEffect(() => {
    if (!leaflet || !mapRef.current || leafletMap.current) return

    // Initialize the map
    leafletMap.current = leaflet.map(mapRef.current).setView([20, 0], 2)

    // Add OpenStreetMap tiles
    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      })
      .addTo(leafletMap.current)

    // Clean up on unmount
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove()
        leafletMap.current = null
      }
    }
  }, [leaflet])

  // Load earthquake data and add markers
  useEffect(() => {
    if (!leaflet || !leafletMap.current) return

    // Simulate loading earthquake data
    setLoading(true)

    // This would be replaced with actual API call to USGS or similar service
    setTimeout(() => {
      // Mock earthquake data
      const mockEarthquakes: Earthquake[] = [
        {
          id: 1,
          lat: 36.2048,
          lng: 138.2529,
          magnitude: 6.2,
          location: "Japan",
          time: "2023-05-15T08:32:00",
          depth: "10km",
        },
        {
          id: 2,
          lat: 37.7749,
          lng: -122.4194,
          magnitude: 4.7,
          location: "San Francisco, USA",
          time: "2023-05-15T10:15:00",
          depth: "8km",
        },
        {
          id: 3,
          lat: -33.8688,
          lng: 151.2093,
          magnitude: 5.5,
          location: "Sydney, Australia",
          time: "2023-05-14T22:45:00",
          depth: "15km",
        },
        {
          id: 4,
          lat: 19.4326,
          lng: -99.1332,
          magnitude: 4.9,
          location: "Mexico City, Mexico",
          time: "2023-05-14T18:20:00",
          depth: "12km",
        },
        {
          id: 5,
          lat: -1.2921,
          lng: 36.8219,
          magnitude: 5.1,
          location: "Nairobi, Kenya",
          time: "2023-05-13T14:10:00",
          depth: "20km",
        },
        {
          id: 6,
          lat: 35.6762,
          lng: 139.6503,
          magnitude: 4.5,
          location: "Tokyo, Japan",
          time: "2023-05-12T09:30:00",
          depth: "12km",
        },
        {
          id: 7,
          lat: 51.5074,
          lng: -0.1278,
          magnitude: 3.8,
          location: "London, UK",
          time: "2023-05-11T16:45:00",
          depth: "5km",
        },
        {
          id: 8,
          lat: 40.7128,
          lng: -74.006,
          magnitude: 3.2,
          location: "New York, USA",
          time: "2023-05-10T11:20:00",
          depth: "7km",
        },
      ]

      // Filter based on magnitude range
      const filtered = mockEarthquakes.filter(
        (eq) => eq.magnitude >= magnitudeRange[0] && eq.magnitude <= magnitudeRange[1],
      )

      setEarthquakes(filtered)
      setLoading(false)

      // Add markers to the map
      if (leafletMap.current) {
        // Clear existing markers
        leafletMap.current.eachLayer((layer: any) => {
          if (layer instanceof leaflet.Marker || layer instanceof leaflet.CircleMarker) {
            leafletMap.current?.removeLayer(layer)
          }
        })

        // Add new markers
        filtered.forEach((eq) => {
          const markerSize = eq.magnitude * 5 // Scale marker size based on magnitude

          // Create a circle marker with color based on magnitude
          const color =
            eq.magnitude >= 6
              ? "#ef4444"
              : // red
                eq.magnitude >= 5
                ? "#f97316"
                : // orange
                  eq.magnitude >= 4
                  ? "#eab308"
                  : // yellow
                    "#3b82f6" // blue

          const marker = leaflet
            .circleMarker([eq.lat, eq.lng], {
              radius: markerSize,
              fillColor: color,
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8,
            })
            .addTo(leafletMap.current!)

          // Add popup with earthquake info
          marker.bindPopup(`
            <strong>${eq.location}</strong><br>
            Magnitude: ${eq.magnitude}<br>
            Depth: ${eq.depth}<br>
            Time: ${new Date(eq.time).toLocaleString()}
          `)

          // Add click handler
          marker.on("click", () => {
            onEarthquakeSelect(eq)
          })
        })
      }
    }, 1500)
  }, [timeRange, magnitudeRange, region, onEarthquakeSelect, leaflet])

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80">
          <div className="flex flex-col items-center">
            <Loader className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading earthquake data...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full z-0" />
    </div>
  )
}
