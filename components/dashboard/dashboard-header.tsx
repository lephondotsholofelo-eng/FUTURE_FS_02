"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, LogOut } from "lucide-react"

interface DashboardHeaderProps {
  userEmail: string
}

export function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const router = useRouter()

  async function handleSignOut() {
    await fetch('/api/auth/logout', {
      method: 'POST',
    })
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">LeadFlow CRM</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {userEmail}
          </span>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
