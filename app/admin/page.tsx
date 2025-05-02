"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Bell, Newspaper, AlertTriangle, TrendingUp, Activity } from "lucide-react"

interface DashboardStats {
  totalUsers: number
  totalAlerts: number
  totalNews: number
  activeAlerts: number
  recentActivity: {
    id: string
    type: string
    description: string
    time: string
  }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAlerts: 0,
    totalNews: 0,
    activeAlerts: 0,
    recentActivity: [],
  })

  useEffect(() => {
    // Load stats from localStorage or use defaults
    const loadStats = () => {
      const storedStats = localStorage.getItem("adminStats")

      if (storedStats) {
        setStats(JSON.parse(storedStats))
      } else {
        // Initialize with dummy data
        const initialStats: DashboardStats = {
          totalUsers: 24,
          totalAlerts: 15,
          totalNews: 42,
          activeAlerts: 3,
          recentActivity: [
            {
              id: "act-1",
              type: "alert",
              description: "New earthquake alert created",
              time: "10 minutes ago",
            },
            {
              id: "act-2",
              type: "user",
              description: "New user registered",
              time: "1 hour ago",
            },
            {
              id: "act-3",
              type: "news",
              description: "News article updated",
              time: "3 hours ago",
            },
            {
              id: "act-4",
              type: "alert",
              description: "Hurricane alert modified",
              time: "5 hours ago",
            },
          ],
        }

        setStats(initialStats)
        localStorage.setItem("adminStats", JSON.stringify(initialStats))
      }
    }

    loadStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of the DisasterWatch platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+2 since last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAlerts}</div>
            <p className="text-xs text-muted-foreground">+3 since last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total News</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNews}</div>
            <p className="text-xs text-muted-foreground">+5 since last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="mr-4 rounded-full bg-primary/10 p-2">
                    {activity.type === "alert" && <Bell className="h-4 w-4 text-primary" />}
                    {activity.type === "user" && <Users className="h-4 w-4 text-primary" />}
                    {activity.type === "news" && <Newspaper className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>System status and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">System Status</span>
                </div>
                <span className="text-sm text-green-500">Operational</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">User Growth</span>
                </div>
                <span className="text-sm text-green-500">+8% this month</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Alert Response Time</span>
                </div>
                <span className="text-sm">2.4 minutes avg.</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Active Users</span>
                </div>
                <span className="text-sm">18 online now</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
