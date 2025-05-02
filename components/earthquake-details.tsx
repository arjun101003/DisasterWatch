"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, ArrowDown, AlertTriangle, Info, MapPin } from "lucide-react"

type Earthquake = {
  location: string
  magnitude: number
  time: string
  depth: string
  lat?: number
  lng?: number
}

type EarthquakeDetailsProps = {
  earthquake: Earthquake
}

export default function EarthquakeDetails({ earthquake }: EarthquakeDetailsProps) {
  if (!earthquake) return null

  const getMagnitudeColor = (magnitude: number): string => {
    if (magnitude >= 7)
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
    if (magnitude >= 6)
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800"
    if (magnitude >= 5)
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
    if (magnitude >= 4)
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
    return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
  }

  const getMagnitudeLabel = (magnitude: number): string => {
    if (magnitude >= 8) return "Great"
    if (magnitude >= 7) return "Major"
    if (magnitude >= 6) return "Strong"
    if (magnitude >= 5) return "Moderate"
    if (magnitude >= 4) return "Light"
    return "Minor"
  }

  // Format time string to a readable format
  const formatTime = (timeString: string): string => {
    try {
      return new Date(timeString).toLocaleString()
    } catch (e) {
      return timeString
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${getMagnitudeColor(earthquake.magnitude)}`}
        >
          <span className="font-bold">{earthquake.magnitude}</span>
        </div>
        <div>
          <h3 className="font-medium">{earthquake.location}</h3>
          <Badge variant="outline" className={getMagnitudeColor(earthquake.magnitude)}>
            {getMagnitudeLabel(earthquake.magnitude)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{formatTime(earthquake.time)}</span>
        </div>
        <div className="flex items-center">
          <ArrowDown className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">Depth: {earthquake.depth}</span>
        </div>
        {earthquake.lat && earthquake.lng && (
          <div className="flex items-center col-span-2">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">
              Coordinates: {earthquake.lat.toFixed(4)}, {earthquake.lng.toFixed(4)}
            </span>
          </div>
        )}
      </div>

      <div className="pt-2 border-t">
        <h4 className="font-medium mb-2 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
          Potential Impact
        </h4>
        <p className="text-sm text-muted-foreground">
          {earthquake.magnitude >= 7
            ? "Major damage expected in populated areas. Tsunami risk if underwater."
            : earthquake.magnitude >= 6
              ? "Moderate to severe damage possible in populated areas."
              : earthquake.magnitude >= 5
                ? "Light to moderate damage possible in populated areas."
                : "Minor shaking, minimal damage expected."}
        </p>
      </div>

      <div className="pt-2 border-t">
        <h4 className="font-medium mb-2 flex items-center">
          <Info className="h-4 w-4 mr-2 text-blue-500" />
          Safety Recommendations
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Drop, cover, and hold on during shaking</li>
          <li>• Stay away from windows and exterior walls</li>
          <li>• If near the coast, move to higher ground</li>
          <li>• Check for injuries and damage after shaking stops</li>
        </ul>
      </div>
    </div>
  )
}
