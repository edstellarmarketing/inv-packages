import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { builtInCourses } from '@/data/courses'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const sql = getDb()
    let count = 0

    for (const c of builtInCourses) {
      await sql`
        insert into invpackages.courses (
          id, slug, title, eyebrow, subtitle, description, pass_rate,
          course_category, packages, exam_specs, is_custom
        ) values (
          ${c.id}, ${c.slug}, ${c.title}, ${c.eyebrow}, ${c.subtitle},
          ${c.description}, ${c.passRate}, ${c.courseCategory},
          ${JSON.stringify(c.packages ?? [])}::jsonb,
          ${c.examSpecs ? JSON.stringify(c.examSpecs) : null}::jsonb,
          false
        )
        on conflict (id) do nothing
      `
      count += 1
    }
    return NextResponse.json({ ok: true, count })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const sql = getDb()
    const rows = (await sql`select count(*)::int as n from invpackages.courses`) as unknown as { n: number }[]
    return NextResponse.json({ count: rows[0]?.n ?? 0, builtInCount: builtInCourses.length })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
