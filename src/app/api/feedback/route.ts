import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const TABLE = 'invpackages_feedback'

export async function GET(req: NextRequest) {
  try {
    const courseId = req.nextUrl.searchParams.get('courseId')
    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
    }

    const sb = getServerSupabase()
    const { data, error } = await sb
      .from(TABLE)
      .select('id, course_id, name, message, created_at')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ feedback: data ?? [] })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { courseId?: string; name?: string; message?: string }
    const courseId = body.courseId?.trim()
    const name = body.name?.trim()
    const message = body.message?.trim()

    if (!courseId) return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
    if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })
    if (!message) return NextResponse.json({ error: 'message is required' }, { status: 400 })
    if (message.length > 4000) {
      return NextResponse.json({ error: 'message is too long (max 4000 chars)' }, { status: 400 })
    }

    const sb = getServerSupabase()
    const { data, error } = await sb
      .from(TABLE)
      .insert({ course_id: courseId, name, message })
      .select('id, course_id, name, message, created_at')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ feedback: data }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
