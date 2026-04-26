export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost"

export interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  source: string
  status: LeadStatus
  created_at: string
  updated_at: string
}

export interface LeadNote {
  id: string
  lead_id: string
  content: string
  created_at: string
  created_by: string | null
}

export const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bgColor: string }> = {
  new: { label: "New", color: "text-blue-700", bgColor: "bg-blue-100" },
  contacted: { label: "Contacted", color: "text-amber-700", bgColor: "bg-amber-100" },
  qualified: { label: "Qualified", color: "text-purple-700", bgColor: "bg-purple-100" },
  converted: { label: "Converted", color: "text-emerald-700", bgColor: "bg-emerald-100" },
  lost: { label: "Lost", color: "text-slate-500", bgColor: "bg-slate-100" },
}
