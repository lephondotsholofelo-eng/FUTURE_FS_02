import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/mysql'
import { getSession } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'
import type { Lead } from '@/lib/types'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const leads = await query<Lead[]>(
      'SELECT * FROM leads ORDER BY created_at DESC'
    )

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, email, phone, company, source, status } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const id = uuidv4()
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    await query(
      `INSERT INTO leads (id, name, email, phone, company, source, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, email, phone || null, company || null, source || 'website', status || 'new', now, now]
    )

    const leads = await query<Lead[]>(
      'SELECT * FROM leads WHERE id = ?',
      [id]
    )

    if (!leads || leads.length === 0) {
      return NextResponse.json(
        { error: 'Failed to retrieve created lead' },
        { status: 500 }
      )
    }

    return NextResponse.json(leads[0])
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
