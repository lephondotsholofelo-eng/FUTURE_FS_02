import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { query } from "@/lib/db/mysql"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { LeadsTable } from "@/components/dashboard/leads-table"
import type { Lead } from "@/lib/types"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  let leadsData: Lead[] = []
  
  try {
    leadsData = await query<Lead[]>(
      'SELECT * FROM leads ORDER BY created_at DESC'
    )
  } catch (error) {
    console.error("Error fetching leads:", error)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader userEmail={session.user.email} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <StatsOverview leads={leadsData} />
          <LeadsTable initialLeads={leadsData} />
        </div>
      </main>
    </div>
  )
}
