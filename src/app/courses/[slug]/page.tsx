'use client'

import { useParams, notFound } from 'next/navigation'
import { useCustomCourses } from '@/hooks/useCustomCourses'
import PackageGrid from '@/components/PackageGrid'
import Link from 'next/link'

export default function CoursePage() {
  const params = useParams()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const { getCourse, deleteCourse, allCourses } = useCustomCourses()

  const course = getCourse(slug)

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-ink2 text-lg">Course not found.</p>
        <Link href="/courses/pmp" className="text-sm text-ink3 hover:text-ink underline">
          Go to PMP
        </Link>
      </div>
    )
  }

  return (
    <div className="px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-ink3 mb-2">
          {course.eyebrow}
        </p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-semibold text-ink mb-2">{course.title}</h1>
            <p className="text-ink2 text-base max-w-2xl">{course.subtitle}</p>
          </div>
          {course.isCustom && (
            <button
              onClick={() => {
                if (confirm(`Delete "${course.title}"? This cannot be undone.`)) {
                  deleteCourse(course.id)
                  window.location.href = '/courses/pmp'
                }
              }}
              className="shrink-0 text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              Delete course
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6 mt-5">
          {course.passRate && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-ink3">Pass rate</p>
              <p className="font-display text-2xl font-semibold text-ink">{course.passRate}</p>
            </div>
          )}
          {course.examSpecs?.map((spec) => (
            <div key={spec.label}>
              <p className="text-[10px] font-mono uppercase tracking-widest text-ink3">{spec.label}</p>
              <p className="text-sm font-medium text-ink mt-0.5">{spec.value}</p>
            </div>
          ))}
        </div>

        {course.description && (
          <p className="mt-4 text-sm text-ink2 max-w-2xl leading-relaxed">{course.description}</p>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-xs text-ink3 font-mono uppercase tracking-widest">Category tags:</span>
        <span className="cat-info text-xs font-mono font-semibold uppercase tracking-widest px-2 py-0.5 rounded">Info</span>
        <span className="cat-static text-xs font-mono font-semibold uppercase tracking-widest px-2 py-0.5 rounded">Static</span>
        <span className="cat-ai text-xs font-mono font-semibold uppercase tracking-widest px-2 py-0.5 rounded">AI</span>
        <Link href="/rules" className="text-xs text-ink3 hover:text-ink underline ml-2">
          See definitions →
        </Link>
      </div>

      {/* Packages */}
      {course.packages.length > 0 ? (
        <PackageGrid packages={course.packages} />
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-border bg-paper/40 px-10 py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ink3 mb-2">Coming soon</p>
          <p className="font-display text-2xl font-semibold text-ink mb-3">Packages not yet created</p>
          <p className="text-sm text-ink2 max-w-md mx-auto">
            This course is on the roadmap. Use the Rules page to plan the feature set before building the Bronze, Silver, and Gold packages.
          </p>
          <Link
            href="/rules"
            className="inline-block mt-6 text-sm font-medium text-ink border border-border rounded-lg px-4 py-2 hover:bg-white transition-colors"
          >
            View feature design rules →
          </Link>
        </div>
      )}
    </div>
  )
}
