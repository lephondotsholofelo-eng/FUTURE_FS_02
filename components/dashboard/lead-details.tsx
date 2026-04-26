"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Mail, Phone, Building, Globe, Calendar } from "lucide-react"
import type { Lead, LeadStatus } from "@/lib/types"
import { STATUS_CONFIG } from "@/lib/types"

interface LeadDetailsProps {
  lead: Lead
}

export function LeadDetails({ lead: initialLead }: LeadDetailsProps) {
  const [lead, setLead] = useState(initialLead)
  const [updating, setUpdating] = useState(false)

  async function handleStatusChange(newStatus: LeadStatus) {
    setUpdating(true)
    
    const response = await fetch(`/api/leads/${lead.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })

    if (response.ok) {
      setLead({ ...lead, status: newStatus })
    }
    setUpdating(false)
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-2xl">{lead.name}</CardTitle>
              <CardDescription className="mt-1">
                Lead created on {formatDate(lead.created_at)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className={`${STATUS_CONFIG[lead.status].bgColor} ${STATUS_CONFIG[lead.status].color} border-0`}
              >
                {STATUS_CONFIG[lead.status].label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Contact Information
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                    {lead.email}
                  </a>
                </div>
                {lead.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${lead.phone}`} className="hover:underline">
                      {lead.phone}
                    </a>
                  </div>
                )}
                {lead.company && (
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.company}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Lead Information
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{lead.source}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Last updated: {formatDate(lead.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
              Update Status
            </h3>
            <Select
              value={lead.status}
              onValueChange={(value) => handleStatusChange(value as LeadStatus)}
              disabled={updating}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((status) => (
                  <SelectItem key={status} value={status}>
                    {STATUS_CONFIG[status].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
