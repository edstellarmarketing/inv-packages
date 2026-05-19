'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Course } from '@/types'
import { builtInCourses } from '@/data/courses'

async function fetchCourses(): Promise<Course[]> {
  try {
    const res = await fetch('/api/courses', { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return (data.courses ?? []) as Course[]
  } catch {
    return []
  }
}

async function seedBuiltIns(): Promise<boolean> {
  try {
    const res = await fetch('/api/courses/seed', { method: 'POST' })
    return res.ok
  } catch {
    return false
  }
}

export function useCustomCourses() {
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    let list = await fetchCourses()

    // First-run: empty table → seed built-ins, then re-fetch.
    if (list.length === 0) {
      const seeded = await seedBuiltIns()
      if (seeded) list = await fetchCourses()
    }

    // Supabase unreachable / schema not exposed → fall back to in-memory
    // built-ins so the UI still renders. Writes will still fail with a
    // visible error in the form.
    if (list.length === 0) {
      setUsingFallback(true)
      setAllCourses(builtInCourses)
    } else {
      setUsingFallback(false)
      setAllCourses(list)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const customCourses = allCourses.filter((c) => c.isCustom)

  const addCourse = useCallback(async (course: Course): Promise<Course | null> => {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...course, isCustom: true }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? 'Failed to save course')
    }
    const { course: saved } = (await res.json()) as { course: Course }
    setAllCourses((prev) => [...prev, saved])
    return saved
  }, [])

  const updateCourse = useCallback(async (course: Course): Promise<Course | null> => {
    const res = await fetch(`/api/courses/${encodeURIComponent(course.id)}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(course),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? 'Failed to update course')
    }
    const { course: saved } = (await res.json()) as { course: Course }
    setAllCourses((prev) => prev.map((c) => (c.id === saved.id ? saved : c)))
    return saved
  }, [])

  const deleteCourse = useCallback(async (id: string) => {
    const res = await fetch(`/api/courses/${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? 'Failed to delete course')
    }
    setAllCourses((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const getCourse = useCallback(
    (slug: string) => allCourses.find((c) => c.slug === slug) ?? null,
    [allCourses],
  )

  return {
    allCourses,
    customCourses,
    loading,
    usingFallback,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourse,
    refresh,
  }
}
