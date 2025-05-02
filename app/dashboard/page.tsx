"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Map, MessageSquare, Bell, Activity } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type Alert = {
  id: string
  title: string
  type: string
  level: string
  region: string
  description: string
  createdAt: string
  status: string
}

type NewsArticle = {
  id: string
  title: string
  category: string
  region: string
  source: string
  content: string
  publishedAt: string
  urgent: boolean
}

export default function UserDashboard() {
  const { user } = useAuth()
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([])
  const [recentNews, setRecentNews] = useState<NewsArticle[]>([])
  const [earthquakeStats, setEarthquakeStats] = useState({
    total24h: 0,
    total7d: 0,
    highestMagnitude: 0,
    recentLocation: "",
  })

  useEffect(() => {
    // Load alerts from localStorage
    const storedAlerts = localStorage.getItem("adminAlertsList")
    if (storedAlerts) {
      const alerts = JSON.parse(storedAlerts)
      // Get only active alerts and sort by date (newest first)
      const activeAlerts = alerts
        .filter((alert: Alert) => alert.status === "active")
        .sort((a: Alert, b: Alert) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)

      setRecentAlerts(activeAlerts)
    }

    // Load news from localStorage
    const storedNews = localStorage.getItem("adminNewsList")
    if (storedNews) {
      const news = JSON.parse(storedNews)
      // Sort by date (newest first) and get the 3 most recent
      const recentNews = news
        .sort((a: NewsArticle, b: NewsArticle) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 3)

      setRecentNews(recentNews)
    }

    // Generate some earthquake stats
    setEarthquakeStats({
      total24h: Math.floor(Math.random() * 10) + 5,
      total7d: Math.floor(Math.random() * 30) + 20,
      highestMagnitude: (Math.random() * 2 + 5).toFixed(1),
      recentLocation: "Pacific Ocean Region",
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">Your personal disaster management dashboard</p>
      </div>

      {recentAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Active Alerts
            </CardTitle>
            <CardDescription className="text-red-600/80 dark:text-red-400/80">
              Critical alerts that require your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 rounded-lg border border-red-200 bg-white p-3 dark:bg-background dark:border-red-900/50"
                >
                  <div
                    className={`rounded-full p-2 ${
                      alert.level === "critical"
                        ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
                        : alert.level === "high"
                          ? "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400"
                          : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400"
                    }`}
                  >
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{alert.title}</h3>
                      <Badge
                        className={
                          alert.level === "critical"
                            ? "bg-red-500"
                            : alert.level === "high"
                              ? "bg-orange-500"
                              : "bg-yellow-500"
                        }
                      >
                        {alert.level}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{alert.region}</span>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/alerts/${alert.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/alerts">View All Alerts</Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Earthquakes (24h)</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earthquakeStats.total24h}</div>
            <p className="text-xs text-muted-foreground">Highest: {earthquakeStats.highestMagnitude} magnitude</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Earthquakes (7d)</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earthquakeStats.total7d}</div>
            <p className="text-xs text-muted-foreground">Most active: {earthquakeStats.recentLocation}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <CardDescription>Current warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {recentAlerts.length > 0 ? `${recentAlerts[0].level} priority` : "No active alerts"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Latest News</CardTitle>
            <CardDescription>Recent updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentNews.length}</div>
            <p className="text-xs text-muted-foreground">
              {recentNews.length > 0 ? `${recentNews.filter((n) => n.urgent).length} urgent` : "No recent news"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Earthquake Map</CardTitle>
            <CardDescription>View recent earthquake activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
              <Map className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/map">Open Map</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Latest News</CardTitle>
            <CardDescription>Stay updated with disaster news</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNews.length > 0 ? (
                recentNews.map((news) => (
                  <div key={news.id} className="border-l-2 border-primary pl-3 py-1">
                    <p className="font-medium text-sm">{news.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{news.source}</span>
                      {news.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-24 text-muted-foreground">
                  No recent news available
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/news">View News</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">AI Assistant</CardTitle>
            <CardDescription>Get guidance and information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-2 border-green-500 pl-3 py-1">
                <p className="font-medium text-sm">What should be in an emergency kit?</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-3 py-1">
                <p className="font-medium text-sm">How to prepare for an earthquake?</p>
              </div>
              <div className="border-l-2 border-amber-500 pl-3 py-1">
                <p className="font-medium text-sm">What to do during a flood?</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/chatbot">Ask AI</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Map className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Viewed earthquake map</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Received new alert notification</p>
                <p className="text-sm text-muted-foreground">Yesterday</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Asked AI about emergency preparedness</p>
                <p className="text-sm text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/activity">View All Activity</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
