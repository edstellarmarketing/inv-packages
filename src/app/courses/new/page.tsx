'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomCourses } from '@/hooks/useCustomCourses'
import type { Course, PackageTier, PackageSection, Feature, FeatureCategory } from '@/types'
import CategoryTag from '@/components/CategoryTag'

const CATEGORIES: FeatureCategory[] = ['info', 'static', 'ai']
const CAT_LABELS: Record<FeatureCategory, string> = {
  info: 'Informational',
  static: 'Static Asset',
  ai: 'Custom AI App',
}

function makeId() {
  return `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function emptyFeature(): Feature {
  return { name: '', category: 'info', included: true }
}

function emptySection(): PackageSection {
  return { title: '', features: [emptyFeature()] }
}

function emptyTier(tier: 'bronze' | 'silver' | 'gold'): PackageTier {
  return {
    tier,
    tagline: '',
    price: { amount: '', period: '/person' },
    ctaNote: '',
    sections: [emptySection()],
  }
}

type TierIndex = 0 | 1 | 2
const TIERS: ('bronze' | 'silver' | 'gold')[] = ['bronze', 'silver', 'gold']

export default function NewCoursePage() {
  const router = useRouter()
  const { addCourse } = useCustomCourses()

  const [title, setTitle] = useState('')
  const [eyebrow, setEyebrow] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [passRate, setPassRate] = useState('')
  const [packages, setPackages] = useState<PackageTier[]>(TIERS.map(emptyTier))
  const [activeTier, setActiveTier] = useState<TierIndex>(0)
  const [errors, setErrors] = useState<string[]>([])

  // --- helpers ---
  function updateTier(ti: TierIndex, updater: (t: PackageTier) => PackageTier) {
    setPackages((prev) => prev.map((p, i) => (i === ti ? updater(p) : p)))
  }

  function updateSection(ti: TierIndex, si: number, updater: (s: PackageSection) => PackageSection) {
    updateTier(ti, (t) => ({
      ...t,
      sections: t.sections.map((s, i) => (i === si ? updater(s) : s)),
    }))
  }

  function updateFeature(ti: TierIndex, si: number, fi: number, updater: (f: Feature) => Feature) {
    updateSection(ti, si, (s) => ({
      ...s,
      features: s.features.map((f, i) => (i === fi ? updater(f) : f)),
    }))
  }

  function addSection(ti: TierIndex) {
    updateTier(ti, (t) => ({ ...t, sections: [...t.sections, emptySection()] }))
  }

  function removeSection(ti: TierIndex, si: number) {
    updateTier(ti, (t) => ({ ...t, sections: t.sections.filter((_, i) => i !== si) }))
  }

  function addFeature(ti: TierIndex, si: number) {
    updateSection(ti, si, (s) => ({ ...s, features: [...s.features, emptyFeature()] }))
  }

  function removeFeature(ti: TierIndex, si: number, fi: number) {
    updateSection(ti, si, (s) => ({ ...s, features: s.features.filter((_, i) => i !== fi) }))
  }

  // --- submit ---
  function validate(): string[] {
    const errs: string[] = []
    if (!title.trim()) errs.push('Course title is required.')
    packages.forEach((pkg, ti) => {
      if (!pkg.price.amount.trim()) errs.push(`${TIERS[ti]} tier: price is required.`)
      pkg.sections.forEach((sec, si) => {
        if (!sec.title.trim()) errs.push(`${TIERS[ti]} / section ${si + 1}: section title required.`)
        sec.features.forEach((f, fi) => {
          if (!f.name.trim()) errs.push(`${TIERS[ti]} / section "${sec.title || si + 1}" / feature ${fi + 1}: name required.`)
        })
      })
    })
    return errs
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (errs.length) { setErrors(errs); return }
    setErrors([])

    const slug = slugify(title) || makeId()
    const course: Course = {
      id: makeId(),
      slug,
      title: title.trim(),
      eyebrow: eyebrow.trim() || 'Custom Course',
      subtitle: subtitle.trim(),
      description: '',
      passRate: passRate.trim(),
      courseCategory: 'Project Management',
      packages,
      isCustom: true,
    }
    addCourse(course)
    router.push(`/courses/${slug}`)
  }

  const pkg = packages[activeTier]

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-ink3 mb-2">New Course</p>
      <h1 className="font-display text-4xl font-semibold text-ink mb-8">Create a Course Package</h1>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Course meta */}
        <section className="rounded-xl border border-border bg-white p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold text-ink">Course Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-ink3">Title *</span>
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-ink/20"
                placeholder="e.g. CAPM Certification"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-ink3">Eyebrow label</span>
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-ink/20"
                placeholder="e.g. PMI Certification"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
              />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-xs font-mono uppercase tracking-widest text-ink3">Subtitle</span>
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-ink/20"
                placeholder="Short description shown under the title"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-ink3">Pass rate</span>
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-ink/20"
                placeholder="e.g. 98.6%"
                value={passRate}
                onChange={(e) => setPassRate(e.target.value)}
              />
            </label>
          </div>
        </section>

        {/* Tier tabs */}
        <section className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="flex border-b border-border">
            {TIERS.map((tier, ti) => (
              <button
                key={tier}
                type="button"
                onClick={() => setActiveTier(ti as TierIndex)}
                className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                  activeTier === ti
                    ? 'bg-ink text-white'
                    : 'text-ink2 hover:bg-paper'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-6">
            {/* Tier meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-ink3">Price *</span>
                <input
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-ink/20"
                  placeholder="e.g. $499"
                  value={pkg.price.amount}
                  onChange={(e) => updateTier(activeTier, (t) => ({ ...t, price: { ...t.price, amount: e.target.value } }))}
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-ink3">Tagline</span>
                <input
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-ink/20"
                  placeholder="One-line description"
                  value={pkg.tagline}
                  onChange={(e) => updateTier(activeTier, (t) => ({ ...t, tagline: e.target.value }))}
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-ink3">CTA note</span>
                <input
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-ink/20"
                  placeholder="e.g. Enrol today"
                  value={pkg.ctaNote}
                  onChange={(e) => updateTier(activeTier, (t) => ({ ...t, ctaNote: e.target.value }))}
                />
              </label>
            </div>

            {/* Sections */}
            <div className="space-y-5">
              {pkg.sections.map((sec, si) => (
                <div key={si} className="rounded-lg border border-border p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      className="flex-1 border border-border rounded-lg px-3 py-1.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-ink/20"
                      placeholder="Section title (e.g. Training)"
                      value={sec.title}
                      onChange={(e) => updateSection(activeTier, si, (s) => ({ ...s, title: e.target.value }))}
                    />
                    {pkg.sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection(activeTier, si)}
                        className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
                      >
                        Remove section
                      </button>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {sec.features.map((feat, fi) => (
                      <div key={fi} className="flex items-center gap-2">
                        <input
                          className="flex-1 border border-border rounded-lg px-3 py-1.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-ink/20"
                          placeholder="Feature name"
                          value={feat.name}
                          onChange={(e) => updateFeature(activeTier, si, fi, (f) => ({ ...f, name: e.target.value }))}
                        />
                        <select
                          className="border border-border rounded-lg px-2 py-1.5 text-xs bg-paper focus:outline-none focus:ring-2 focus:ring-ink/20"
                          value={feat.category}
                          onChange={(e) => updateFeature(activeTier, si, fi, (f) => ({ ...f, category: e.target.value as FeatureCategory }))}
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{CAT_LABELS[c]}</option>
                          ))}
                        </select>
                        <CategoryTag category={feat.category} />
                        <label className="flex items-center gap-1 text-xs text-ink3 shrink-0">
                          <input
                            type="checkbox"
                            checked={feat.included}
                            onChange={(e) => updateFeature(activeTier, si, fi, (f) => ({ ...f, included: e.target.checked }))}
                            className="accent-ink"
                          />
                          Included
                        </label>
                        {sec.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(activeTier, si, fi)}
                            className="text-ink3 hover:text-red-500 px-1 text-lg leading-none"
                            title="Remove feature"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addFeature(activeTier, si)}
                      className="text-xs text-ink3 hover:text-ink px-2 py-1 rounded hover:bg-paper border border-dashed border-border"
                    >
                      + Add feature
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addSection(activeTier)}
                className="text-sm text-ink3 hover:text-ink px-3 py-2 rounded-lg hover:bg-paper border border-dashed border-border w-full"
              >
                + Add section
              </button>
            </div>
          </div>
        </section>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-1">
            {errors.map((e, i) => (
              <p key={i} className="text-sm text-red-600">{e}</p>
            ))}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-ink text-white text-sm font-medium rounded-lg hover:bg-ink2 transition-colors"
          >
            Create Course
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-border text-sm text-ink2 rounded-lg hover:bg-paper transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
