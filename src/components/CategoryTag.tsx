import type { FeatureCategory } from '@/types'

const labels: Record<FeatureCategory, string> = {
  info: 'Info',
  static: 'Static',
  ai: 'AI',
}

const classes: Record<FeatureCategory, string> = {
  info: 'cat-info',
  static: 'cat-static',
  ai: 'cat-ai',
}

interface Props {
  category: FeatureCategory
  size?: 'sm' | 'xs'
}

export default function CategoryTag({ category, size = 'xs' }: Props) {
  const sizeClass = size === 'xs'
    ? 'text-[9px] px-1.5 py-px'
    : 'text-xs px-2 py-0.5'

  return (
    <span
      className={`inline-block font-mono font-semibold uppercase tracking-widest rounded ${sizeClass} ${classes[category]}`}
    >
      {labels[category]}
    </span>
  )
}
