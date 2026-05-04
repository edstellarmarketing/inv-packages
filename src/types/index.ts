export type FeatureCategory = 'info' | 'static' | 'ai'

export type CourseCategory =
  | 'Project Management'
  | 'ITSM'
  | 'Quality Management'
  | 'Agile'
  | 'DevOps'
  | 'IT Governance'

export interface Feature {
  name: string
  category: FeatureCategory
  value?: string
  included: boolean
}

export interface PackageSection {
  title: string
  features: Feature[]
}

export interface GoldHighlight {
  text: string
  category: FeatureCategory
}

export interface PackageTier {
  tier: 'bronze' | 'silver' | 'gold'
  tagline: string
  price: {
    amount: string
    period: string
    original?: string
    savings?: string
  }
  ctaNote: string
  highlights?: GoldHighlight[]
  sections: PackageSection[]
}

export interface Course {
  id: string
  slug: string
  title: string
  eyebrow: string
  subtitle: string
  description: string
  passRate: string
  courseCategory: CourseCategory
  packages: PackageTier[]
  examSpecs?: Array<{ label: string; value: string }>
  isCustom?: boolean
}
