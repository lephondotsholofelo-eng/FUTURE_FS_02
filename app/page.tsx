import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Users className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-balance">LeadFlow CRM</CardTitle>
          <CardDescription>Manage your client leads, track follow-ups, and convert prospects efficiently</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Admin access required
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
