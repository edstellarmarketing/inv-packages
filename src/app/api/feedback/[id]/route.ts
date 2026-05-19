import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const TABLE = 'invpackages_feedback'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = (await req.json()) as { message?: string }
    const message = body.message?.trim()

    if (!message) return NextResponse.json({ error: 'message is required' }, { status: 400 })
    if (message.length > 4000) {
      return NextResponse.json({ error: 'message is too long (max 4000 chars)' }, { status: 400 })
    }

    const sb = getServerSupabase()
    const { data, error } = await sb
      .from(TABLE)
      .update({ message })
      .eq('id', params.id)
      .select('id, course_id, name, message, created_at')
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json({ feedback: data })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sb = getServerSupabase()
    const { error } = await sb.from(TABLE).delete().eq('id', params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
