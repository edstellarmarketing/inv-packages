export interface DisambiguationRule {
  id: number
  question: string
  answer: string
}

export interface KeywordRow {
  keyword: string
  category: 'info' | 'static' | 'ai'
  label: string
}

export interface RuleCategory {
  id: '01' | '02' | '03'
  name: string
  slug: 'info' | 'static' | 'ai'
  tagline: string
  definition: string
  includes: string[]
  buildCost: string
}

export const categories: RuleCategory[] = [
  {
    id: '01',
    name: 'Informational',
    slug: 'info',
    tagline: 'Sales / service ops territory — no engineering work.',
    definition:
      'Pure information, services, and standard system features. Things the learner gets access to by buying the course. No course-specific content build, no AI integration.',
    includes: [
      'Human-delivered services (live training, instructor Q&A, 1:1 instructor coaching sessions, support channels)',
      'Access entitlements (LMS access, exam e-voucher, refresher access, retake training)',
      'Standard system features identical across all courses (progress tracker dashboard, social media badge, learner community, certificate of attendance)',
      'Commercial / program terms (cashback, EMI, money-back guarantee, refund policy)',
      'PDU / CPD activity platform access (the entitlement, not the AI tools inside it)',
    ],
    buildCost: 'Marketing copy + standard LMS plumbing. No course-specific work.',
  },
  {
    id: '02',
    name: 'Static Assets',
    slug: 'static',
    tagline: 'Content / curriculum + light frontend — one-time effort per course.',
    definition:
      'Course-specific content or widgets created once and uploaded to the LMS. Same file or interactive widget served to every enrolled learner. No AI required to make it work.',
    includes: [
      'Course content: learner kits, eBooks, workbooks, exclusive digital materials',
      'Question banks, simulation exam papers, knowledge area quizzes (fixed content)',
      'Study plans that are templated (e.g. a generic 30/60/90-day plan for the whole cohort)',
      'Reference content: glossaries, cheat sheets, formula packs, ITTO references, checklists, visual maps, reference cards, quick-reference guides, and framework diagrams (e.g. Scrum visual map, Agile Manifesto reference card)',
      'Workshop guides, facilitation format documents, and methodology comparison guides (e.g. Sprint planning guide, Retrospective formats, Scrum vs Kanban comparison)',
      'Simulation exercises with fixed, pre-scripted scenarios (e.g. sprint simulations, process walkthroughs) — not AI-adaptive',
      'Calculators with fixed logic (Earned Value, Methodology Finder, Salary Benchmarker, Eligibility Checker)',
      'Templates and builders where the user populates fields themselves (Project Charter, RACI, WBS, Risk Register, Definition of Done)',
      'Games and gamified content with fixed scenarios (sorting games, decision sorters, card battles, ethics dilemma decks, estimation games)',
      'PDU / CPD trackers with rule-based logic',
      'Next-step career or certification pathway roadmaps (static document — no AI-generated recommendations)',
      'Application worksheets, audit-safe guidance documents',
    ],
    buildCost: 'Content authoring + frontend widget development. One-time effort per course.',
  },
  {
    id: '03',
    name: 'Custom AI Applications',
    slug: 'ai',
    tagline: 'Real product engineering with AI integration.',
    definition:
      'AI-driven tools that need to understand the learner (via profile, inputs, or performance data), generate output specifically for them, and analyse it.',
    includes: [
      'Tools with "AI-powered" or "AI-personalised" in the name',
      'Mock exam gap reports that diagnose weak areas from actual performance',
      'Personalised study plans generated against the learner\'s exam date, baseline level, and weak domains',
      'Roleplay coaches (stakeholder negotiation, interview prep) that need conversational AI',
      'Adaptive systems that change behaviour based on learner performance (adaptive flashcards, drill modes)',
      'Daily / monthly AI-generated content (situational challenges, industry scenarios, PM trends briefings)',
      'Readiness scoring that assesses the learner',
      'AI-delivered coaching and concept coaches (where an AI model generates the coaching content — not a human instructor)',
    ],
    buildCost:
      'Real product engineering. LLM integration, profile data pipeline, evaluation and guardrails.',
  },
]

export const decisionFlow = [
  {
    step: 'Q1',
    question:
      'Is this a standard service, system feature, or access entitlement that works the same way regardless of which course is being sold?',
    yes: { result: 'INFORMATIONAL', stop: true },
    no: { next: 'Q2' },
  },
  {
    step: 'Q2',
    question:
      'Does this feature need AI to understand the learner AND generate or analyse output specifically for them?',
    yes: { result: 'CUSTOM AI APPLICATION', stop: true },
    no: { result: 'STATIC ASSET', stop: true, note: 'Course-specific content, no AI required.' },
  },
]

export const disambiguationRules: DisambiguationRule[] = [
  {
    id: 1,
    question: '"If the LMS serves it based on profile, is that AI?"',
    answer:
      'No. Filtering a question bank by weak domain is not AI; it\'s a database query. The underlying content is still a Static Asset. Custom AI requires the output to be generated by AI, not just the delivery to be smart.',
  },
  {
    id: 2,
    question: '"Calculators that take user inputs."',
    answer:
      'Static Asset. Rule-based logic with deterministic output is not AI. Earned Value, Methodology Finder, Eligibility Checker, Experience Hours Calculator all stay in Static Assets even though they\'re interactive.',
  },
  {
    id: 3,
    question: '"Templates and builders the user populates."',
    answer:
      'Static Asset. If the user fills in a Project Charter, RACI matrix, or Risk Register from a fixed template, it\'s a Static Asset. It only becomes Custom AI if AI drafts content for them based on a project description or other inputs.',
  },
  {
    id: 4,
    question: '"Personalised coaching."',
    answer:
      'Depends on delivery. "Personalised X coaching (3 × 1:1 instructor sessions)" = Informational — it is a human-delivered service, the same category as live training and Q&A sessions. "AI-powered coaching", "AI concept coach", or any coaching where AI generates the session content = Custom AI Application. The tell is whether a human instructor or an AI model is doing the coaching. Do not use [ai] as a proxy for "premium" — use it only when AI is the delivery mechanism.',
  },
  {
    id: 5,
    question: '"Progress tracker dashboard, attendance certificates, badges."',
    answer:
      'Informational. These are standard LMS system features, not course-specific content. They work identically across PMP, PRINCE2, ITIL.',
  },
  {
    id: 6,
    question: '"PDU / CPD trackers."',
    answer:
      'Static Asset. Rule-based tracking against published continuing-education requirements. Becomes Custom AI only if it includes AI recommendations on which PDUs to pursue.',
  },
  {
    id: 7,
    question: '"Games and challenges."',
    answer:
      'Static Asset by default if the content is fixed (e.g. 40 ethics dilemma cards, 50 scenario cards, sorting games). Custom AI Application if the content is AI-generated each session (e.g. "Daily situational challenge — AI-powered", "Monthly industry scenario challenge").',
  },
  {
    id: 8,
    question: '"Adaptive flashcards / drill mode."',
    answer:
      'Custom AI Application. "Adaptive" implies the system learns from the learner\'s responses and adjusts difficulty/order. A flashcard set with fixed content is a Static Asset; an adaptive flashcard system is a Custom AI App.',
  },
  {
    id: 9,
    question: '"Brand-named instructors and vouchers."',
    answer:
      'Genericise. "PMI-authorised instructors" → "Authorized instructors". "PeopleCert exam e-voucher" → "Exam e-voucher". Brand-specific naming applies on the marketing page, not the categorization.',
  },
  {
    id: 10,
    question: '"Study plans."',
    answer:
      'Templated study plan (same 90-day plan for everyone, or one variant per track) → Static Asset. AI-personalised study plan (generated from learner\'s exam date, baseline assessment, weak domains) → Custom AI Application. The keyword "AI-personalised" or "personalised" in the feature name is usually the tell.',
  },
  {
    id: 11,
    question: '"Simulations" and "Sprint exercises".',
    answer:
      'Static Asset if scenarios, decisions, and outcomes are pre-scripted and identical for every learner (e.g. a 5-sprint simulation walkthrough, a fixed process scenario). Custom AI Application only if the simulation adapts dynamically using AI — e.g. the LLM branches the narrative based on the learner\'s decisions, or difficulty adjusts per performance. "Sprint simulation (5 sprints)" → Static Asset. "AI Daily Scrum standup roleplay" → Custom AI Application.',
  },
  {
    id: 12,
    question: '"Workshop guide", "Facilitation format", "Comparison guide".',
    answer:
      'Static Asset. These are fixed instructional documents authored once and served identically to every learner — workshop scripts, Scrum events study guides, framework comparison sorters (Agile vs Waterfall). They only become Custom AI if the content is generated dynamically for the learner by AI.',
  },
]

export const keywordIndicators: KeywordRow[] = [
  { keyword: '"AI" or "AI-powered"', category: 'ai', label: 'Custom AI Application' },
  { keyword: '"AI-personalised" or "Personalised"', category: 'ai', label: 'Custom AI Application' },
  { keyword: '"Adaptive"', category: 'ai', label: 'Custom AI Application' },
  { keyword: '"Roleplay" or "Coach" (when AI-delivered)', category: 'ai', label: 'Custom AI Application' },
  { keyword: '"Live", "Instructor-led", "Q&A session"', category: 'info', label: 'Informational' },
  { keyword: '"Access", "Entitlement", "Voucher", "Guarantee"', category: 'info', label: 'Informational' },
  { keyword: '"Dashboard" (system stats)', category: 'info', label: 'Informational' },
  { keyword: '"Community", "Webinars hub"', category: 'info', label: 'Informational' },
  { keyword: '"Calculator", "Checker", "Finder" (no AI)', category: 'static', label: 'Static Asset' },
  { keyword: '"Glossary", "Cheat sheet", "Formula pack"', category: 'static', label: 'Static Asset' },
  { keyword: '"Question bank", "Quiz bank", "Simulation papers"', category: 'static', label: 'Static Asset' },
  { keyword: '"Template", "Builder" (no AI)', category: 'static', label: 'Static Asset' },
  { keyword: '"Game", "Challenge" (fixed content)', category: 'static', label: 'Static Asset' },
  { keyword: '"Simulation" (fixed/pre-scripted scenarios)', category: 'static', label: 'Static Asset' },
  { keyword: '"Sorter", "Decision sorter", "Comparison guide"', category: 'static', label: 'Static Asset' },
  { keyword: '"Visual map", "Reference card", "Quick-reference"', category: 'static', label: 'Static Asset' },
  { keyword: '"Workshop", "Facilitation format" (fixed document)', category: 'static', label: 'Static Asset' },
  { keyword: '"Pathway roadmap" (non-AI, career/cert guidance)', category: 'static', label: 'Static Asset' },
  { keyword: '"Daily" or "Monthly AI" challenge', category: 'ai', label: 'Custom AI Application' },
]

// ─── Course Feature Design Rules ─────────────────────────────────────────────

export interface AlignmentQuestion {
  id: number
  question: string
  yesOutcome: string
  yesVerdict: 'include' | 'move' | 'remove'
  noOutcome: string
  noVerdict: 'include' | 'move' | 'remove'
}

export interface DesignTrap {
  id: number
  trap: string
  badExample: string
  fix: string
}

export interface TierSpec {
  tier: 'Bronze' | 'Silver' | 'Gold'
  positioning: string
  examPrepProfile: string[]
  activeLearningSections: string
  supportHighlights: string[]
  guarantee: string
}

export const examAlignmentQuestions: AlignmentQuestion[] = [
  {
    id: 1,
    question: 'Can this feature be directly tied to a named topic in the exam syllabus?',
    yesOutcome: 'Safe for Exam Preparation section.',
    yesVerdict: 'include',
    noOutcome: 'Move to Support & Mentoring, Active Learning (if it reinforces understanding), or remove entirely.',
    noVerdict: 'move',
  },
  {
    id: 2,
    question: 'Does this feature develop practitioner skill (doing the job) rather than certification knowledge (knowing the syllabus)?',
    yesOutcome: 'Move to Active Learning if it reinforces an exam concept through practice — otherwise move to Support or remove.',
    yesVerdict: 'move',
    noOutcome: 'Knowledge/theory → safe in Exam Preparation.',
    noVerdict: 'include',
  },
  {
    id: 3,
    question: 'Does this feature reference a framework, methodology, or technique NOT explicitly in the exam syllabus?',
    yesOutcome: 'Remove — adjacent frameworks are not tested even when thematically related (e.g. Kanban in a Scrum-only exam).',
    yesVerdict: 'remove',
    noOutcome: 'Only covers syllabus content → safe to include.',
    noVerdict: 'include',
  },
  {
    id: 4,
    question: 'Is this a blank fillable template or practitioner document rather than a study/reference guide?',
    yesOutcome: 'Replace with a reference guide on the same topic. The concept is exam-relevant; the blank form is not.',
    yesVerdict: 'remove',
    noOutcome: 'Reference/study content → safe to include.',
    noVerdict: 'include',
  },
  {
    id: 5,
    question: 'Is this a post-exam, career, or "what next" benefit rather than an exam preparation tool?',
    yesOutcome: 'Move to Support & Mentoring — career guides, interview coaches, and next-cert roadmaps are Gold value-adds, not exam prep.',
    yesVerdict: 'move',
    noOutcome: 'Exam-facing content → safe in Exam Preparation or Active Learning.',
    noVerdict: 'include',
  },
]

export const designTraps: DesignTrap[] = [
  {
    id: 1,
    trap: 'Facilitation format guides',
    badExample: '"Retrospective facilitation formats (4 formats)" — Start/Stop/Continue, 4Ls, etc. are Scrum Master techniques, not Foundation exam topics.',
    fix: 'Replace with a concept study guide: "Scrum events study guide (purpose · timebox · outputs)" — the exam tests what each event IS, not how to facilitate it.',
  },
  {
    id: 2,
    trap: 'Blank templates instead of reference guides',
    badExample: '"Definition of Done templates (10 docs)", "Product backlog templates toolkit (30 docs)" — practitioner artefacts, not exam study material.',
    fix: 'Replace with reference guides: "Definition of Done & Scrum artifacts reference guide". The concept is on the exam; the blank document is not.',
  },
  {
    id: 3,
    trap: 'Adjacent-framework comparison guides',
    badExample: '"Scrum vs Kanban comparison guide" in a Scrum-only exam — Kanban does not appear on the Agile Scrum Foundation syllabus.',
    fix: 'Run every framework or method name in a feature against the official exam topic list. If it is not listed, remove it.',
  },
  {
    id: 4,
    trap: 'Organisational or transformation-level content',
    badExample: '"In-depth Agile transformation case studies" — Foundation exams test team-level Scrum knowledge, not org-change management.',
    fix: 'Replace with team-level application: "Scrum framework in practice case studies". Scope to the team context the exam covers.',
  },
  {
    id: 5,
    trap: '"Workshop" framing when knowledge is what is tested',
    badExample: '"User story writing workshop" — the exam tests what a user story IS as a Product Backlog Item, not how to write one.',
    fix: 'Rename to a study guide: "User stories & Product Backlog Items study guide". Reserve "workshop" for features where active practice is the actual learning goal.',
  },
  {
    id: 6,
    trap: 'Practitioner technique games with no exam overlap',
    badExample: '"Planning poker estimation game (50 stories)" — planning poker is a team estimation ceremony not assessed in Foundation MCQs.',
    fix: 'Replace with an exam-concept quiz: "Story points & sprint metrics practice quiz". Keep games tied to testable exam knowledge.',
  },
  {
    id: 7,
    trap: 'Event roleplay when concept knowledge is what is tested',
    badExample: '"AI Daily Scrum standup roleplay" — Foundation exam asks about Daily Scrum\'s purpose, timebox, and attendees, not how to facilitate one.',
    fix: 'Replace with concept coaching: "AI Scrum concept coach (scenario Q&A)". Roleplay is appropriate at Practitioner level, not Foundation.',
  },
  {
    id: 8,
    trap: 'Post-exam content placed in Exam Preparation or Active Learning',
    badExample: '"CSM/PSM next-level pathway roadmap" under Active Learning — career guidance has no bearing on the Foundation exam.',
    fix: 'Move to Support & Mentoring. Post-certification pathway guides, interview coaches, and next-cert roadmaps are Gold support benefits, not exam prep.',
  },
]

export const tierDesignSpecs: TierSpec[] = [
  {
    tier: 'Bronze',
    positioning: 'Self-directed essentials. For learners with domain background who can study independently. No AI tools, no structured study plan.',
    examPrepProfile: [
      'Simulation exam papers — 2 papers minimum',
      'Question bank — entry-level volume (150–200 Qs)',
      'Core reference cards for every major exam topic cluster (manifesto/principles, framework map, roles & events, glossary)',
      'No AI features, no study plan — those are Silver upgrades',
    ],
    activeLearningSections: 'None. Active Learning simulations and games are a Gold-only differentiator.',
    supportHighlights: [
      'Instructor Q&A session',
      'Email support (24×5)',
      'Progress dashboard, community access, social badge',
      'Cashback (5%)',
    ],
    guarantee: 'No money-back guarantee. No coaching. No retake session.',
  },
  {
    tier: 'Silver',
    positioning: 'Structured prep with AI gap analysis. For learners who want a guided study path and AI-identified weak areas before exam day.',
    examPrepProfile: [
      'Everything in Bronze at higher volume (4 papers, 300+ Qs)',
      'Exam study plan (30/60-day templated)',
      'Mock exam + AI gap report — the key Silver differentiator',
      'One topic-specific study guide per major exam area (events, roles, artifacts, theory, estimation)',
      'Adaptive flashcard system',
      'AI-personalised study plan — excluded (Gold upgrade incentive)',
    ],
    activeLearningSections: 'None. Simulations and games are a Gold-only differentiator.',
    supportHighlights: [
      'Email + chat support (24×5)',
      '1 retake training session (90 days)',
      'EMI / pay-in-parts',
      'Cashback (8%)',
    ],
    guarantee: 'No money-back guarantee. No 1:1 coaching.',
  },
  {
    tier: 'Gold',
    positioning: 'Pass-guaranteed full suite. AI coaching, simulations, 1:1 mentoring, and 100% money-back if the learner does not pass.',
    examPrepProfile: [
      'Everything in Silver at maximum volume (6 papers, 500+ Qs)',
      'AI-personalised study plan + drill mode (upgraded from Silver mock)',
      'Deep-dive reference guides for all exam topic areas',
      'Course-specific case studies scoped to the exam\'s team or domain context',
    ],
    activeLearningSections: 'One game or quiz per major exam topic area. Each must test a specific, named exam concept — not practitioner technique. Formats: scenario sorter, interpretation quiz, concept challenge, decision sorter.',
    supportHighlights: [
      'Email + chat + phone support (24×5)',
      '3 × 1:1 personalised coaching sessions',
      'AI concept coach (scenario Q&A for exam prep)',
      'AI interview coach (career value-add — in Support, not Exam Prep)',
      '2 retake training sessions (180 days)',
      'Post-certification pathways guide (in Support, not Exam Prep)',
      'Cashback (12%)',
    ],
    guarantee: '100% money-back guarantee if the learner does not pass.',
  },
]

// ─── Course Family Differentiation Rule ──────────────────────────────────────

export interface FamilyDifferentiationRequirement {
  id: number
  area: string
  requirement: string
  rationale: string
}

export interface FamilyDifferentiationDiff {
  area: string
  lower: string
  higher: string
}

export interface FamilyDifferentiationCheck {
  id: number
  redFlag: string
  fix: string
}

export const courseFamilyDifferentiation = {
  title: 'Course Family Differentiation Rule',
  whenToApply:
    'Apply when adding any course that belongs to an existing certification family already in the catalogue — Foundation → Practitioner, Foundation → Master, Foundation → Bridge, Yellow → Green → Black Belt, Associate → Professional. Two courses in the same family must look different to a learner comparing them side by side. A higher-level course is never a renamed copy of the lower-level course.',
  requirements: [
    {
      id: 1,
      area: 'Pricing',
      requirement:
        'Each level must have its own price ladder. Higher-level courses are priced 10–20% above the lower-level course at the equivalent tier — never identical, never lower.',
      rationale:
        'A flat price between Foundation and Practitioner suggests they are the same product. Pricing is the first signal of scope, depth, and value differentiation.',
    },
    {
      id: 2,
      area: 'Exam specs',
      requirement:
        'examSpecs must reflect the actual exam — questions, duration, format (MCQ vs Objective Testing), open vs closed book, pass mark, renewal cycle. Never copy specs from the lower-level course.',
      rationale:
        'Foundation is closed-book MCQ; Practitioner is open-book objective testing. Master/Professional levels have longer durations and case-study formats. Specs drive feature design downstream.',
    },
    {
      id: 3,
      area: 'Prerequisite labelling',
      requirement:
        'If a level requires the lower-level certificate, surface it in description, ctaNote, and Bronze tagline. Voucher feature label must name the exact level (e.g. "exam e-voucher — Practitioner", not generic).',
      rationale:
        'Learners must not buy Practitioner without realising Foundation is required. The voucher label is the trustable single source of which exam is bundled.',
    },
    {
      id: 4,
      area: 'Pass-rate signal',
      requirement:
        'passRate string must reflect cohort difficulty for that level. Higher levels typically have lower first-attempt pass rates than the foundational level.',
      rationale:
        'Identical pass rates across a family implies identical exam difficulty, which is misleading. Differentiated rates are honest and inform package value calculations.',
    },
    {
      id: 5,
      area: 'Exam Preparation framing — knowledge vs application',
      requirement:
        'Foundation-level Exam Prep features are framed around KNOWLEDGE (reference cards, study guides, glossary). Practitioner / Master / advanced-level Exam Prep is framed around APPLICATION (scenario reference cards, scenario study guides, scenario question banks). Reference cards and study guides must be re-titled — not copied.',
      rationale:
        'Foundation MCQs test "what is X". Practitioner objective testing tests "given a scenario, which X applies, why, and how to tailor it." The same content authored differently is not the same content.',
    },
    {
      id: 6,
      area: 'Syllabus-unique topics',
      requirement:
        'Every syllabus topic that exists ONLY at the higher level (e.g. Tailoring at PRINCE2® Practitioner; Continuous Improvement at higher Lean Six Sigma belts; advanced statistical tools at Black Belt) must have its own dedicated reference card and study guide. These features must NOT appear at the lower level.',
      rationale:
        'Topic uniqueness is the cleanest evidence of differentiation. A Practitioner course missing a Tailoring deep-dive is incomplete; a Foundation course including one is over-scoped.',
    },
    {
      id: 7,
      area: 'Active Learning shape',
      requirement:
        'Foundation Gold Active Learning uses CONCEPT-Q&A and identification challenges (e.g. "Process input/output identification", AI concept coach). Practitioner / advanced Gold Active Learning escalates to APPLICATION SCENARIOS and Practitioner-level AI roleplay (per Trap #7). Every Active Learning challenge title and scenario count must differ between levels.',
      rationale:
        'Practitioner-level roleplay is explicitly permitted by Trap #7. A Foundation-style "concept coach" duplicated at Practitioner under-uses what the higher exam actually tests.',
    },
    {
      id: 8,
      area: 'Post-certification pathways',
      requirement:
        'The "Post-certification pathways guide" in Gold Support must point to the NEXT logical certification — not the current one. Foundation → Practitioner / Agile. Practitioner → PRINCE2 Agile, P3O. Black Belt → Master Black Belt / role-specific paths.',
      rationale:
        'A Practitioner-level course pointing learners back at Practitioner is broken. The roadmap is the level\'s "what comes next" signal.',
    },
    {
      id: 9,
      area: 'Tier deltas and pricing ladders',
      requirement:
        'Bronze→Silver→Gold delta logic (papers, Q-bank size, AI features, retakes, cashback %) must follow Tier Design Specs at every level — but absolute volumes can step up at higher levels (e.g. Practitioner Gold may carry 5 Active Learning areas vs Foundation Gold\'s 4).',
      rationale:
        'Tier rules are universal; family differentiation lives in absolute scope, not in changing tier semantics. Silver is always the AI-gap-report tier, Gold always carries the money-back guarantee.',
    },
    {
      id: 10,
      area: 'Description and tagline language',
      requirement:
        'Course description, subtitle, Bronze/Silver/Gold taglines, and Gold highlights must use the level\'s native vocabulary. Foundation: "master the framework", "knowledge of". Practitioner: "apply", "tailor", "scenario-based". Master/advanced: "lead", "design", "transform".',
      rationale:
        'Generic copy is the most common giveaway that a higher-level course was scaffolded from the lower-level one. Language is cheap to fix and costly to overlook.',
    },
  ] as FamilyDifferentiationRequirement[],
  workedExample: {
    lowerLevel: 'PRINCE2® Foundation (closed-book MCQ · knowledge)',
    higherLevel: 'PRINCE2® Practitioner (open-book objective testing · application)',
    diffs: [
      { area: 'Pricing (Bronze / Silver / Gold)', lower: '$799 / $1,099 / $1,499', higher: '$899 / $1,249 / $1,699' },
      { area: 'Exam specs', lower: '60 Qs · 60 min · Closed book · MCQ · Indefinite renewal', higher: '70 Qs · 150 min · Open book · Objective testing · 3 yrs renewal' },
      { area: 'Pass-rate signal', lower: '95% Gold first-attempt pass rate', higher: '92% Gold first-attempt pass rate' },
      { area: 'Voucher label', lower: 'PeopleCert exam e-voucher — Foundation', higher: 'PeopleCert exam e-voucher — Practitioner (Foundation prerequisite required)' },
      { area: 'Reference card framing', lower: '"7 Principles quick-reference card"', higher: '"7 Principles application reference card" + "Tailoring quick-reference card" (new at this level)' },
      { area: 'Study guide framing', lower: '"7 Practices study guide"', higher: '"7 Practices scenario study guide" + "Tailoring scenario study guide (project context, scale, complexity)" (new)' },
      { area: 'Question bank', lower: '"PRINCE2® Foundation question bank" (200/300/500 Qs)', higher: '"PRINCE2® Practitioner question bank (scenario-based)" (200/300/500 Qs)' },
      { area: 'Active Learning AI coach', lower: 'AI PRINCE2® concept coach (scenario Q&A)', higher: 'AI PRINCE2® scenario coach (Practitioner-level roleplay) — per Trap #7' },
      { area: 'Active Learning suite', lower: '4 areas · 120+ scenarios (Principles · Process I/O · Roles · Management Products)', higher: '5 areas · 150+ scenarios (Tailoring · Principles · Practices · Processes · Management Products)' },
      { area: 'Gold case studies', lower: '3 Foundation-in-practice case studies', higher: '5 Practitioner-in-practice case studies + Tailoring deep-dive guide' },
      { area: 'Templates toolkit', lower: 'Includes blank templates (25–50 docs)', higher: 'Removed per Trap #2 — replaced with Management Products application reference' },
      { area: 'Post-cert pathways guide', lower: '→ Practitioner, PRINCE2 Agile', higher: '→ PRINCE2 Agile, P3O' },
      { area: 'Open-book strategy', lower: 'Not present (closed-book exam)', higher: 'Open-book exam strategy guide in Support & Mentoring (Silver, Gold)' },
    ] as FamilyDifferentiationDiff[],
  },
  redFlagChecks: [
    {
      id: 1,
      redFlag: 'Two courses in the same family share identical Bronze/Silver/Gold pricing.',
      fix: 'Apply at least a 10% step-up at the higher level (Bronze first, then Silver and Gold proportionally). Reflect saved-amount strings accordingly.',
    },
    {
      id: 2,
      redFlag: 'Reference card and study guide titles are character-for-character identical between Foundation and Practitioner.',
      fix: 'Re-title with the higher level\'s framing (Foundation: "study guide" / "quick-reference"; Practitioner: "scenario study guide" / "application reference card"). The content underneath must also be authored to the level — same title is a tell that the content was not.',
    },
    {
      id: 3,
      redFlag: 'Active Learning section is the same shape (same titles, same scenario counts) at Foundation and Practitioner.',
      fix: 'Practitioner Active Learning swaps "concept coach" for "Practitioner-level roleplay" (Trap #7), adds Tailoring as a fifth area, and uses application-style challenge titles ("which practice applies?", "selection challenge", "scenario walkthrough").',
    },
    {
      id: 4,
      redFlag: 'examSpecs object is copied between courses in the family.',
      fix: 'Look up the actual PeopleCert / awarding-body specs for the level. Open-book vs closed-book and renewal policy almost always differ.',
    },
    {
      id: 5,
      redFlag: 'Higher-level course is missing a syllabus topic that exists ONLY at that level (e.g. Tailoring at PRINCE2® Practitioner, MSA / DOE at Lean Six Sigma Black Belt).',
      fix: 'Add a dedicated reference card AND study guide for every level-unique syllabus topic. Confirm against the official syllabus, not against the lower-level course feature list.',
    },
    {
      id: 6,
      redFlag: 'Post-certification pathways guide in Gold points back at the same level (e.g. Practitioner course pointing to "Practitioner").',
      fix: 'Update the pathway to the next certification in the family or an adjacent specialism (Practitioner → PRINCE2 Agile, P3O; Black Belt → Master Black Belt).',
    },
    {
      id: 7,
      redFlag: 'Course description and Gold highlights use generic verbs ("master", "learn") rather than level-native verbs.',
      fix: 'Foundation = "master the framework". Practitioner = "apply", "tailor", "scenario". Master/advanced = "lead", "design", "transform". Voice differentiation is non-negotiable.',
    },
  ] as FamilyDifferentiationCheck[],
}

// ─── Catalogue Information Architecture (Sidebar Nesting) ────────────────────

export interface CatalogueIaRule {
  id: number
  rule: string
  rationale: string
}

export interface CatalogueIaMapping {
  parentId: string
  parentTitle: string
  childIds: string[]
  childTitles: string[]
}

export const catalogueIa = {
  title: 'Catalogue IA — Combo Course Nesting',
  whenToApply:
    'Apply whenever the catalogue contains a combo course (a single SKU that bundles two related certification levels — typically "Foundation & Practitioner") AND the standalone single-level courses also exist as separate SKUs. The combo course is the canonical parent in the sidebar; the standalone levels are visually nested under it.',
  rules: [
    {
      id: 1,
      rule: 'Combo course = parent. Any course whose title contains "Foundation & Practitioner" (or any equivalent X & Y bundle wording) is the parent SKU and renders at the top level of the sidebar with no indent.',
      rationale:
        'The combo is what most learners first land on commercially — it is the headline product. Treating it as the parent matches search-intent and merch hierarchy.',
    },
    {
      id: 2,
      rule: 'Standalone single-level courses nest under the matching combo. The standalone Foundation and standalone Practitioner courses for the same family render indented one level under their combo, in level order (Foundation first, Practitioner second).',
      rationale:
        'Nesting communicates that the standalones are alternative purchase paths within the same family — not separate products in the catalogue. Foundation-first ordering matches the learner journey.',
    },
    {
      id: 3,
      rule: 'Slug / id naming convention is fixed. Combo: <family>-fp (or the family\'s natural combo slug e.g. "prince2"). Children: <family>-foundation and <family>-practitioner. The Sidebar COMBO_CHILDREN map keys on the combo id and lists the two child ids.',
      rationale:
        'A stable, predictable id scheme is the only way the sidebar nesting map stays in sync with courses.ts as new families are added. No bespoke ids.',
    },
    {
      id: 4,
      rule: 'Register every combo family in COMBO_CHILDREN inside Sidebar.tsx the moment its third sibling (the standalone level) is added. Do not ship a Practitioner standalone course for an existing combo family without also adding/updating the mapping in the same change.',
      rationale:
        'A child that exists in courses.ts but is not in COMBO_CHILDREN renders flat at the top level — breaking the nesting promise the IA is making to learners.',
    },
    {
      id: 5,
      rule: 'Do not nest unrelated cert levels. Different products that happen to share a brand (e.g. "PRINCE2® Foundation" vs "PRINCE2 Agile® Foundation") are separate families and stay top-level. Only the matching combo and its two single-level siblings nest together.',
      rationale:
        'PRINCE2 and PRINCE2 Agile are different syllabi from different awarding-body tracks. Nesting them under one parent would mislead learners about prerequisite chains and exam scope.',
    },
    {
      id: 6,
      rule: 'Category filter respects the parent. When the user filters by category (PM, Agile, etc.), children render only if their parent renders. Combo parents and their children share the same courseCategory by definition, so this is the natural behaviour — do not special-case it.',
      rationale:
        'Showing an orphaned child without its parent breaks the IA. Since combo parents and children always share a category, the simple "parent gates children" rule needs no exceptions.',
    },
    {
      id: 7,
      rule: 'Visual indent uses a left border-line, smaller dot, and slightly smaller text. Children sit at pl-6 with a vertical border-l guide; the category dot is w-1 h-1 (vs w-1.5 h-1.5 on parents); title text is text-[13px] (vs text-sm).',
      rationale:
        'A consistent visual treatment lets learners scan the catalogue at a glance. The difference must be visible but not noisy — full indent + colour is too much.',
    },
    {
      id: 8,
      rule: 'Custom (user-created) courses never have children and never nest. They render flat at the top level with the existing Custom badge.',
      rationale:
        'Nesting is a curated catalogue concern; ad-hoc custom courses are scratch space and should not pretend to be part of a family hierarchy.',
    },
  ] as CatalogueIaRule[],
  mappings: [
    {
      parentId: 'prince2',
      parentTitle: 'PRINCE2® Foundation & Practitioner',
      childIds: ['prince2-foundation', 'prince2-practitioner'],
      childTitles: ['PRINCE2® Foundation Certification Training', 'PRINCE2® Practitioner Certification Training'],
    },
    {
      parentId: 'cm-fp',
      parentTitle: 'Change Management Foundation & Practitioner (APMG)',
      childIds: ['cm-foundation', 'cm-practitioner'],
      childTitles: ['Change Management Foundation (APMG)', 'Change Management Practitioner (APMG)'],
    },
    {
      parentId: 'business-analysis-fp',
      parentTitle: 'Business Analysis Foundation & Practitioner',
      childIds: ['business-analysis-foundation', 'business-analysis-practitioner'],
      childTitles: ['Business Analysis Foundation', 'Business Analysis Practitioner'],
    },
    {
      parentId: 'agile-pm-fp',
      parentTitle: 'Agile PM Foundation & Practitioner (APMG)',
      childIds: ['agile-pm-foundation', 'agile-pm-practitioner'],
      childTitles: ['Agile PM Foundation (APMG)', 'Agile PM Practitioner (APMG)'],
    },
    {
      parentId: 'prince2-agile-fp',
      parentTitle: 'PRINCE2 Agile® Foundation & Practitioner',
      childIds: ['prince2-agile-foundation', 'prince2-agile-practitioner'],
      childTitles: ['PRINCE2 Agile® Foundation', 'PRINCE2 Agile® Practitioner'],
    },
  ] as CatalogueIaMapping[],
  newFamilyChecklist: [
    'Add the combo course (id ending in -fp or the family\'s canonical combo slug) with full Bronze/Silver/Gold packages.',
    'Add the standalone Foundation course (id ending in -foundation) with full packages following Tier Design Specs.',
    'Add the standalone Practitioner course (id ending in -practitioner) with full packages following the Course Family Differentiation Rule.',
    'Register the family in COMBO_CHILDREN inside Sidebar.tsx — key = combo id, value = [foundation id, practitioner id].',
    'Append a row to the mappings table on this rules page so it stays the single source of truth for the IA.',
    'Verify in /courses that the two standalones render indented under the combo, with the left border-line, smaller dot, and 13px title.',
  ],
}

// ─── Combo Course Packaging Rule ─────────────────────────────────────────────

export interface ComboPackagingRule {
  id: number
  rule: string
  rationale: string
}

export interface ComboPricingRow {
  tier: 'Bronze' | 'Silver' | 'Gold'
  formula: string
  example: string
}

export interface ComboSectionRow {
  section: string
  shape: string
  notes: string
}

export const comboCoursePackaging = {
  title: 'Combo Course Packaging Rule',
  whenToApply:
    'Apply when building Bronze/Silver/Gold packages for any combo course (a single SKU bundling two related certification levels — typically Foundation & Practitioner). The combo course must carry both standalones\' content side by side, save the learner real money vs buying separately, and pass every existing rule (categorization, exam alignment, tier design, family differentiation) at both levels simultaneously.',
  rules: [
    {
      id: 1,
      rule: 'Pricing must beat sum-of-standalones at every tier. Bundle saving = sum of standalone `original` MSRPs minus combo `amount`. Bronze saving ≥ $500, Silver ≥ $750, Gold ≥ $1,000 — escalating savings are how the bundle earns its place.',
      rationale:
        'A combo priced at or above the sum of its standalones is broken — there is no reason for a learner to choose it. The savings line is the most prominent value signal.',
    },
    {
      id: 2,
      rule: 'Both vouchers carried with explicit level labels in Core Training. Two distinct features: "exam e-voucher — Foundation" and "exam e-voucher — Practitioner". Never collapse them into a single ambiguous "Both vouchers included" feature row.',
      rationale:
        'Learners need to see at a glance that they are getting both attempts. Per Family Rule F3, voucher labelling is the single trustable source of which exams are bundled.',
    },
    {
      id: 3,
      rule: 'Live training duration sums both standalones. PRINCE2 example: 16 hrs F + 16 hrs P = 32 hrs. State the breakdown inline ("32 hrs · 16 F + 16 P") so the bundle is legible.',
      rationale:
        'A combo Bronze with the same training hours as a standalone Bronze suggests the second exam is unsupported. The breakdown removes that doubt.',
    },
    {
      id: 4,
      rule: 'Exam Preparation splits into two named sub-sections — "Exam Preparation — Foundation" (knowledge framing per Family Rule F5) and "Exam Preparation — Practitioner" (application/scenario framing). Do not merge into one section.',
      rationale:
        'A merged section forces the reader to mentally untangle which features are for which exam. Two named sub-sections honour the differentiation rule and let the learner audit each level independently.',
    },
    {
      id: 5,
      rule: 'Question bank and simulation paper counts are stated per level, not summed. List each level\'s bank at the same volume the standalone offers (Bronze: 200 + 200, Silver: 300 + 300, Gold: 500 + 500) so a learner can compare standalone vs combo apples-to-apples.',
      rationale:
        'Summing ("400 Qs") looks larger but hides which level is covered. Per-level counts are honest and let learners verify the combo doesn\'t shortchange either exam.',
    },
    {
      id: 6,
      rule: 'Reference cards and study guides come from BOTH standalones, kept distinct. Foundation cards use knowledge framing ("7 Principles quick-reference card"); Practitioner cards use application framing ("7 Principles application reference card"). Both exist in the combo — never merged into one ambiguous card.',
      rationale:
        'Foundation MCQs test "what is X"; Practitioner objective testing tests "given a scenario, which X applies, why, and how to tailor it." A single card cannot do both jobs.',
    },
    {
      id: 7,
      rule: 'Level-unique syllabus topics from BOTH standalones must appear. Tailoring (Practitioner-only) carries through with its quick-reference card and scenario study guide; Foundation-specific items (e.g. 7th Ed key changes guide) carry through too. Per Family Rule F6, the combo cannot drop a level-unique topic.',
      rationale:
        'A combo missing Tailoring is not really a Practitioner course; one missing the Foundation key-changes guide is not really a Foundation course. The combo must be a strict superset.',
    },
    {
      id: 8,
      rule: 'Glossary and other genuinely shared assets are listed once, marked "(shared)". Anything that differs per level — even by framing — must be listed twice with the level tag.',
      rationale:
        'Listing the glossary twice is filler; listing two distinct reference cards is differentiation. The "(shared)" tag is the explicit signal for genuine reuse.',
    },
    {
      id: 9,
      rule: 'AI tools live in a single "Shared AI & Adaptive Tools" sub-section in Silver and Gold. AI study planner, mock + AI gap report, and adaptive flashcards apply across BOTH levels — flashcard volumes state the breakdown ("400 cards · 200 F + 200 P").',
      rationale:
        'AI tools genuinely span both exams (one personalised plan for the whole journey, one gap report from any mock). A shared sub-section keeps them out of the level-specific Exam Prep blocks.',
    },
    {
      id: 10,
      rule: 'Active Learning at Gold carries challenges from BOTH standalones. Combo Gold must include Foundation-flavour items (AI concept coach for scenario Q&A, identification challenges) AND Practitioner-flavour items (AI scenario roleplay coach, application sorters, Tailoring scenarios). Target ≥ 8 challenges and ≥ 250 scenarios — heavier than either standalone Gold.',
      rationale:
        'Per Family Rule F7, Foundation roleplay is forbidden (Trap #7) but concept coach is appropriate; Practitioner-level roleplay is permitted. The combo gets both because the learner takes both exams.',
    },
    {
      id: 11,
      rule: 'Coaching count stays at 3 × 1:1 at Gold but is sequenced F → P → flex. Note the sequencing inline in the feature name and highlight; do not double the count to 6.',
      rationale:
        'Coaching is human-delivered and time-boxed; doubling looks generous but bloats the SKU. Sequencing across both certs adds value where it matters — orientation per level — without scaling cost linearly.',
    },
    {
      id: 12,
      rule: 'Retake covers either exam, stated explicitly. Silver: "1 retake · 90 days · either exam". Gold: "2 retakes · 180 days · either exam". A combo learner failing only Practitioner must be able to retake just that exam.',
      rationale:
        'Without the "either exam" qualifier, learners assume they\'d have to re-sit Foundation (which they\'ve already passed) to use the retake — wrong and unfair.',
    },
    {
      id: 13,
      rule: 'Money-back guarantee at Gold reads "if you don\'t pass either exam". Highlight text and Support feature row both carry the explicit either-exam framing.',
      rationale:
        'Ambiguity here is the most expensive kind. "If you don\'t pass" without "either exam" creates a refund dispute the moment a learner passes one and fails the other.',
    },
    {
      id: 14,
      rule: 'Open-book exam strategy guide lives in Support & Mentoring (per Exam Alignment Q1 outcome) for Silver and Gold — same as the standalone Practitioner course.',
      rationale:
        'Open-book is a Practitioner-only concern; Foundation is closed-book. Already in the standalone Practitioner Support section, so it carries through unchanged in the combo.',
    },
    {
      id: 15,
      rule: 'Post-cert pathways guide points beyond the combo. After F+P, the next steps are "PRINCE2 Agile, P3O" — never back to "Practitioner". Match the standalone Practitioner course\'s pathway, not the standalone Foundation\'s.',
      rationale:
        'A combo learner has finished the F+P track. Pointing them at Practitioner is a dead end. Per Family Rule F8, pathways must point to the genuine next step.',
    },
    {
      id: 16,
      rule: 'examSpecs are dual-format. Each spec row states both levels: "F: 60 Qs · P: 70 Qs", "F: Closed · P: Open". A combo cannot copy specs from one standalone — it must show both.',
      rationale:
        'Per Family Rule F2, exam specs reflect actual exams. A combo lists both because the learner sits both. Copying Foundation specs hides Practitioner\'s open-book reality.',
    },
    {
      id: 17,
      rule: 'Pass-rate string carries both levels. Format: "95% Foundation · 92% Practitioner first-attempt pass rate (Gold)". Differentiated rates honour cohort difficulty per Family Rule F4.',
      rationale:
        'A single pass-rate number for a combo implies one cohort statistic for two different exams. Splitting them is honest and informs which level needs more effort.',
    },
  ] as ComboPackagingRule[],
  pricingTable: [
    { tier: 'Bronze', formula: 'Combo amount ≤ (sum of standalone amounts) − $200', example: 'PRINCE2 F+P Bronze: $1,499 vs sum $1,698 → save $199 (combo · vs paid sum). Original (MSRP): $2,098. Saving line shows $599 vs MSRP.' },
    { tier: 'Silver', formula: 'Combo amount ≤ (sum of standalone amounts) − $350', example: 'PRINCE2 F+P Silver: $1,999 vs sum $2,348 → save $349 (combo · vs paid sum). Original: $2,848. Saving line shows $849 vs MSRP.' },
    { tier: 'Gold',   formula: 'Combo amount ≤ (sum of standalone amounts) − $500', example: 'PRINCE2 F+P Gold: $2,699 vs sum $3,198 → save $499 (combo · vs paid sum). Original: $3,998. Saving line shows $1,299 vs MSRP.' },
  ] as ComboPricingRow[],
  sectionShape: [
    { section: 'Core Training Delivery', shape: 'Single section. Both vouchers as separate rows. Live training hours state F + P breakdown.', notes: 'Used at all 3 tiers' },
    { section: 'Exam Preparation — Foundation', shape: 'Bronze: papers + Q-bank + 3 reference cards + glossary. Silver/Gold: + dimension study guides, management products reference, performance targets card. Gold: + case studies, key changes guide.', notes: 'Knowledge framing per Family Rule F5' },
    { section: 'Exam Preparation — Practitioner', shape: 'Bronze: scenario papers + scenario Q-bank + 5 application reference cards (incl. Tailoring). Silver/Gold: + scenario study guides for all dimensions incl. Tailoring + management products application reference. Gold: + case studies, tailoring deep-dive guide.', notes: 'Application framing per Family Rule F5' },
    { section: 'Shared AI & Adaptive Tools', shape: 'Silver: AI study planner + mock + gap report + adaptive flashcards (sum of cards). Gold: AI-personalised plan + drill mode + premium flashcards.', notes: 'Silver/Gold only — Bronze has no AI per Tier Spec' },
    { section: 'Active Learning — Scenario Simulations', shape: '8 challenges, 250+ scenarios. Both AI coaches (Foundation concept + Practitioner roleplay) + sorters spanning both levels.', notes: 'Gold only · heavier than either standalone Gold' },
    { section: 'Expert Support & Mentoring (Gold) / Support & Value (Bronze, Silver)', shape: 'Standard support stack. Coaching = 3 × 1:1 sequenced F → P → flex. Retake = "either exam". Money-back = "either exam". Pathways → PRINCE2 Agile, P3O.', notes: 'Either-exam qualifiers required' },
  ] as ComboSectionRow[],
  redFlagChecks: [
    { id: 1, redFlag: 'Combo `amount` is greater than or equal to the sum of standalone `amount`s at any tier.', fix: 'Reprice combo below sum-of-standalones with escalating savings (Bronze ≥ $200, Silver ≥ $350, Gold ≥ $500). Combo must always be cheaper than buying separately.' },
    { id: 2, redFlag: 'A single ambiguous voucher feature: "Both PeopleCert vouchers included" or generic "Exam voucher".', fix: 'Two rows: "PeopleCert exam e-voucher — Foundation (Included)" and "PeopleCert exam e-voucher — Practitioner (Included)".' },
    { id: 3, redFlag: 'Exam Preparation is one merged section instead of two named sub-sections.', fix: 'Split into "Exam Preparation — Foundation" and "Exam Preparation — Practitioner". Knowledge vs application framing must be visible.' },
    { id: 4, redFlag: 'Question bank counts are summed ("400 Qs") instead of stated per level.', fix: 'List per-level counts at standalone-equivalent volumes ("Foundation 200 Qs" + "Practitioner 200 Qs scenario-based").' },
    { id: 5, redFlag: 'A level-unique topic is missing — e.g. Tailoring quick-reference card or Tailoring scenario study guide is absent from the combo.', fix: 'Carry through every level-unique syllabus topic from both standalones. The combo is a strict superset, never a trim.' },
    { id: 6, redFlag: 'Active Learning at Gold has fewer than 8 challenges or only Foundation-style or only Practitioner-style items.', fix: 'Include both AI coaches (Foundation concept + Practitioner roleplay) and sorters from both levels. Target ≥ 8 challenges, ≥ 250 scenarios.' },
    { id: 7, redFlag: 'Retake feature reads "1 retake training session" with no qualifier.', fix: 'Add "either exam" — "Retake training session · 1 · 90 days · either exam". Same for Gold\'s 2 retakes.' },
    { id: 8, redFlag: 'Money-back highlight reads "if you don\'t pass" with no exam qualifier.', fix: 'Rewrite to "if you don\'t pass either exam" in both highlight and Support feature row.' },
    { id: 9, redFlag: 'Post-cert pathways guide points to "Practitioner" or back at the family\'s own combo.', fix: 'Update to the genuine next step in the family — for PRINCE2: "PRINCE2 Agile, P3O".' },
    { id: 10, redFlag: 'examSpecs copied from Foundation or Practitioner alone instead of dual-format.', fix: 'Each spec value uses "F: <foundation> · P: <practitioner>" format. If a spec is genuinely identical (e.g. Pass mark 60% both), state "60% (both levels)".' },
    { id: 11, redFlag: 'Coaching at Gold inflated to 6 × 1:1 (one set per cert).', fix: 'Keep at 3 × 1:1 with sequencing tag "(F → P → flex)". The bundle\'s value is in content breadth and exam coverage, not coaching count.' },
    { id: 12, redFlag: 'A "Templates toolkit (X docs)" feature appears anywhere in the combo.', fix: 'Drop entirely per Trap #2 — replace with management products application reference. Blank templates aren\'t exam study material at either level.' },
  ],
}
