import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { rowToCourse, type CourseRow } from '@/lib/supabase/mappers'
import type { Course } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const sql = getDb()
    const rows = (await sql`
      select id, slug, title, eyebrow, subtitle, description, pass_rate,
             course_category, packages, exam_specs, is_custom
        from invpackages.courses
        order by created_at asc, slug asc
    `) as unknown as CourseRow[]
    return NextResponse.json({ courses: rows.map(rowToCourse) })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Course
    if (!body?.id || !body?.slug || !body?.title) {
      return NextResponse.json({ error: 'id, slug and title are required' }, { status: 400 })
    }

    const sql = getDb()
    const isCustom = body.isCustom ?? true
    const examSpecs = body.examSpecs ?? null
    const packages = body.packages ?? []

    const rows = (await sql`
      insert into invpackages.courses (
        id, slug, title, eyebrow, subtitle, description, pass_rate,
        course_category, packages, exam_specs, is_custom
      ) values (
        ${body.id}, ${body.slug}, ${body.title}, ${body.eyebrow ?? ''},
        ${body.subtitle ?? ''}, ${body.description ?? ''}, ${body.passRate ?? ''},
        ${body.courseCategory},
        ${JSON.stringify(packages)}::jsonb,
        ${examSpecs ? JSON.stringify(examSpecs) : null}::jsonb,
        ${isCustom}
      )
      returning id, slug, title, eyebrow, subtitle, description, pass_rate,
                course_category, packages, exam_specs, is_custom
    `) as unknown as CourseRow[]

    return NextResponse.json({ course: rowToCourse(rows[0]) }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
