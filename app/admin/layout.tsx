import type React from "react"
import type { Metadata } from "next"
import ProtectedRoute from "@/components/protected-route"
import DashboardSidebar from "@/components/admin/dashboard-sidebar"

export const metadata: Metadata = {
  title: "Admin Dashboard | DisasterWatch",
  description: "Admin dashboard for DisasterWatch platform",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute adminOnly>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 md:ml-64">
          <main className="container py-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
