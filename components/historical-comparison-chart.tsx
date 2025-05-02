"use client"

import { useEffect, useRef, useState } from "react"

type HistoricalComparisonChartProps = {
  timeRange: string
  region: string
}

type ChartData = {
  magnitude: number
  current: number
  average: number
}

export default function HistoricalComparisonChart({ timeRange, region }: HistoricalComparisonChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate mock data based on time range and region
  useEffect(() => {
    setLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // Generate mock data
      const magnitudes = [3, 4, 5, 6, 7]
      const data: ChartData[] = magnitudes.map((magnitude) => {
        // Generate random values that make sense
        // More earthquakes at lower magnitudes
        const baseCurrent = Math.max(100 - magnitude * 15, 5) + Math.floor(Math.random() * 10)
        const baseAverage = Math.max(90 - magnitude * 15, 3) + Math.floor(Math.random() * 10)

        // Adjust based on region
        const regionMultiplier =
          region === "pacific"
            ? 1.5
            : region === "americas"
              ? 1.2
              : region === "asia"
                ? 1.3
                : region === "europe"
                  ? 0.7
                  : 1

        // Adjust based on time range
        const timeMultiplier = timeRange === "24h" ? 0.2 : timeRange === "7d" ? 1 : timeRange === "30d" ? 4 : 1

        return {
          magnitude,
          current: Math.floor(baseCurrent * regionMultiplier * timeMultiplier),
          average: Math.floor(baseAverage * timeMultiplier),
        }
      })

      setChartData(data)
      setLoading(false)
    }, 1000)
  }, [timeRange, region])

  // Draw the chart
  useEffect(() => {
    if (loading || !canvasRef.current || chartData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get canvas dimensions
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Set chart dimensions
    const chartWidth = width - 80
    const chartHeight = height - 80
    const barWidth = chartWidth / (chartData.length * 3) // 3 = 2 bars + space
    const maxValue = Math.max(...chartData.map((d) => Math.max(d.current, d.average))) * 1.2

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 1
    ctx.moveTo(50, 40)
    ctx.lineTo(50, height - 40)
    ctx.lineTo(width - 30, height - 40)
    ctx.stroke()

    // Draw y-axis labels
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#888"
    ctx.font = "12px sans-serif"

    for (let i = 0; i <= 5; i++) {
      const y = height - 40 - (i * chartHeight) / 5
      const value = Math.round((maxValue * i) / 5)
      ctx.fillText(value.toString(), 45, y)

      // Draw grid line
      ctx.beginPath()
      ctx.strokeStyle = "#eee"
      ctx.moveTo(50, y)
      ctx.lineTo(width - 30, y)
      ctx.stroke()
    }

    // Draw bars and x-axis labels
    chartData.forEach((data, i) => {
      const x = 50 + i * (barWidth * 3) + barWidth
      const y1 = height - 40 - (data.current / maxValue) * chartHeight
      const y2 = height - 40 - (data.average / maxValue) * chartHeight

      // Current period bar
      ctx.fillStyle = getMagnitudeColor(data.magnitude)
      ctx.fillRect(x, y1, barWidth, height - 40 - y1)

      // Historical average bar
      ctx.fillStyle = "#888"
      ctx.fillRect(x + barWidth, y2, barWidth, height - 40 - y2)

      // X-axis label
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillStyle = "#888"
      ctx.fillText(`${data.magnitude}.0+`, x + barWidth / 2, height - 35)
    })

    // Draw legend
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"

    // Current period
    ctx.fillStyle = "#f97316"
    ctx.fillRect(width - 120, 20, 15, 15)
    ctx.fillStyle = "#888"
    ctx.fillText("Current period", width - 100, 27)

    // Historical average
    ctx.fillStyle = "#888"
    ctx.fillRect(width - 120, 45, 15, 15)
    ctx.fillText("Historical avg", width - 100, 52)

    // Title
    ctx.textAlign = "center"
    ctx.font = "14px sans-serif"
    ctx.fillStyle = "#333"
    ctx.fillText("Earthquake Frequency by Magnitude", width / 2, 20)
  }, [chartData, loading])

  // Helper function to get color based on magnitude
  const getMagnitudeColor = (magnitude: number): string => {
    if (magnitude >= 7) return "#ef4444" // red
    if (magnitude >= 6) return "#f97316" // orange
    if (magnitude >= 5) return "#eab308" // yellow
    if (magnitude >= 4) return "#3b82f6" // blue
    return "#22c55e" // green
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading historical data...</p>
        </div>
      ) : (
        <canvas ref={canvasRef} width={800} height={300} className="w-full h-full" />
      )}
    </div>
  )
}
