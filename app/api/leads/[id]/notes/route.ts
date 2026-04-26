import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/mysql'
import { getSession } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'
import type { LeadNote } from '@/lib/types'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const notes = await query<LeadNote[]>(
      'SELECT * FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC',
      [id]
    )

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: leadId } = await params
    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const noteId = uuidv4()
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    await query(
      `INSERT INTO lead_notes (id, lead_id, content, created_at, created_by) 
       VALUES (?, ?, ?, ?, ?)`,
      [noteId, leadId, content.trim(), now, session.user.id]
    )

    const [newNote] = await query<LeadNote[]>(
      'SELECT * FROM lead_notes WHERE id = ?',
      [noteId]
    )

    return NextResponse.json(newNote)
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
