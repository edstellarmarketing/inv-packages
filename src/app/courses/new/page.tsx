'use client'

import { useRouter } from 'next/navigation'
import { useCustomCourses } from '@/hooks/useCustomCourses'
import CourseForm, { makeId, slugify } from '@/components/CourseForm'
import type { Course } from '@/types'

export default function NewCoursePage() {
  const router = useRouter()
  const { addCourse } = useCustomCourses()

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-ink3 mb-2">New Course</p>
      <h1 className="font-display text-4xl font-semibold text-ink mb-8">Create a Course Package</h1>

      <CourseForm
        submitLabel="Create Course"
        onCancel={() => router.back()}
        onSubmit={async (draft) => {
          const slug = slugify(draft.title) || makeId()
          const course: Course = {
            id: makeId(),
            slug,
            title: draft.title,
            eyebrow: draft.eyebrow || 'Custom Course',
            subtitle: draft.subtitle,
            description: '',
            passRate: draft.passRate,
            courseCategory: 'Project Management',
            packages: draft.packages,
            isCustom: true,
          }
          await addCourse(course)
          router.push(`/courses/${slug}`)
        }}
      />
    </div>
  )
}
