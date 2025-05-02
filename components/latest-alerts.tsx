import type React from "react"
import { AlertTriangle, CloudRain, Wind } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

type AlertItem = {
  id: number
  type: string
  level: "critical" | "high" | "moderate"
  title: string
  description: string
  time: string
  icon: React.ReactNode
}

export default function LatestAlerts() {
  const alerts: AlertItem[] = [
    {
      id: 1,
      type: "Severe Weather",
      level: "critical",
      title: "Hurricane Warning",
      description: "Hurricane Maria approaching eastern coastline. Expected landfall in 24 hours.",
      time: "10 minutes ago",
      icon: <Wind className="h-4 w-4" />,
    },
    {
      id: 2,
      type: "Earthquake",
      level: "high",
      title: "6.5 Magnitude Earthquake",
      description: "Strong earthquake detected in the Pacific region. Tsunami warning issued.",
      time: "1 hour ago",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: 3,
      type: "Flood",
      level: "moderate",
      title: "Flash Flood Warning",
      description: "Heavy rainfall causing flash floods in southwestern regions. Avoid low-lying areas.",
      time: "3 hours ago",
      icon: <CloudRain className="h-4 w-4" />,
    },
  ]

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={alert.level === "critical" ? "destructive" : alert.level === "high" ? "default" : "outline"}
          className="border-l-4 border-l-red-500"
        >
          <div className="flex items-start">
            {alert.icon}
            <div className="ml-2 flex-1">
              <div className="flex items-center justify-between">
                <AlertTitle className="flex items-center gap-2">
                  {alert.title}
                  <Badge
                    variant={
                      alert.level === "critical" ? "destructive" : alert.level === "high" ? "default" : "outline"
                    }
                  >
                    {alert.type}
                  </Badge>
                </AlertTitle>
                <span className="text-xs text-muted-foreground">{alert.time}</span>
              </div>
              <AlertDescription className="mt-1">{alert.description}</AlertDescription>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  )
}
