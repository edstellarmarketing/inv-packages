import type { Course } from '@/types'

export interface CourseRow {
  id: string
  slug: string
  title: string
  eyebrow: string
  subtitle: string
  description: string
  pass_rate: string
  course_category: string
  packages: Course['packages']
  exam_specs: Course['examSpecs'] | null
  is_custom: boolean
}

export function rowToCourse(row: CourseRow): Course {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    eyebrow: row.eyebrow,
    subtitle: row.subtitle,
    description: row.description,
    passRate: row.pass_rate,
    courseCategory: row.course_category as Course['courseCategory'],
    packages: row.packages ?? [],
    examSpecs: row.exam_specs ?? undefined,
    isCustom: row.is_custom,
  }
}

export function courseToRow(c: Course): Omit<CourseRow, 'is_custom'> & { is_custom: boolean } {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    eyebrow: c.eyebrow,
    subtitle: c.subtitle,
    description: c.description,
    pass_rate: c.passRate,
    course_category: c.courseCategory,
    packages: c.packages,
    exam_specs: c.examSpecs ?? null,
    is_custom: c.isCustom ?? true,
  }
}
