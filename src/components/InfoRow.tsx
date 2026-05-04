'use client'

import type { Feature } from '@/types'
import type { TileState } from './DashboardTile'

const INFO_ICONS: Record<string, string> = {
  'live': '📺', 'training': '📺', 'instructor': '👨‍🏫', 'q&a': '💬',
  'voucher': '🎟', 'attendance': '📜', 'certificate': '📜', 'lms': '💻',
  'email': '✉', 'chat': '💬', 'phone': '📞', 'support': '💬',
  'community': '👥', 'webinar': '🎓', 'badge': '🏆',
  'cashback': '💵', 'emi': '💳', 'pay-in-parts': '💳', 'guarantee': '💰',
  'retake': '🔁', 'coaching': '👤', 'dashboard': '📈',
  'progress': '📈', 'social': '🏆',
}

function pickIcon(name: string): string {
  const lower = name.toLowerCase()
  for (const key of Object.keys(INFO_ICONS)) {
    if (lower.includes(key)) return INFO_ICONS[key]
  }
  return '·'
}

function ctaLabel(feature: Feature, state: TileState): string {
  if (state.kind === 'scheduled') return 'Join'
  if (state.kind === 'completed') return 'View'
  const lower = feature.name.toLowerCase()
  if (lower.includes('voucher')) return 'Redeem'
  if (lower.includes('lms access')) return 'Open LMS'
  if (lower.includes('q&a session')) return 'Schedule'
  if (lower.includes('coaching')) return 'Book session'
  if (lower.includes('certificate')) return 'Download'
  if (lower.includes('badge')) return 'Claim'
  if (lower.includes('community') || lower.includes('webinar')) return 'Open'
  if (lower.includes('phone') || lower.includes('email') || lower.includes('chat') || lower.includes('support')) return 'Contact'
  if (lower.includes('cashback')) return 'View terms'
  if (lower.includes('emi') || lower.includes('pay-in-parts')) return 'View plan'
  if (lower.includes('guarantee')) return 'View terms'
  if (lower.includes('retake')) return 'Schedule'
  if (lower.includes('dashboard') || lower.includes('progress')) return 'View'
  if (lower.includes('instructor')) return 'View profile'
  return 'Open'
}

interface Props {
  feature: Feature
  state: TileState
}

export default function InfoRow({ feature, state }: Props) {
  const locked = state.kind === 'locked_tier' || state.kind === 'locked_sequence' || !feature.included
  const icon = pickIcon(feature.name)

  // Build the right-hand meta string
  let meta = ''
  if (feature.value) meta = feature.value
  if (state.kind === 'scheduled') meta = meta ? `${meta} · Next: ${state.next}` : `Next: ${state.next}`
  if (state.kind === 'in_progress') meta = state.metric
  if (state.kind === 'completed') meta = '✓ Completed'

  return (
    <div className={`flex items-center gap-3 py-2.5 px-3 border-b border-p2-navy/5 last:border-0 ${locked ? 'opacity-50' : 'hover:bg-p2-cream/40'}`}>
      <span className="text-base shrink-0 w-6 text-center">{icon}</span>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-p2-navy font-medium leading-snug truncate">{feature.name}</p>
        {meta && (
          <p className={`text-xs mt-0.5 ${state.kind === 'scheduled' ? 'text-p2-gold-deep font-semibold' : state.kind === 'completed' ? 'text-emerald-700' : 'text-p2-navy/60'}`}>
            {meta}
          </p>
        )}
      </div>

      <div className="shrink-0">
        {state.kind === 'locked_tier' ? (
          <span className="text-xs font-mono font-bold text-p2-gold-deep">
            🔒 {state.requiredTier === 'gold' ? 'Gold+' : 'Silver+'}
          </span>
        ) : !locked ? (
          <button className="text-xs font-bold text-p2-navy hover:text-p2-gold-deep whitespace-nowrap">
            {ctaLabel(feature, state)} →
          </button>
        ) : (
          <span className="text-xs text-ink3">—</span>
        )}
      </div>
    </div>
  )
}
