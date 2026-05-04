'use client'

import { useState } from 'react'
import type { FeatureCategory } from '@/types'

type Variant =
  | 'training'
  | 'voucher'
  | 'certificate'
  | 'kit'
  | 'lms'
  | 'papers'
  | 'questions'
  | 'flashcards'
  | 'book'
  | 'case'
  | 'card'
  | 'ai-coach'
  | 'ai-plan'
  | 'gap-chart'
  | 'game'
  | 'people'
  | 'phone-support'
  | 'badge'
  | 'money'
  | 'pathway'
  | 'tailoring'
  | 'glossary'
  | 'formula'
  | 'default'

// Curated Unsplash photo IDs — each variant gets a topically distinct image so
// the dashboard reads as: "kit looks like a kit, study guide looks like a guide,
// flashcards look like flashcards, case studies look like reports, etc."
// Stable, widely-referenced photo IDs prioritised; onError fallback handles any
// outlier that returns 404.
const PHOTO: Record<Variant, string> = {
  training: 'photo-1517486808906-6ca8b3f04846',         // group of learners at laptops
  voucher: 'photo-1607082348824-0a96f2a4b9da',          // ticket / golden pass
  certificate: 'photo-1576091160550-2173dba999ef',      // diploma / certificate scroll
  kit: 'photo-1481627834876-b7833e8f5570',              // physical books / library kit
  lms: 'photo-1517694712202-14dd9538aa97',              // laptop on dark desk
  papers: 'photo-1606326608606-aa0b62935f2b',           // exam answer sheet (bubble)
  questions: 'photo-1456513080510-7bf3a84b82f8',        // notebook with study notes
  flashcards: 'photo-1606326608606-aa0b62935f2b',       // small cards layout
  book: 'photo-1503676260728-1c00da094a0b',             // open hardcover study guide
  glossary: 'photo-1457369804613-52c61a468e7d',         // dictionary / terminology
  case: 'photo-1450101499163-c8848c66ca85',             // business newsprint / reports
  card: 'photo-1606326608606-aa0b62935f2b',             // printed reference card
  formula: 'photo-1635070041078-e363dbe005cb',          // formulas on whiteboard
  'ai-coach': 'photo-1531746790731-6c087fecd65a',       // robot / AI futuristic
  'ai-plan': 'photo-1506784983877-45594efa4cbe',        // calendar planner
  'gap-chart': 'photo-1551288049-bebda4e38f71',         // analytics chart on laptop
  game: 'photo-1611996575749-79a3a250f948',             // dice / game board
  people: 'photo-1521791136064-7986c2920216',           // handshake / team
  'phone-support': 'photo-1556761175-b413da4baf72',     // headset support
  badge: 'photo-1567427017947-545c5f8d16ad',            // gold trophy
  money: 'photo-1554224155-6726b3ff858f',               // gold coins
  pathway: 'photo-1486325212027-8081e485255e',          // path through nature
  tailoring: 'photo-1581291518633-83b4ebd1d83e',        // mixer board (sliders)
  default: 'photo-1454165804606-c3d57bc86b40',          // default papers
}

// Stable fallback if any of the above 404s
const FALLBACK_PHOTO = 'photo-1481627834876-b7833e8f5570'

// Per-variant mini illustrations layered on top of the photo. Lets us
// distinguish kit vs card vs flashcards even when the underlying photo is
// shared (e.g. all paper-on-desk photos look similar from a distance).
function VariantOverlay({ variant }: { variant: Variant }) {
  const stroke = 'rgba(248,244,237,0.95)'
  const fill = 'rgba(15,27,60,0.85)'

  switch (variant) {
    case 'kit':
      // Three stacked book spines
      return (
        <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <g transform="translate(60, 30)">
            <rect x="0" y="40" width="80" height="14" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <rect x="5" y="22" width="75" height="14" fill={fill} stroke={stroke} strokeWidth="1.5" opacity="0.85" />
            <rect x="0" y="4" width="80" height="14" fill={fill} stroke={stroke} strokeWidth="1.5" opacity="0.7" />
            <text x="40" y="14" textAnchor="middle" fontSize="6" fill={stroke} fontWeight="bold" letterSpacing="1">KIT</text>
          </g>
        </svg>
      )
    case 'card':
      // Folded reference card silhouette
      return (
        <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <g transform="translate(50, 25)">
            <rect x="0" y="0" width="100" height="70" fill={fill} stroke={stroke} strokeWidth="1.5" rx="2" />
            <line x1="50" y1="0" x2="50" y2="70" stroke={stroke} strokeWidth="1" strokeDasharray="3,3" opacity="0.7" />
            <rect x="6" y="6" width="22" height="3" fill={stroke} />
            <rect x="6" y="14" width="38" height="2" fill={stroke} opacity="0.6" />
            <rect x="6" y="20" width="32" height="2" fill={stroke} opacity="0.6" />
            <rect x="56" y="6" width="22" height="3" fill={stroke} />
            <rect x="56" y="14" width="38" height="2" fill={stroke} opacity="0.6" />
            <rect x="56" y="20" width="32" height="2" fill={stroke} opacity="0.6" />
          </g>
        </svg>
      )
    case 'book':
      // Open book silhouette
      return (
        <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <g transform="translate(40, 25)">
            <polygon points="0,15 60,5 60,65 0,55" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <polygon points="60,5 120,15 120,55 60,65" fill={fill} stroke={stroke} strokeWidth="1.5" opacity="0.9" />
            <line x1="60" y1="5" x2="60" y2="65" stroke={stroke} strokeWidth="1" />
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <line x1="8" y1={20 + i * 8} x2="55" y2={22 + i * 8} stroke={stroke} strokeWidth="1" opacity="0.5" />
                <line x1="65" y1={22 + i * 8} x2="115" y2={20 + i * 8} stroke={stroke} strokeWidth="1" opacity="0.5" />
              </g>
            ))}
          </g>
        </svg>
      )
    case 'flashcards':
      // Stack of flashcards rotated
      return (
        <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <g transform="translate(70, 30)">
            <rect x="-5" y="20" width="60" height="40" fill={fill} stroke={stroke} strokeWidth="1.2" rx="3" transform="rotate(-12 25 40)" />
            <rect x="0" y="10" width="60" height="40" fill={fill} stroke={stroke} strokeWidth="1.2" rx="3" transform="rotate(-3 30 30)" opacity="0.92" />
            <rect x="5" y="0" width="60" height="40" fill="white" stroke={fill} strokeWidth="1.5" rx="3" transform="rotate(8 35 20)" />
            <text x="35" y="22" textAnchor="middle" fontSize="14" fill={fill} fontWeight="bold" transform="rotate(8 35 20)">A</text>
          </g>
        </svg>
      )
    case 'case':
      // Case study report — folder with chart
      return (
        <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <g transform="translate(55, 25)">
            <rect x="0" y="0" width="90" height="70" fill={fill} stroke={stroke} strokeWidth="1.5" rx="2" />
            <rect x="6" y="6" width="35" height="3" fill={stroke} />
            <text x="6" y="20" fontSize="5" fill={stroke} fontFamily="ui-monospace,monospace" letterSpacing="1">CASE STUDY</text>
            {/* mini bar chart */}
            <rect x="8" y="40" width="6" height="22" fill={stroke} opacity="0.85" />
            <rect x="18" y="32" width="6" height="30" fill={stroke} />
            <rect x="28" y="44" width="6" height="18" fill={stroke} opacity="0.85" />
            <rect x="38" y="28" width="6" height="34" fill={stroke} />
            <rect x="48" y="38" width="6" height="24" fill={stroke} opacity="0.85" />
            <line x1="6" y1="62" x2="84" y2="62" stroke={stroke} strokeWidth="1" />
            {/* sidebar lines */}
            <line x1="60" y1="32" x2="84" y2="32" stroke={stroke} strokeWidth="1" opacity="0.6" />
            <line x1="60" y1="38" x2="84" y2="38" stroke={stroke} strokeWidth="1" opacity="0.6" />
            <line x1="60" y1="44" x2="80" y2="44" stroke={stroke} strokeWidth="1" opacity="0.6" />
          </g>
        </svg>
      )
    case 'glossary':
      // Open dictionary — A-Z tabs
      return (
        <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <g transform="translate(45, 25)">
            <rect x="0" y="0" width="110" height="70" fill={fill} stroke={stroke} strokeWidth="1.5" rx="2" />
            <line x1="55" y1="0" x2="55" y2="70" stroke={stroke} strokeWidth="1" />
            <text x="8" y="14" fontSize="8" fill={stroke} fontWeight="bold">A</text>
            <text x="62" y="14" fontSize="8" fill={stroke} fontWeight="bold">B</text>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <line x1="8" y1={22 + i * 9} x2="50" y2={22 + i * 9} stroke={stroke} strokeWidth="0.8" opacity="0.6" />
                <line x1="62" y1={22 + i * 9} x2="105" y2={22 + i * 9} stroke={stroke} strokeWidth="0.8" opacity="0.6" />
              </g>
            ))}
            {/* edge tabs A-Z */}
            <rect x="105" y="10" width="6" height="6" fill={stroke} />
            <rect x="105" y="22" width="6" height="6" fill={stroke} opacity="0.6" />
            <rect x="105" y="34" width="6" height="6" fill={stroke} opacity="0.6" />
            <rect x="105" y="46" width="6" height="6" fill={stroke} opacity="0.6" />
          </g>
        </svg>
      )
    case 'formula':
      // Formula whiteboard
      return (
        <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <g transform="translate(45, 25)">
            <rect x="0" y="0" width="110" height="70" fill={fill} stroke={stroke} strokeWidth="1.5" rx="2" />
            <text x="55" y="28" textAnchor="middle" fontSize="14" fill={stroke} fontWeight="bold" fontFamily="ui-monospace,monospace">EV = BAC × %</text>
            <text x="55" y="48" textAnchor="middle" fontSize="11" fill={stroke} fontFamily="ui-monospace,monospace">CPI = EV / AC</text>
            <text x="55" y="62" textAnchor="middle" fontSize="9" fill={stroke} opacity="0.7" fontFamily="ui-monospace,monospace">σ = √Σ(x − μ)²/n</text>
          </g>
        </svg>
      )
    default:
      return null
  }
}

function pickVariant(name: string): Variant {
  const n = name.toLowerCase()
  if (n.includes('live') && n.includes('training')) return 'training'
  if (n.includes('q&a session')) return 'training'
  if (n.includes('voucher')) return 'voucher'
  if (n.includes('attendance certificate')) return 'certificate'
  if (n.includes('learner kit') || (n.includes('kit') && !n.includes('flashcard'))) return 'kit'
  if (n.includes('lms access')) return 'lms'
  if (n.includes('simulation') && n.includes('paper')) return 'papers'
  if (n.includes('question bank')) return 'questions'
  if (n.includes('flashcard')) return 'flashcards'
  // Order matters: specific (case, glossary, formula) before general (book / card)
  if (n.includes('case stud') || n.includes('in practice')) return 'case'
  if (n.includes('formula pack') || n.includes('formula')) return 'formula'
  if (n.includes('glossary') || n.includes('terminology')) return 'glossary'
  if (n.includes('study guide') || n.includes('deep-dive')) return 'book'
  if (n.includes('reference card') || n.includes('cheat sheet') || n.includes('quick-reference')) return 'card'
  if (n.includes('roleplay') || n.includes('scenario coach') || n.includes('concept coach') || n.includes('interview coach')) return 'ai-coach'
  if (n.includes('study plan') || n.includes('study planner')) return 'ai-plan'
  if (n.includes('gap report') || n.includes('progress tracker') || n.includes('dashboard')) return 'gap-chart'
  if (n.includes('sorter') || n.includes('challenge') || n.includes('walkthrough') || n.includes('quiz') || n.includes('identifier') || n.includes('selector')) return 'game'
  if (n.includes('coaching') || n.includes('community') || n.includes('webinar') || n.includes('instructor')) return 'people'
  if (n.includes('phone') || n.includes('chat') || n.includes('email') || n.includes('support')) return 'phone-support'
  if (n.includes('badge')) return 'badge'
  if (n.includes('cashback') || n.includes('money-back') || n.includes('emi') || n.includes('pay-in-parts') || n.includes('guarantee')) return 'money'
  if (n.includes('pathways') || n.includes('roadmap') || n.includes('changes guide')) return 'pathway'
  if (n.includes('tailoring')) return 'tailoring'
  if (n.includes('retake')) return 'training'
  return 'default'
}

interface Props {
  featureName: string
  category: FeatureCategory
}

// PRINCE2 brand-tinted overlay per category — the photo shows through but is
// unified to navy/gold/cream so the LMS feels brand-coherent.
const OVERLAY: Record<FeatureCategory, string> = {
  // navy: signals "service / system / informational"
  info: 'linear-gradient(135deg, rgba(27,45,95,0.55) 0%, rgba(46,64,128,0.35) 100%)',
  // gold/cream: signals "course content / static asset"
  static: 'linear-gradient(135deg, rgba(240,185,11,0.45) 0%, rgba(248,244,237,0.25) 100%)',
  // navy + gold accent: signals "AI tool"
  ai: 'linear-gradient(135deg, rgba(15,27,60,0.65) 0%, rgba(240,185,11,0.35) 100%)',
}

export default function TileThumbnail({ featureName, category }: Props) {
  const variant = pickVariant(featureName)
  const photoId = PHOTO[variant]
  const [erroredOnce, setErroredOnce] = useState(false)
  const activeId = erroredOnce ? FALLBACK_PHOTO : photoId
  const url = `https://images.unsplash.com/${activeId}?w=480&h=240&fit=crop&q=80&auto=format`

  return (
    <div className="relative w-full h-28 overflow-hidden bg-p2-navy">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => {
          if (!erroredOnce) setErroredOnce(true)
        }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: OVERLAY[category] }}
      />
      {/* Variant-specific illustration overlay so kit/card/book/flashcards/case
          read as their own thing even if the underlying photo is shared */}
      <VariantOverlay variant={variant} />
      {/* Brand stripe at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-p2-navy via-p2-gold to-p2-navy opacity-90" />
    </div>
  )
}
