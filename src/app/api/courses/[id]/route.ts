import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { rowToCourse, type CourseRow } from '@/lib/supabase/mappers'
import type { Course } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = getDb()
    const rows = (await sql`
      select id, slug, title, eyebrow, subtitle, description, pass_rate,
             course_category, packages, exam_specs, is_custom
        from invpackages.courses where id = ${params.id} limit 1
    `) as unknown as CourseRow[]
    if (!rows.length) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json({ course: rowToCourse(rows[0]) })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = (await req.json()) as Course
    const sql = getDb()

    const packages = body.packages ?? []
    const examSpecs = body.examSpecs ?? null

    const rows = (await sql`
      update invpackages.courses set
        slug            = ${body.slug},
        title           = ${body.title},
        eyebrow         = ${body.eyebrow ?? ''},
        subtitle        = ${body.subtitle ?? ''},
        description     = ${body.description ?? ''},
        pass_rate       = ${body.passRate ?? ''},
        course_category = ${body.courseCategory},
        packages        = ${JSON.stringify(packages)}::jsonb,
        exam_specs      = ${examSpecs ? JSON.stringify(examSpecs) : null}::jsonb
      where id = ${params.id}
      returning id, slug, title, eyebrow, subtitle, description, pass_rate,
                course_category, packages, exam_specs, is_custom
    `) as unknown as CourseRow[]

    if (!rows.length) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json({ course: rowToCourse(rows[0]) })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = getDb()
    await sql`delete from invpackages.courses where id = ${params.id}`
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
