'use client'

import { useState } from 'react'
import type { Course, PackageTier, PackageSection, Feature, FeatureCategory } from '@/types'
import CategoryTag from '@/components/CategoryTag'

const CATEGORIES: FeatureCategory[] = ['info', 'static', 'ai']
const CAT_LABELS: Record<FeatureCategory, string> = {
  info: 'Informational',
  static: 'Static Asset',
  ai: 'Custom AI App',
}

type TierIndex = 0 | 1 | 2
const TIERS: ('bronze' | 'silver' | 'gold')[] = ['bronze', 'silver', 'gold']

export function makeId() {
  return `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export function slugify(s: string) {
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

export function emptyCourseDraft(): CourseDraft {
  return {
    title: '',
    eyebrow: '',
    subtitle: '',
    passRate: '',
    packages: TIERS.map(emptyTier),
  }
}

export interface CourseDraft {
  title: string
  eyebrow: string
  subtitle: string
  passRate: string
  packages: PackageTier[]
}

export function courseToDraft(c: Course): CourseDraft {
  const byTier = new Map(c.packages.map((p) => [p.tier, p]))
  return {
    title: c.title,
    eyebrow: c.eyebrow,
    subtitle: c.subtitle,
    passRate: c.passRate,
    packages: TIERS.map((t) => byTier.get(t) ?? emptyTier(t)),
  }
}

interface Props {
  initial?: CourseDraft
  submitLabel: string
  onCancel: () => void
  onSubmit: (draft: CourseDraft) => Promise<void> | void
}

export default function CourseForm({ initial, submitLabel, onCancel, onSubmit }: Props) {
  const start = initial ?? emptyCourseDraft()

  const [title, setTitle] = useState(start.title)
  const [eyebrow, setEyebrow] = useState(start.eyebrow)
  const [subtitle, setSubtitle] = useState(start.subtitle)
  const [passRate, setPassRate] = useState(start.passRate)
  const [packages, setPackages] = useState<PackageTier[]>(start.packages)
  const [activeTier, setActiveTier] = useState<TierIndex>(0)
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (errs.length) { setErrors(errs); return }
    setErrors([])
    setServerError(null)
    setSubmitting(true)
    try {
      await onSubmit({ title: title.trim(), eyebrow: eyebrow.trim(), subtitle: subtitle.trim(), passRate: passRate.trim(), packages })
    } catch (err) {
      setServerError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const pkg = packages[activeTier]

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
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

      {errors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-1">
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-red-600">{e}</p>
          ))}
        </div>
      )}

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{serverError}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-ink text-white text-sm font-medium rounded-lg hover:bg-ink2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-6 py-2.5 border border-border text-sm text-ink2 rounded-lg hover:bg-paper transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
