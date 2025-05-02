import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Globe, MapPin, Bell, Flag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type NewsItem = {
  id: number
  title: string
  description: string
  category: string
  region: string
  country: string
  date: string
  source: string
  image: string
  urgent: boolean
}

type NewsCategory = {
  id: string
  label: string
}

type Region = {
  id: string
  label: string
  icon: React.ReactNode
}

type Country = {
  id: string
  label: string
  region: string
}

export default function NewsPage() {
  const newsCategories: NewsCategory[] = [
    { id: "all", label: "All News" },
    { id: "earthquakes", label: "Earthquakes" },
    { id: "floods", label: "Floods" },
    { id: "hurricanes", label: "Hurricanes" },
    { id: "wildfires", label: "Wildfires" },
    { id: "cyclones", label: "Cyclones" },
  ]

  const regions: Region[] = [
    { id: "global", label: "Global", icon: <Globe className="h-4 w-4" /> },
    { id: "north-america", label: "North America", icon: <MapPin className="h-4 w-4" /> },
    { id: "europe", label: "Europe", icon: <MapPin className="h-4 w-4" /> },
    { id: "asia", label: "Asia", icon: <MapPin className="h-4 w-4" /> },
    { id: "africa", label: "Africa", icon: <MapPin className="h-4 w-4" /> },
    { id: "oceania", label: "Oceania", icon: <MapPin className="h-4 w-4" /> },
  ]

  const countries: Country[] = [
    { id: "global", label: "All Countries", region: "global" },
    { id: "india", label: "India", region: "asia" },
    { id: "usa", label: "United States", region: "north-america" },
    { id: "japan", label: "Japan", region: "asia" },
    { id: "italy", label: "Italy", region: "europe" },
    { id: "australia", label: "Australia", region: "oceania" },
    { id: "brazil", label: "Brazil", region: "south-america" },
    { id: "kenya", label: "Kenya", region: "africa" },
  ]

  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "Major Earthquake Strikes Pacific Region",
      description:
        "A 7.2 magnitude earthquake has struck the Pacific region, triggering tsunami warnings across several countries.",
      category: "earthquakes",
      region: "asia",
      country: "japan",
      date: "2 hours ago",
      source: "Global Disaster Network",
      image: "/images/earthquake.png",
      urgent: true,
    },
    {
      id: 2,
      title: "Hurricane Maria Intensifies to Category 4",
      description:
        "Hurricane Maria has intensified to a Category 4 storm and is expected to make landfall within 24 hours.",
      category: "hurricanes",
      region: "north-america",
      country: "usa",
      date: "5 hours ago",
      source: "Weather Alert System",
      image: "/images/hurricane.png",
      urgent: true,
    },
    {
      id: 3,
      title: "Wildfires Spread Across California",
      description:
        "Multiple wildfires are spreading rapidly across Northern California due to dry conditions and strong winds.",
      category: "wildfires",
      region: "north-america",
      country: "usa",
      date: "1 day ago",
      source: "Emergency Response Network",
      image: "/images/wildfire.png",
      urgent: false,
    },
    {
      id: 4,
      title: "Severe Flooding in Southeast Asia",
      description:
        "Monsoon rains have caused severe flooding in multiple countries across Southeast Asia, displacing thousands.",
      category: "floods",
      region: "asia",
      country: "india",
      date: "2 days ago",
      source: "International Aid Organization",
      image: "/images/flood.png",
      urgent: false,
    },
    {
      id: 5,
      title: "Volcanic Activity Increases in Iceland",
      description:
        "Scientists report increased volcanic activity in Iceland, raising concerns about potential eruptions.",
      category: "earthquakes",
      region: "europe",
      country: "italy",
      date: "3 days ago",
      source: "Geological Survey",
      image: "/images/earthquake.png",
      urgent: false,
    },
    {
      id: 6,
      title: "Cyclone Tauktae Hits Western India",
      description:
        "Cyclone Tauktae has made landfall in Gujarat with wind speeds of up to 160 km/h, causing widespread damage and flooding.",
      category: "cyclones",
      region: "asia",
      country: "india",
      date: "1 day ago",
      source: "Indian Meteorological Department",
      image: "/images/cyclone.png",
      urgent: true,
    },
    {
      id: 7,
      title: "Flash Floods in Maharashtra Displace Thousands",
      description:
        "Heavy monsoon rains have triggered flash floods in Maharashtra, India, forcing thousands to evacuate their homes.",
      category: "floods",
      region: "asia",
      country: "india",
      date: "3 days ago",
      source: "National Disaster Response Force",
      image: "/images/flood.png",
      urgent: true,
    },
    {
      id: 8,
      title: "Earthquake in Uttarakhand Measures 4.5 on Richter Scale",
      description:
        "A moderate earthquake of magnitude 4.5 struck Uttarakhand, India, with tremors felt across neighboring regions.",
      category: "earthquakes",
      region: "asia",
      country: "india",
      date: "4 days ago",
      source: "National Centre for Seismology",
      image: "/images/earthquake.png",
      urgent: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Disaster News Portal</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-3/4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search news..." className="pl-10" />
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="w-full md:w-auto overflow-auto">
              {newsCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {newsCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                <div className="grid grid-cols-1 gap-6">
                  {newsItems
                    .filter((item) => category.id === "all" || item.category === category.id)
                    .map((news) => (
                      <Card key={news.id} className={`overflow-hidden ${news.urgent ? "border-red-500 border-2" : ""}`}>
                        <div className="md:flex">
                          <div className="md:w-1/3 h-48 md:h-auto bg-muted relative">
                            <Image
                              src={news.image || "/placeholder.svg"}
                              alt={news.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                          <div className="md:w-2/3">
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-xl">{news.title}</CardTitle>
                                  <CardDescription className="flex items-center gap-2 mt-1">
                                    <span>{news.source}</span>
                                    <span>•</span>
                                    <span>{news.date}</span>
                                  </CardDescription>
                                </div>
                                {news.urgent && <Badge variant="destructive">URGENT</Badge>}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p>{news.description}</p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <div className="flex gap-2">
                                <Badge variant="outline">
                                  {newsCategories.find((c) => c.id === news.category)?.label}
                                </Badge>
                                <Badge variant="secondary">{countries.find((c) => c.id === news.country)?.label}</Badge>
                              </div>
                              <Button size="sm">Read More</Button>
                            </CardFooter>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="w-full md:w-1/4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter by Region
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {regions.map((region) => (
                  <Button key={region.id} variant="outline" className="w-full justify-start">
                    <div className="flex items-center gap-2">
                      {region.icon}
                      <span>{region.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Filter by Country
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {countries.map((country) => (
                  <Button key={country.id} variant="outline" className="w-full justify-start">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{country.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <Bell className="h-4 w-4" />
                Breaking Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-red-500 pl-3 py-1">
                  <p className="font-medium">Tsunami Warning</p>
                  <p className="text-sm text-muted-foreground">Pacific Coast - 30 minutes ago</p>
                </div>
                <div className="border-l-2 border-amber-500 pl-3 py-1">
                  <p className="font-medium">Cyclone Alert for Gujarat Coast</p>
                  <p className="text-sm text-muted-foreground">Western India - 1 hour ago</p>
                </div>
                <div className="border-l-2 border-amber-500 pl-3 py-1">
                  <p className="font-medium">Tornado Watch</p>
                  <p className="text-sm text-muted-foreground">Midwest Region - 2 hours ago</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Alerts
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
