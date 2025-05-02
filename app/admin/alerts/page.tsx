"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, BellPlus, Trash, Edit, Eye, BellOff } from "lucide-react"
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

type Alert = {
  id: string
  title: string
  type: "earthquake" | "hurricane" | "flood" | "wildfire" | "other"
  level: "critical" | "high" | "moderate" | "low"
  region: string
  description: string
  createdAt: string
  status: "active" | "inactive"
}

export default function AlertsManagement() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddAlertOpen, setIsAddAlertOpen] = useState(false)
  const [newAlert, setNewAlert] = useState<Omit<Alert, "id" | "createdAt" | "status">>({
    title: "",
    type: "earthquake",
    level: "moderate",
    region: "",
    description: "",
  })

  useEffect(() => {
    // Load alerts from localStorage or initialize with dummy data
    const loadAlerts = () => {
      const storedAlerts = localStorage.getItem("adminAlertsList")

      if (storedAlerts) {
        setAlerts(JSON.parse(storedAlerts))
      } else {
        // Initialize with dummy data
        const initialAlerts: Alert[] = [
          {
            id: "alert-1",
            title: "Major Earthquake Warning",
            type: "earthquake",
            level: "critical",
            region: "Pacific Coast",
            description: "A 7.2 magnitude earthquake has been detected. Tsunami warning in effect.",
            createdAt: "2023-05-15T08:30:00",
            status: "active",
          },
          {
            id: "alert-2",
            title: "Hurricane Maria Approaching",
            type: "hurricane",
            level: "high",
            region: "East Coast",
            description: "Hurricane Maria is expected to make landfall within 24 hours. Evacuation recommended.",
            createdAt: "2023-05-14T14:20:00",
            status: "active",
          },
          {
            id: "alert-3",
            title: "Flash Flood Warning",
            type: "flood",
            level: "moderate",
            region: "Midwest",
            description: "Heavy rainfall causing flash floods in low-lying areas.",
            createdAt: "2023-05-13T18:45:00",
            status: "active",
          },
          {
            id: "alert-4",
            title: "Wildfire Alert",
            type: "wildfire",
            level: "high",
            region: "West Coast",
            description: "Multiple wildfires spreading rapidly due to dry conditions and strong winds.",
            createdAt: "2023-05-12T11:15:00",
            status: "inactive",
          },
        ]

        setAlerts(initialAlerts)
        localStorage.setItem("adminAlertsList", JSON.stringify(initialAlerts))
      }
    }

    loadAlerts()
  }, [])

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddAlert = () => {
    const newAlertData: Alert = {
      id: `alert-${Date.now()}`,
      ...newAlert,
      createdAt: new Date().toISOString(),
      status: "active",
    }

    const updatedAlerts = [...alerts, newAlertData]
    setAlerts(updatedAlerts)
    localStorage.setItem("adminAlertsList", JSON.stringify(updatedAlerts))

    // Reset form and close dialog
    setNewAlert({
      title: "",
      type: "earthquake",
      level: "moderate",
      region: "",
      description: "",
    })
    setIsAddAlertOpen(false)
  }

  const handleDeleteAlert = (alertId: string) => {
    const updatedAlerts = alerts.filter((alert) => alert.id !== alertId)
    setAlerts(updatedAlerts)
    localStorage.setItem("adminAlertsList", JSON.stringify(updatedAlerts))
  }

  const handleToggleStatus = (alertId: string) => {
    const updatedAlerts = alerts.map((alert) => {
      if (alert.id === alertId) {
        return {
          ...alert,
          status: alert.status === "active" ? "inactive" : "active",
        }
      }
      return alert
    })

    setAlerts(updatedAlerts)
    localStorage.setItem("adminAlertsList", JSON.stringify(updatedAlerts))
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "moderate":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alerts Management</h1>
          <p className="text-muted-foreground">Manage disaster alerts and notifications</p>
        </div>
        <Dialog open={isAddAlertOpen} onOpenChange={setIsAddAlertOpen}>
          <DialogTrigger asChild>
            <Button>
              <BellPlus className="mr-2 h-4 w-4" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
              <DialogDescription>Create a new disaster alert to notify users</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Alert Title</Label>
                <Input
                  id="title"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Alert Type</Label>
                  <Select
                    value={newAlert.type}
                    onValueChange={(value: any) => setNewAlert({ ...newAlert, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="earthquake">Earthquake</SelectItem>
                      <SelectItem value="hurricane">Hurricane</SelectItem>
                      <SelectItem value="flood">Flood</SelectItem>
                      <SelectItem value="wildfire">Wildfire</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Alert Level</Label>
                  <Select
                    value={newAlert.level}
                    onValueChange={(value: any) => setNewAlert({ ...newAlert, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={newAlert.region}
                  onChange={(e) => setNewAlert({ ...newAlert, region: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={newAlert.description}
                  onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddAlertOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAlert}>Create Alert</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disaster Alerts</CardTitle>
          <CardDescription>Manage and monitor active alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
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
                  <TableHead>Type</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No alerts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.title}</TableCell>
                      <TableCell className="capitalize">{alert.type}</TableCell>
                      <TableCell>
                        <Badge className={getLevelColor(alert.level)}>{alert.level}</Badge>
                      </TableCell>
                      <TableCell>{alert.region}</TableCell>
                      <TableCell>{new Date(alert.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={alert.status === "active" ? "success" : "secondary"}
                          className={alert.status === "active" ? "bg-green-500" : ""}
                        >
                          {alert.status}
                        </Badge>
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
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(alert.id)}>
                              {alert.status === "active" ? (
                                <>
                                  <BellOff className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <BellPlus className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteAlert(alert.id)}
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
