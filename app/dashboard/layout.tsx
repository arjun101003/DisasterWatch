import type React from "react"
import type { Metadata } from "next"
import ProtectedRoute from "@/components/protected-route"
import UserDashboardHeader from "@/components/user-dashboard-header"

export const metadata: Metadata = {
  title: "User Dashboard | DisasterWatch",
  description: "User dashboard for DisasterWatch platform",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <UserDashboardHeader />
        <main className="container py-6">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
