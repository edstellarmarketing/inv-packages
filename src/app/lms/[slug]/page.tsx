'use client'

import { useParams } from 'next/navigation'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { builtInCourses } from '@/data/courses'
import DashboardTile, { TileState } from '@/components/DashboardTile'
import InfoRow from '@/components/InfoRow'
import type { Feature, PackageTier } from '@/types'

const TIER_LABELS: Record<PackageTier['tier'], string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
}

const TIER_BADGE: Record<PackageTier['tier'], string> = {
  bronze: 'bg-amber-200 text-amber-900',
  silver: 'bg-slate-200 text-slate-900',
  gold: 'bg-yellow-200 text-yellow-900',
}

// Mock state generator — assigns plausible demo states to each feature so the
// dashboard shows the full lifecycle (available, in-progress, completed,
// locked) without a real backend. Patterns:
//  - First Active Learning challenge: in-progress
//  - Subsequent Active Learning items: locked_sequence (after first)
//  - Mock exams: in-progress with paper count
//  - Q-bank: in-progress with question count
//  - Reference cards: completed (already studied)
//  - Study guides: in-progress or available
//  - Live training: scheduled
//  - Coaching: in-progress with sessions used
//  - included:false → locked_tier
function mockState(feature: Feature, index: number, sectionTitle: string, tier: PackageTier['tier']): TileState {
  if (!feature.included) {
    // Determine which tier would unlock it
    return { kind: 'locked_tier', requiredTier: tier === 'bronze' ? 'silver' : 'gold' }
  }

  const lower = feature.name.toLowerCase()
  const isActiveLearning = sectionTitle.toLowerCase().includes('active learning')

  // Active Learning sequencing demo
  if (isActiveLearning) {
    if (index === 0) return { kind: 'in_progress', metric: '12 of 30 done', pct: 40 }
    if (index === 1) return { kind: 'in_progress', metric: '8 of 30 done', pct: 27 }
    if (index >= 2) {
      return {
        kind: 'locked_sequence',
        unlockHint: index === 2 ? 'Finish Tailoring sorter ≥ 50%' : 'Finish previous challenge',
      }
    }
  }

  // Live training: scheduled
  if (lower.includes('live') && lower.includes('training')) {
    return { kind: 'scheduled', next: 'Tue 10:00 AM' }
  }
  if (lower.includes('q&a session')) {
    return { kind: 'scheduled', next: 'Thu 4:00 PM' }
  }

  // Mock exams
  if (lower.includes('simulation') && lower.includes('paper')) {
    const value = feature.value || ''
    const total = parseInt(value) || 6
    return { kind: 'in_progress', metric: `2 of ${total} done`, pct: Math.round((2 / total) * 100) }
  }

  // Question bank
  if (lower.includes('question bank')) {
    const value = feature.value || ''
    const total = parseInt(value.replace(/,/g, '')) || 500
    const done = Math.round(total * 0.32)
    return { kind: 'in_progress', metric: `${done} / ${total} answered`, pct: 32 }
  }

  // Adaptive flashcards
  if (lower.includes('flashcard')) {
    const value = feature.value || ''
    const total = parseInt(value.replace(/[+,]/g, '')) || 400
    return { kind: 'in_progress', metric: `327 / ${total} reviewed`, pct: 82 }
  }

  // AI study planner / personalised plan
  if (lower.includes('study plan') || lower.includes('study planner')) {
    return { kind: 'in_progress', metric: 'Updated 2h ago', pct: 65 }
  }

  // Mock + gap report
  if (lower.includes('gap report')) {
    return { kind: 'in_progress', metric: 'Score 71/100', pct: 71 }
  }

  // Coaching
  if (lower.includes('1:1') || (lower.includes('coaching') && !lower.includes('coach '))) {
    return { kind: 'in_progress', metric: '1 of 3 used', pct: 33 }
  }

  // Reference cards — completed (read once)
  if (lower.includes('reference card')) {
    return { kind: 'completed' }
  }

  // Glossary
  if (lower.includes('glossary')) {
    return { kind: 'available' }
  }

  // Voucher
  if (lower.includes('voucher')) {
    return { kind: 'available' }
  }

  // Attendance certificate
  if (lower.includes('attendance certificate')) {
    return { kind: 'completed' }
  }

  // Money-back guarantee
  if (lower.includes('money-back')) {
    return { kind: 'available' }
  }

  // Default
  return { kind: 'available' }
}

function tilesEnabledCount(features: Feature[]): number {
  return features.filter((f) => f.included).length
}

export default function LmsCoursePage() {
  const params = useParams()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug

  const course = useMemo(() => builtInCourses.find((c) => c.slug === slug), [slug])

  // Default to gold for the demo since it shows all features
  const [activeTier, setActiveTier] = useState<PackageTier['tier']>('gold')

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-ink2 text-lg">Course not enrolled.</p>
        <Link href="/lms/prince2-practitioner" className="text-sm text-ink3 hover:text-ink underline">
          Open PRINCE2® Practitioner demo
        </Link>
      </div>
    )
  }

  const pkg = course.packages.find((p) => p.tier === activeTier)
  if (!pkg) {
    return (
      <div className="px-8 py-10">
        <p className="text-ink2">No {activeTier} package configured for this course.</p>
        <Link href={`/courses/${course.slug}`} className="text-sm text-ink3 hover:text-ink underline mt-4 inline-block">
          ← Back to package overview
        </Link>
      </div>
    )
  }

  const totalFeatures = pkg.sections.reduce((acc, s) => acc + s.features.length, 0)
  const enabledFeatures = pkg.sections.reduce((acc, s) => acc + tilesEnabledCount(s.features), 0)

  return (
    <div className="space-y-8 max-w-7xl">
      {/* PRINCE2-branded header banner */}
      <div className="bg-gradient-to-br from-p2-navy-deep via-p2-navy to-p2-navy-light text-white px-8 py-8 relative overflow-hidden">
        {/* Decorative gold accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-p2-gold-deep via-p2-gold to-p2-gold-deep" />
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-p2-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-10 bottom-0 w-48 h-48 rounded-full bg-p2-gold/5 blur-2xl pointer-events-none" />

        <div className="relative flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-p2-gold mb-2">
              ★ PRINCE2® · {course.eyebrow}
            </p>
            <h1 className="font-display text-4xl font-semibold mb-2">{course.title}</h1>
            <p className="text-sm text-white/80 max-w-2xl">{course.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-p2-gold text-p2-navy-deep">
              {TIER_LABELS[activeTier]} TIER
            </span>
            <Link
              href={`/courses/${course.slug}`}
              className="text-xs text-white/70 hover:text-p2-gold underline"
            >
              View package details ↗
            </Link>
          </div>
        </div>
      </div>

      <div className="px-8 space-y-8">
        {/* Tier toggle (demo affordance) */}
        <div className="rounded-lg border border-p2-navy/20 bg-p2-cream px-4 py-3 flex items-center gap-3">
          <span className="text-xs font-mono uppercase tracking-widest text-p2-navy">Demo · Switch enrolled tier:</span>
          <div className="flex gap-1">
            {(['bronze', 'silver', 'gold'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTier(t)}
                className={`text-xs font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded transition-colors ${
                  activeTier === t
                    ? 'bg-p2-navy text-p2-gold'
                    : 'bg-white text-p2-navy hover:bg-paper border border-p2-navy/10'
                }`}
              >
                {TIER_LABELS[t]}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-p2-navy/70">
            <span className="font-bold text-p2-navy">{enabledFeatures}</span> of {totalFeatures} tools unlocked at this tier
          </span>
        </div>

        {/* At-a-glance status banner — PRINCE2 navy panel */}
        <div className="rounded-xl bg-p2-navy text-white p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-p2-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <BrandStat label="Exam target" value="Mar 15, 2026" sub="64 days remaining" />
          <BrandStat label="Progress" value="42%" sub={`${enabledFeatures} tools active`} />
          <BrandStat label="AI readiness score" value="71/100" sub="Gap report ready" accent />
          <BrandStat label="Voucher status" value="Active" sub="Redeem when ready" />
        </div>

        {/* Section groups — info items render as compact rows; static + ai render as thumbnail tiles */}
        {pkg.sections.map((section) => {
          const infoItems = section.features.filter((f) => f.category === 'info')
          const tileItems = section.features.filter((f) => f.category !== 'info')
          return (
            <div key={section.title}>
              <div className="flex items-baseline justify-between mb-3 border-b-2 border-p2-navy/10 pb-2">
                <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-p2-navy flex items-center gap-2">
                  <span className="inline-block w-1 h-4 bg-p2-gold" />
                  {section.title}
                </h2>
                <span className="text-xs text-p2-navy/60">
                  <span className="font-bold text-p2-navy">{tilesEnabledCount(section.features)}</span> active · {section.features.length} total
                </span>
              </div>

              {/* Info rows — services & entitlements as compact list */}
              {infoItems.length > 0 && (
                <div className="rounded-lg border border-p2-navy/10 bg-white mb-3 overflow-hidden">
                  <div className="px-3 py-1.5 bg-p2-cream/60 border-b border-p2-navy/10">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-p2-navy/70">
                      Services & access
                    </span>
                  </div>
                  {infoItems.map((feature, i) => (
                    <InfoRow
                      key={i}
                      feature={feature}
                      state={mockState(feature, i, section.title, activeTier)}
                    />
                  ))}
                </div>
              )}

              {/* Tools & content — static + ai as thumbnail tiles */}
              {tileItems.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {tileItems.map((feature, i) => (
                    <DashboardTile
                      key={i}
                      feature={feature}
                      state={mockState(feature, i, section.title, activeTier)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Highlights bar (Gold-only) — PRINCE2 gold panel */}
        {pkg.highlights && pkg.highlights.length > 0 && (
          <div className="rounded-xl bg-gradient-to-br from-p2-gold-light via-p2-gold to-p2-gold-deep p-[2px]">
            <div className="rounded-[10px] bg-p2-cream p-5">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-p2-navy-deep mb-3 flex items-center gap-2">
                <span className="text-p2-gold-deep">★</span>
                Gold tier highlights — what you've unlocked
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pkg.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-p2-navy flex gap-2">
                    <span className="shrink-0 text-p2-gold-deep">★</span>
                    <span>{h.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Demo footer */}
        <div className="text-xs text-p2-navy/60 border-t border-p2-navy/10 pt-4 pb-8">
          <span className="font-mono uppercase tracking-widest mr-2 text-p2-navy">Demo</span>
          Mock states for illustration only. In production, tile state is derived from learner activity (LMS analytics, AI tool usage, exam attempts).
        </div>
      </div>
    </div>
  )
}

function BrandStat({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="relative">
      <p className="text-[10px] font-mono uppercase tracking-widest text-white/60 mb-1">{label}</p>
      <p className={`font-display text-2xl font-semibold leading-tight ${accent ? 'text-p2-gold' : 'text-white'}`}>{value}</p>
      <p className="text-xs text-white/60 mt-0.5">{sub}</p>
    </div>
  )
}
