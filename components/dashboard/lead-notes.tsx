"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Trash2, MessageSquare } from "lucide-react"
import type { LeadNote } from "@/lib/types"

interface LeadNotesProps {
  leadId: string
  initialNotes: LeadNote[]
  userId: string
}

export function LeadNotes({ leadId, initialNotes, userId }: LeadNotesProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [newNote, setNewNote] = useState("")
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault()
    if (!newNote.trim()) return

    setAdding(true)
    
    const response = await fetch(`/api/leads/${leadId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newNote.trim() }),
    })

    if (response.ok) {
      const data = await response.json()
      setNotes([data, ...notes])
      setNewNote("")
    }
    setAdding(false)
  }

  async function handleDeleteNote(noteId: string) {
    setDeletingId(noteId)
    
    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
    })
    
    if (response.ok) {
      setNotes(notes.filter((n) => n.id !== noteId))
    }
    setDeletingId(null)
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Follow-up Notes
        </CardTitle>
        <CardDescription>
          Add notes about your interactions with this lead
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddNote} className="mb-6">
          <Textarea
            placeholder="Add a note about this lead..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            className="mb-3"
          />
          <Button type="submit" disabled={adding || !newNote.trim()}>
            {adding ? <Spinner className="mr-2" /> : null}
            {adding ? "Adding..." : "Add Note"}
          </Button>
        </form>

        <div className="flex flex-col gap-4">
          {notes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No notes yet. Add your first note above.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="flex gap-4 p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDate(note.created_at)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteNote(note.id)}
                  disabled={deletingId === note.id}
                >
                  {deletingId === note.id ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="sr-only">Delete note</span>
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
