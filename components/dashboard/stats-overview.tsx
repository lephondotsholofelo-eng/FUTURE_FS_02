import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, UserCheck, TrendingUp } from "lucide-react"
import type { Lead } from "@/lib/types"

interface StatsOverviewProps {
  leads: Lead[]
}

export function StatsOverview({ leads }: StatsOverviewProps) {
  const totalLeads = leads.length
  const newLeads = leads.filter((l) => l.status === "new").length
  const qualifiedLeads = leads.filter((l) => l.status === "qualified").length
  const convertedLeads = leads.filter((l) => l.status === "converted").length

  const conversionRate = totalLeads > 0 
    ? Math.round((convertedLeads / totalLeads) * 100) 
    : 0

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: Users,
      description: "All time leads",
    },
    {
      title: "New Leads",
      value: newLeads,
      icon: UserPlus,
      description: "Awaiting contact",
    },
    {
      title: "Qualified",
      value: qualifiedLeads,
      icon: UserCheck,
      description: "Ready to convert",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      description: "Leads converted",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
