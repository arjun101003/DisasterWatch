import Link from "next/link"
import { AlertTriangle, Globe, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import LatestAlerts from "@/components/latest-alerts"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-bold">DisasterWatch</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </header>

      <section className="mb-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-8 text-white">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Stay Informed, Stay Safe</h2>
          <p className="text-lg mb-6">
            Real-time disaster tracking, news, and AI-powered guidance to help you prepare for and respond to
            emergencies.
          </p>
          <div className="flex gap-4">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/news">Latest News</Link>
            </Button>
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white" size="lg" asChild>
              <Link href="/map">View Earthquake Map</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Breaking Alerts</h2>
        <LatestAlerts />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Main Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Globe className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>News Portal</CardTitle>
              <CardDescription>Stay updated with the latest disaster news worldwide</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Global disaster news feed</li>
                <li>Region-specific disaster news</li>
                <li>Breaking alerts system</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/news">View News</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
              <CardTitle>Earthquake Tracking</CardTitle>
              <CardDescription>Monitor seismic activity around the world</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Live Richter scale readings</li>
                <li>Interactive global map</li>
                <li>Historical earthquake data</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/map">Open Map</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>AI Disaster Chatbot</CardTitle>
              <CardDescription>Get guidance and information instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Survival information and tips</li>
                <li>Disaster preparedness guidance</li>
                <li>Emergency response protocols</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/chatbot">Ask Chatbot</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recent Earthquakes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { location: "Pacific Ocean, 200km SW of Tokyo", magnitude: 5.8, time: "2 hours ago", level: "moderate" },
            { location: "Northern California, USA", magnitude: 4.2, time: "5 hours ago", level: "light" },
            { location: "Central Mexico", magnitude: 6.3, time: "1 day ago", level: "strong" },
          ].map((quake, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{quake.location}</CardTitle>
                  <Badge
                    variant={
                      quake.level === "strong" ? "destructive" : quake.level === "moderate" ? "default" : "outline"
                    }
                  >
                    {quake.magnitude} M
                  </Badge>
                </div>
                <CardDescription>{quake.time}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button variant="ghost" size="sm" className="ml-auto" asChild>
                  <Link href={`/earthquake/${index}`}>Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline" asChild>
            <Link href="/map">View All Earthquakes</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
