import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/mysql'
import { getSession } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ noteId: string }>
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { noteId } = await params
    await query('DELETE FROM lead_notes WHERE id = ?', [noteId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    )
  }
}
