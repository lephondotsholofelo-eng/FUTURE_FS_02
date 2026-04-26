import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { query } from "@/lib/db/mysql"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { LeadDetails } from "@/components/dashboard/lead-details"
import { LeadNotes } from "@/components/dashboard/lead-notes"
import type { Lead, LeadNote } from "@/lib/types"

interface LeadDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  let lead: Lead | null = null
  let notes: LeadNote[] = []

  try {
    const leads = await query<Lead[]>(
      'SELECT * FROM leads WHERE id = ?',
      [id]
    )
    
    if (leads.length === 0) {
      notFound()
    }
    
    lead = leads[0]

    notes = await query<LeadNote[]>(
      'SELECT * FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC',
      [id]
    )
  } catch (error) {
    console.error("Error fetching lead:", error)
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader userEmail={session.user.email} />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <LeadDetails lead={lead} />
          <LeadNotes
            leadId={id}
            initialNotes={notes}
            userId={session.user.id}
          />
        </div>
      </main>
    </div>
  )
}
