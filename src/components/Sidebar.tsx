'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCustomCourses } from '@/hooks/useCustomCourses'
import { builtInCourses } from '@/data/courses'
import type { CourseCategory } from '@/types'

const CATEGORY_FILTERS: Array<{ label: string; value: CourseCategory | 'All' }> = [
  { label: 'All', value: 'All' },
  { label: 'PM', value: 'Project Management' },
  { label: 'ITSM', value: 'ITSM' },
  { label: 'Quality', value: 'Quality Management' },
  { label: 'Agile', value: 'Agile' },
  { label: 'DevOps', value: 'DevOps' },
  { label: 'IT Gov', value: 'IT Governance' },
]

const CATEGORY_DOT: Record<CourseCategory, string> = {
  'Project Management': 'bg-blue-400',
  'ITSM': 'bg-violet-400',
  'Quality Management': 'bg-emerald-400',
  'Agile': 'bg-orange-400',
  'DevOps': 'bg-rose-400',
  'IT Governance': 'bg-slate-400',
}

const COMBO_CHILDREN: Record<string, string[]> = {
  'prince2': ['prince2-foundation', 'prince2-practitioner'],
  'cm-fp': ['cm-foundation', 'cm-practitioner'],
  'business-analysis-fp': ['business-analysis-foundation', 'business-analysis-practitioner'],
  'agile-pm-fp': ['agile-pm-foundation', 'agile-pm-practitioner'],
  'prince2-agile-fp': ['prince2-agile-foundation', 'prince2-agile-practitioner'],
}

const CHILD_IDS = new Set(Object.values(COMBO_CHILDREN).flat())

export default function Sidebar() {
  const pathname = usePathname()
  const { customCourses, deleteCourse } = useCustomCourses()
  const [activeCategory, setActiveCategory] = useState<CourseCategory | 'All'>('All')

  const allCourses = [...builtInCourses, ...customCourses]

  const filteredCourses =
    activeCategory === 'All'
      ? allCourses
      : allCourses.filter((c) => c.isCustom || c.courseCategory === activeCategory)

  const filteredById = new Map(filteredCourses.map((c) => [c.id, c]))
  const topLevelCourses = filteredCourses.filter((c) => !CHILD_IDS.has(c.id))

  function isActive(slug: string) {
    return pathname === `/courses/${slug}`
  }

  const renderCourseLink = (course: typeof filteredCourses[number], isChild = false) => {
    const hasPackages = course.packages.length > 0
    const active = isActive(course.slug)
    return (
      <div key={course.id} className="group relative">
        <Link
          href={`/courses/${course.slug}`}
          className={`flex items-center gap-2 ${isChild ? 'pl-6 pr-3' : 'px-3'} py-2 rounded-lg text-sm transition-colors ${
            active
              ? 'bg-ink text-white font-medium'
              : hasPackages
              ? 'text-ink2 hover:bg-paper hover:text-ink'
              : 'text-ink3/50 hover:bg-paper/60 hover:text-ink3'
          }`}
        >
          {!active && course.courseCategory && (
            <span
              className={`shrink-0 ${isChild ? 'w-1 h-1' : 'w-1.5 h-1.5'} rounded-full ${
                hasPackages ? CATEGORY_DOT[course.courseCategory] : 'bg-ink3/20'
              }`}
            />
          )}
          <span className={`flex-1 truncate ${isChild ? 'text-[13px]' : ''}`}>{course.title}</span>
          {course.isCustom && (
            <span className="shrink-0 text-[9px] font-mono bg-violet-100 text-violet-700 px-1.5 py-px rounded uppercase tracking-wider">
              Custom
            </span>
          )}
        </Link>
        {course.isCustom && (
          <button
            onClick={() => deleteCourse(course.id)}
            title="Delete course"
            className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center justify-center w-5 h-5 rounded text-ink3 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            ×
          </button>
        )}
      </div>
    )
  }

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col border-r border-border bg-white overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <span className="font-display text-lg font-semibold text-ink tracking-tight">
          Course Packages
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        {/* Category filter */}
        <p className="px-2 pb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-ink3">
          Category
        </p>
        <div className="flex flex-wrap gap-1 px-1 pb-4">
          {CATEGORY_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveCategory(value)}
              className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full transition-colors ${
                activeCategory === value
                  ? 'bg-ink text-white'
                  : 'bg-paper text-ink3 hover:bg-border hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Course list */}
        <p className="px-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-widest text-ink3">
          Courses
          <span className="ml-1.5 font-normal text-ink3/70">({filteredCourses.length})</span>
        </p>
        <div className="space-y-0.5">
          {topLevelCourses.map((course) => {
            const childIds = COMBO_CHILDREN[course.id] ?? []
            const visibleChildren = childIds
              .map((id) => filteredById.get(id))
              .filter((c): c is typeof filteredCourses[number] => Boolean(c))
            return (
              <div key={course.id}>
                {renderCourseLink(course)}
                {visibleChildren.length > 0 && (
                  <div className="ml-3 mt-0.5 mb-1 border-l border-border space-y-0.5">
                    {visibleChildren.map((child) => renderCourseLink(child, true))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Divider */}
        <div className="pt-4 pb-1">
          <div className="border-t border-border" />
        </div>

        {/* New course */}
        <Link
          href="/courses/new"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === '/courses/new'
              ? 'bg-ink text-white font-medium'
              : 'text-ink2 hover:bg-paper hover:text-ink'
          }`}
        >
          <span className="text-base leading-none">+</span>
          <span>New Course</span>
        </Link>

        {/* Rules */}
        <Link
          href="/rules"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === '/rules'
              ? 'bg-ink text-white font-medium'
              : 'text-ink2 hover:bg-paper hover:text-ink'
          }`}
        >
          <span className="text-base leading-none">⚖</span>
          <span>Categorization Rules</span>
        </Link>

        {/* LMS demo */}
        <Link
          href="/lms/prince2-practitioner"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname.startsWith('/lms')
              ? 'bg-ink text-white font-medium'
              : 'text-ink2 hover:bg-paper hover:text-ink'
          }`}
        >
          <span className="text-base leading-none">🎓</span>
          <span>LMS Dashboard Demo</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border">
        <p className="text-[10px] text-ink3">Invensis Learning · Internal</p>
      </div>
    </aside>
  )
}
