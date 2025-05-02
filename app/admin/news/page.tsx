"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, FileText, Trash, Edit, Eye, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type NewsArticle = {
  id: string
  title: string
  category: "earthquakes" | "floods" | "hurricanes" | "wildfires" | "cyclones" | "general"
  region: string
  country: string
  source: string
  content: string
  publishedAt: string
  urgent: boolean
}

export default function NewsManagement() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false)
  const [newArticle, setNewArticle] = useState<Omit<NewsArticle, "id" | "publishedAt">>({
    title: "",
    category: "general",
    region: "",
    country: "",
    source: "",
    content: "",
    urgent: false,
  })

  useEffect(() => {
    // Load news from localStorage or initialize with dummy data
    const loadNews = () => {
      const storedNews = localStorage.getItem("adminNewsList")

      if (storedNews) {
        setNewsArticles(JSON.parse(storedNews))
      } else {
        // Initialize with dummy data
        const initialNews: NewsArticle[] = [
          {
            id: "news-1",
            title: "Major Earthquake Strikes Pacific Region",
            category: "earthquakes",
            region: "Pacific",
            country: "Japan",
            source: "Global Disaster Network",
            content:
              "A 7.2 magnitude earthquake has struck the Pacific region, triggering tsunami warnings across several countries.",
            publishedAt: "2023-05-15T08:30:00",
            urgent: true,
          },
          {
            id: "news-2",
            title: "Hurricane Maria Intensifies to Category 4",
            category: "hurricanes",
            region: "Atlantic",
            country: "USA",
            source: "Weather Alert System",
            content:
              "Hurricane Maria has intensified to a Category 4 storm and is expected to make landfall within 24 hours.",
            publishedAt: "2023-05-14T14:20:00",
            urgent: true,
          },
          {
            id: "news-3",
            title: "Wildfires Spread Across California",
            category: "wildfires",
            region: "West Coast",
            country: "USA",
            source: "Emergency Response Network",
            content:
              "Multiple wildfires are spreading rapidly across Northern California due to dry conditions and strong winds.",
            publishedAt: "2023-05-13T18:45:00",
            urgent: false,
          },
          {
            id: "news-4",
            title: "Severe Flooding in Southeast Asia",
            category: "floods",
            region: "Asia",
            country: "India",
            source: "International Aid Organization",
            content:
              "Monsoon rains have caused severe flooding in multiple countries across Southeast Asia, displacing thousands.",
            publishedAt: "2023-05-12T11:15:00",
            urgent: false,
          },
          {
            id: "news-5",
            title: "Cyclone Tauktae Hits Western India",
            category: "cyclones",
            region: "Asia",
            country: "India",
            source: "Indian Meteorological Department",
            content:
              "Cyclone Tauktae has made landfall in Gujarat with wind speeds of up to 160 km/h, causing widespread damage and flooding.",
            publishedAt: "2023-05-11T09:30:00",
            urgent: true,
          },
          {
            id: "news-6",
            title: "Flash Floods in Maharashtra Displace Thousands",
            category: "floods",
            region: "Asia",
            country: "India",
            source: "National Disaster Response Force",
            content:
              "Heavy monsoon rains have triggered flash floods in Maharashtra, India, forcing thousands to evacuate their homes.",
            publishedAt: "2023-05-10T16:45:00",
            urgent: true,
          },
        ]

        setNewsArticles(initialNews)
        localStorage.setItem("adminNewsList", JSON.stringify(initialNews))
      }
    }

    loadNews()
  }, [])

  const filteredNews = newsArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddNews = () => {
    const newArticleData: NewsArticle = {
      id: `news-${Date.now()}`,
      ...newArticle,
      publishedAt: new Date().toISOString(),
    }

    const updatedNews = [...newsArticles, newArticleData]
    setNewsArticles(updatedNews)
    localStorage.setItem("adminNewsList", JSON.stringify(updatedNews))

    // Reset form and close dialog
    setNewArticle({
      title: "",
      category: "general",
      region: "",
      country: "",
      source: "",
      content: "",
      urgent: false,
    })
    setIsAddNewsOpen(false)
  }

  const handleDeleteNews = (newsId: string) => {
    const updatedNews = newsArticles.filter((article) => article.id !== newsId)
    setNewsArticles(updatedNews)
    localStorage.setItem("adminNewsList", JSON.stringify(updatedNews))
  }

  const handleToggleUrgent = (newsId: string) => {
    const updatedNews = newsArticles.map((article) => {
      if (article.id === newsId) {
        return {
          ...article,
          urgent: !article.urgent,
        }
      }
      return article
    })

    setNewsArticles(updatedNews)
    localStorage.setItem("adminNewsList", JSON.stringify(updatedNews))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">News Management</h1>
          <p className="text-muted-foreground">Manage disaster news articles</p>
        </div>
        <Dialog open={isAddNewsOpen} onOpenChange={setIsAddNewsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add News Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add News Article</DialogTitle>
              <DialogDescription>Create a new disaster news article</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title</Label>
                <Input
                  id="title"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newArticle.category}
                    onValueChange={(value: any) => setNewArticle({ ...newArticle, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="earthquakes">Earthquakes</SelectItem>
                      <SelectItem value="hurricanes">Hurricanes</SelectItem>
                      <SelectItem value="floods">Floods</SelectItem>
                      <SelectItem value="wildfires">Wildfires</SelectItem>
                      <SelectItem value="cyclones">Cyclones</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={newArticle.region}
                    onChange={(e) => setNewArticle({ ...newArticle, region: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={newArticle.country}
                  onChange={(e) => setNewArticle({ ...newArticle, country: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={newArticle.source}
                  onChange={(e) => setNewArticle({ ...newArticle, source: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  rows={4}
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={newArticle.urgent}
                  onChange={(e) => setNewArticle({ ...newArticle, urgent: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="urgent">Mark as Urgent</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddNewsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNews}>Publish Article</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>News Articles</CardTitle>
          <CardDescription>Manage disaster news content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No news articles found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNews.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell className="capitalize">{article.category}</TableCell>
                      <TableCell>{article.region}</TableCell>
                      <TableCell>{article.country || "Global"}</TableCell>
                      <TableCell>{new Date(article.publishedAt).toLocaleString()}</TableCell>
                      <TableCell>
                        {article.urgent ? (
                          <Badge variant="destructive">Urgent</Badge>
                        ) : (
                          <Badge variant="outline">Standard</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleUrgent(article.id)}>
                              <FileText className="mr-2 h-4 w-4" />
                              {article.urgent ? "Remove Urgent" : "Mark Urgent"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteNews(article.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
