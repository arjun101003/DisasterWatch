"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Clock, BarChart3, Info } from "lucide-react"
import Link from "next/link"
import EarthquakeDetails from "@/components/earthquake-details"

// Dynamically import the map component with no SSR
const EarthquakeMap = dynamic(() => import("@/components/earthquake-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
})

// Dynamically import the historical chart component with no SSR
const HistoricalComparisonChart = dynamic(() => import("@/components/historical-comparison-chart"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading chart...</p>
      </div>
    </div>
  ),
})

type Earthquake = {
  id: number
  location: string
  magnitude: number
  time: string
  depth: string
  lat: number
  lng: number
}

export default function MapPage() {
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null)
  const [timeRange, setTimeRange] = useState<string>("24h")
  const [magnitudeRange, setMagnitudeRange] = useState<number[]>([3.0, 9.0])
  const [region, setRegion] = useState<string>("all")

  const handleEarthquakeSelect = (earthquake: Earthquake) => {
    setSelectedEarthquake(earthquake)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Earthquake Tracking System</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Global Earthquake Map</CardTitle>
                <div className="flex gap-2">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[120px]">
                      <Clock className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="pacific">Pacific Ring</SelectItem>
                      <SelectItem value="americas">Americas</SelectItem>
                      <SelectItem value="europe">Europe & Africa</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>
                Showing earthquakes from{" "}
                {timeRange === "24h"
                  ? "the last 24 hours"
                  : timeRange === "7d"
                    ? "the last 7 days"
                    : "the last 30 days"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[500px] bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                <EarthquakeMap
                  onEarthquakeSelect={handleEarthquakeSelect}
                  timeRange={timeRange}
                  magnitudeRange={magnitudeRange}
                  region={region}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Historical Comparison
              </CardTitle>
              <CardDescription>Compare current seismic activity with historical patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                <HistoricalComparisonChart timeRange={timeRange} region={region} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Magnitude Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Min: {magnitudeRange[0].toFixed(1)}</span>
                    <span>Max: {magnitudeRange[1].toFixed(1)}</span>
                  </div>
                  <Slider defaultValue={magnitudeRange} min={0} max={10} step={0.1} onValueChange={setMagnitudeRange} />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Minor", value: [3.0, 3.9], color: "bg-green-100 text-green-800 border-green-200" },
                    { label: "Light", value: [4.0, 4.9], color: "bg-blue-100 text-blue-800 border-blue-200" },
                    { label: "Moderate", value: [5.0, 5.9], color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
                    { label: "Strong", value: [6.0, 6.9], color: "bg-orange-100 text-orange-800 border-orange-200" },
                    { label: "Major", value: [7.0, 7.9], color: "bg-red-100 text-red-800 border-red-200" },
                    { label: "Great", value: [8.0, 10.0], color: "bg-purple-100 text-purple-800 border-purple-200" },
                  ].map((category) => (
                    <Button
                      key={category.label}
                      variant="outline"
                      className={`text-xs h-auto py-1 ${category.color}`}
                      onClick={() => setMagnitudeRange(category.value as [number, number])}
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    location: "Pacific Ocean",
                    magnitude: 6.2,
                    time: "2023-05-15T08:32:00",
                    depth: "10km",
                    lat: 36.2048,
                    lng: 138.2529,
                  },
                  {
                    id: 2,
                    location: "Alaska",
                    magnitude: 4.7,
                    time: "2023-05-15T10:15:00",
                    depth: "15km",
                    lat: 61.2181,
                    lng: -149.9003,
                  },
                  {
                    id: 3,
                    location: "Japan",
                    magnitude: 5.5,
                    time: "2023-05-14T22:45:00",
                    depth: "20km",
                    lat: 35.6762,
                    lng: 139.6503,
                  },
                  {
                    id: 4,
                    location: "Chile",
                    magnitude: 4.9,
                    time: "2023-05-14T18:20:00",
                    depth: "12km",
                    lat: -33.4489,
                    lng: -70.6693,
                  },
                  {
                    id: 5,
                    location: "Indonesia",
                    magnitude: 5.1,
                    time: "2023-05-13T14:10:00",
                    depth: "18km",
                    lat: -6.2088,
                    lng: 106.8456,
                  },
                ].map((quake) => (
                  <div
                    key={quake.id}
                    className="flex items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={() => handleEarthquakeSelect(quake as Earthquake)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        quake.magnitude >= 6
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : quake.magnitude >= 5
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      }`}
                    >
                      <span className="font-bold">{quake.magnitude}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{quake.location}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{new Date(quake.time).toLocaleString()}</span>
                        <span className="mx-1">•</span>
                        <span>Depth: {quake.depth}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Recent Earthquakes
              </Button>
            </CardFooter>
          </Card>

          {selectedEarthquake && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Earthquake Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EarthquakeDetails earthquake={selectedEarthquake} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
