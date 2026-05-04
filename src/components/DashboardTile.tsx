'use client'

import type { Feature } from '@/types'
import TileThumbnail from './TileThumbnail'

export type TileState =
  | { kind: 'available' }
  | { kind: 'in_progress'; metric: string; pct?: number }
  | { kind: 'completed' }
  | { kind: 'scheduled'; next: string }
  | { kind: 'locked_tier'; requiredTier: 'silver' | 'gold' }
  | { kind: 'locked_sequence'; unlockHint: string }

interface Props {
  feature: Feature
  state: TileState
}

export default function DashboardTile({ feature, state }: Props) {
  const locked = state.kind === 'locked_tier' || state.kind === 'locked_sequence' || !feature.included

  const baseClass = 'group relative rounded-xl border flex flex-col overflow-hidden min-h-[280px] transition-all'
  const stateClass = locked
    ? 'border-p2-navy/10 bg-p2-cream/40 opacity-60'
    : state.kind === 'completed'
    ? 'border-emerald-300 bg-white hover:border-emerald-500 hover:shadow-lg'
    : state.kind === 'scheduled'
    ? 'border-p2-gold bg-white hover:border-p2-gold-deep hover:shadow-lg'
    : 'border-p2-navy/15 bg-white hover:border-p2-navy hover:shadow-lg'

  const ctaForCategory: Record<string, string> = {
    info: 'Open',
    static: 'View',
    ai: 'Launch',
  }

  let cta = ctaForCategory[feature.category]
  if (state.kind === 'in_progress') cta = 'Resume'
  if (state.kind === 'completed') cta = 'Review'
  if (state.kind === 'scheduled') cta = 'Join'

  return (
    <div className={`${baseClass} ${stateClass}`}>
      {/* Thumbnail */}
      <div className="relative">
        <TileThumbnail featureName={feature.name} category={feature.category} />
        {state.kind === 'completed' && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
            ✓ Done
          </div>
        )}
        {state.kind === 'scheduled' && (
          <div className="absolute top-2 left-2 bg-p2-gold text-p2-navy-deep text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
            Scheduled
          </div>
        )}
        {state.kind === 'locked_tier' && (
          <div className="absolute inset-0 flex items-center justify-center bg-p2-navy-deep/40 backdrop-blur-[2px]">
            <div className="bg-p2-gold border border-p2-gold-deep rounded-full px-3 py-1 text-xs font-mono font-bold text-p2-navy-deep shadow">
              🔒 {state.requiredTier === 'gold' ? 'Gold' : 'Silver'}+
            </div>
          </div>
        )}
        {state.kind === 'locked_sequence' && (
          <div className="absolute inset-0 flex items-center justify-center bg-p2-navy-deep/40 backdrop-blur-[2px]">
            <div className="bg-white border border-p2-navy rounded-full px-3 py-1 text-xs font-mono font-bold text-p2-navy shadow">
              🔒 Locked
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-4 gap-2">
        <p className="text-sm font-medium text-ink leading-snug line-clamp-3">{feature.name}</p>
        {feature.value && (
          <p className="text-xs text-ink3 font-mono">{feature.value}</p>
        )}

        <div className="mt-auto pt-2">
          {state.kind === 'in_progress' && (
            <div className="space-y-1.5 mb-2">
              <p className="text-xs text-p2-navy font-medium">{state.metric}</p>
              {state.pct !== undefined && (
                <div className="w-full h-1.5 bg-p2-navy/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-p2-navy to-p2-gold rounded-full transition-all" style={{ width: `${state.pct}%` }} />
                </div>
              )}
            </div>
          )}
          {state.kind === 'scheduled' && (
            <p className="text-xs text-p2-gold-deep font-bold mb-2">Next: {state.next}</p>
          )}
          {state.kind === 'locked_sequence' && (
            <p className="text-xs text-p2-navy/60 leading-tight mb-2">{state.unlockHint}</p>
          )}
          {state.kind === 'available' && !locked && (
            <p className="text-xs text-p2-navy/60 mb-2">Ready</p>
          )}
          {state.kind === 'completed' && (
            <p className="text-xs text-emerald-700 font-medium mb-2">Completed</p>
          )}

          {/* CTA */}
          <div className="flex items-center justify-between">
            {state.kind === 'locked_tier' ? (
              <button className="text-xs font-bold text-p2-gold-deep hover:text-p2-navy">
                Upgrade tier →
              </button>
            ) : !locked ? (
              <button className="text-xs font-bold text-p2-navy hover:text-p2-gold-deep">
                {cta} →
              </button>
            ) : (
              <span className="text-xs text-ink3">—</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
