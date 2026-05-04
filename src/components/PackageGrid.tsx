import type { PackageTier, FeatureCategory } from '@/types'
import CategoryTag from './CategoryTag'

const tierStyles: Record<string, { header: string; ring: string; badge: string }> = {
  bronze: {
    header: 'bg-amber-50 border-amber-200',
    ring: 'ring-1 ring-amber-200',
    badge: 'bg-amber-100 text-amber-800',
  },
  silver: {
    header: 'bg-slate-50 border-slate-200',
    ring: 'ring-1 ring-slate-200',
    badge: 'bg-slate-100 text-slate-700',
  },
  gold: {
    header: 'bg-yellow-50 border-yellow-300',
    ring: 'ring-2 ring-yellow-300',
    badge: 'bg-yellow-200 text-yellow-900',
  },
}

function TierLabel({ tier }: { tier: string }) {
  const s = tierStyles[tier]
  return (
    <span className={`inline-block text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded ${s.badge}`}>
      {tier}
    </span>
  )
}

function FeatureRow({ name, included, category, value }: { name: string; included: boolean; category: FeatureCategory; value?: string }) {
  return (
    <li className={`flex items-start gap-2 py-1.5 border-b border-border last:border-0 ${!included ? 'opacity-40' : ''}`}>
      <span className="mt-0.5 shrink-0 text-sm">
        {included ? (
          <span className="text-emerald-500">✓</span>
        ) : (
          <span className="text-ink3">–</span>
        )}
      </span>
      <span className="flex-1 text-sm text-ink2 leading-snug">
        {name}
        {value && <span className="ml-1 text-ink3 font-mono text-xs">({value})</span>}
      </span>
      {included && <CategoryTag category={category} />}
    </li>
  )
}

function PackageCard({ pkg }: { pkg: PackageTier }) {
  const s = tierStyles[pkg.tier]

  return (
    <div className={`rounded-xl overflow-hidden ${s.ring} bg-white flex flex-col`}>
      {/* Header */}
      <div className={`px-5 pt-5 pb-4 border-b ${s.header}`}>
        <div className="flex items-center justify-between mb-2">
          <TierLabel tier={pkg.tier} />
          <div className="text-right">
            <span className="font-display text-2xl font-semibold text-ink">{pkg.price.amount}</span>
            <span className="text-xs text-ink3 ml-1">{pkg.price.period}</span>
          </div>
        </div>
        <p className="text-xs text-ink3 italic">{pkg.tagline}</p>
        {pkg.price.savings && (
          <p className="mt-1 text-xs font-medium text-emerald-600">{pkg.price.savings}</p>
        )}
      </div>

      {/* Gold highlights */}
      {pkg.highlights && pkg.highlights.length > 0 && (
        <div className="px-5 py-3 bg-yellow-50 border-b border-yellow-200">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-yellow-700 mb-2">
            Highlights
          </p>
          <ul className="space-y-1">
            {pkg.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-ink2">
                <span className="text-yellow-500 shrink-0">★</span>
                <span className="flex-1">{h.text}</span>
                <CategoryTag category={h.category} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sections */}
      <div className="flex-1 px-5 py-4 space-y-5">
        {pkg.sections.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink3 mb-2">
              {section.title}
            </p>
            <ul>
              {section.features.map((f, i) => (
                <FeatureRow key={i} {...f} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA note */}
      <div className={`px-5 py-3 border-t ${s.header}`}>
        <p className="text-xs text-ink3">{pkg.ctaNote}</p>
      </div>
    </div>
  )
}

export default function PackageGrid({ packages }: { packages: PackageTier[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <PackageCard key={pkg.tier} pkg={pkg} />
      ))}
    </div>
  )
}
