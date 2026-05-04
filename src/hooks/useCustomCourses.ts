'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Course } from '@/types'
import { builtInCourses } from '@/data/courses'

const STORAGE_KEY = 'custom_courses'

function loadFromStorage(): Course[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Course[]) : []
  } catch {
    return []
  }
}

function saveToStorage(courses: Course[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses))
  } catch {
    // storage full or unavailable
  }
}

export function useCustomCourses() {
  const [customCourses, setCustomCourses] = useState<Course[]>([])

  useEffect(() => {
    setCustomCourses(loadFromStorage())
  }, [])

  const allCourses = [...builtInCourses, ...customCourses]

  const addCourse = useCallback((course: Course) => {
    setCustomCourses((prev) => {
      const next = [...prev, { ...course, isCustom: true }]
      saveToStorage(next)
      return next
    })
  }, [])

  const deleteCourse = useCallback((id: string) => {
    setCustomCourses((prev) => {
      const next = prev.filter((c) => c.id !== id)
      saveToStorage(next)
      return next
    })
  }, [])

  const getCourse = useCallback(
    (slug: string) => allCourses.find((c) => c.slug === slug) ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customCourses],
  )

  return { allCourses, customCourses, addCourse, deleteCourse, getCourse }
}
