import { categories, decisionFlow, disambiguationRules, keywordIndicators, examAlignmentQuestions, designTraps, tierDesignSpecs, courseFamilyDifferentiation, catalogueIa, comboCoursePackaging } from '@/data/rules'
import CategoryTag from '@/components/CategoryTag'
import type { FeatureCategory } from '@/types'

const categoryBg: Record<string, string> = {
  info: 'bg-indigo-50 border-indigo-200',
  static: 'bg-amber-50 border-amber-200',
  ai: 'bg-violet-50 border-violet-200',
}

export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-10 space-y-14">
      {/* Header */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-ink3 mb-2">Reference</p>
        <h1 className="font-display text-4xl font-semibold text-ink mb-3">
          Feature Categorization Rules
        </h1>
        <p className="text-ink2 text-base leading-relaxed max-w-2xl">
          A deterministic way to bucket every Invensis Learning course feature into one of three
          build categories — used for LMS scoping, sprint planning, and product roadmap decisions.
        </p>
      </div>

      {/* Three categories */}
      <section>
        <h2 className="font-display text-2xl font-semibold text-ink mb-5">The Three Categories</h2>
        <div className="space-y-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`rounded-xl border p-6 ${categoryBg[cat.slug]}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs text-ink3">{cat.id}</span>
                <CategoryTag category={cat.slug as FeatureCategory} size="sm" />
                <span className="font-display text-lg font-semibold text-ink">{cat.name}</span>
              </div>
              <p className="text-sm text-ink2 italic mb-3">{cat.tagline}</p>
              <p className="text-sm text-ink2 mb-4">{cat.definition}</p>
              <ul className="space-y-1">
                {cat.includes.map((item, i) => (
                  <li key={i} className="text-sm text-ink2 flex gap-2">
                    <span className="text-ink3 shrink-0">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-mono text-ink3 bg-white/60 rounded px-3 py-1.5 inline-block">
                Build cost: {cat.buildCost}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Decision flow */}
      <section>
        <h2 className="font-display text-2xl font-semibold text-ink mb-5">The Decision Flow</h2>
        <p className="text-sm text-ink2 mb-6">
          Apply these two questions in order. The first YES answer determines the category.
        </p>
        <div className="space-y-4">
          {decisionFlow.map((step) => (
            <div key={step.step} className="rounded-xl border border-border bg-white p-6">
              <div className="flex gap-4">
                <div className="shrink-0 font-mono text-sm font-bold text-ink3 w-8">{step.step}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink mb-4">{step.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
                      <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">YES →</span>
                      <p className="text-sm font-semibold text-emerald-800 mt-1">{step.yes.result}</p>
                      {step.yes.stop && (
                        <p className="text-xs text-emerald-600 mt-0.5">Stop.</p>
                      )}
                    </div>
                    <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">NO →</span>
                      {'next' in step.no ? (
                        <p className="text-sm font-semibold text-slate-700 mt-1">Continue to {step.no.next}</p>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-slate-700 mt-1">{(step.no as { result: string }).result}</p>
                          {'note' in step.no && (
                            <p className="text-xs text-slate-500 mt-0.5">{(step.no as { note: string }).note}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disambiguation rules */}
      <section>
        <h2 className="font-display text-2xl font-semibold text-ink mb-2">Disambiguation Rules</h2>
        <p className="text-sm text-ink2 mb-6">Edge cases that trip people up, resolved definitively.</p>
        <div className="space-y-3">
          {disambiguationRules.map((rule) => (
            <div key={rule.id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex gap-4">
                <span className="shrink-0 font-mono text-sm font-bold text-ink3 w-8">R{rule.id}</span>
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">{rule.question}</p>
                  <p className="text-sm text-ink2 leading-relaxed">{rule.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Keyword indicators */}
      <section>
        <h2 className="font-display text-2xl font-semibold text-ink mb-2">Keyword Indicators</h2>
        <p className="text-sm text-ink2 mb-6">
          First-pass shortcuts — confirm with the decision flow when in doubt.
        </p>
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-paper">
                <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-ink3">Keyword in feature name</th>
                <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-ink3">Most likely category</th>
              </tr>
            </thead>
            <tbody>
              {keywordIndicators.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-paper/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-ink2">{row.keyword}</td>
                  <td className="px-5 py-3">
                    <CategoryTag category={row.category as FeatureCategory} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Course Feature Design Rules ─────────────────────────── */}
      <div className="border-t-2 border-border pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-ink3 mb-2">Course Feature Design</p>
        <h2 className="font-display text-3xl font-semibold text-ink mb-3">
          Course Feature Design Rules
        </h2>
        <p className="text-ink2 text-base leading-relaxed max-w-2xl">
          How to build a feature list for any new certification course. Apply these rules before writing a single feature name.
        </p>
      </div>

      {/* Exam Alignment Test */}
      <section>
        <h3 className="font-display text-xl font-semibold text-ink mb-2">Exam Alignment Test</h3>
        <p className="text-sm text-ink2 mb-6">
          Run every proposed Exam Preparation feature through these five questions in order. One YES answer that yields "remove" or "move" stops evaluation.
        </p>
        <div className="space-y-4">
          {examAlignmentQuestions.map((q) => {
            const verdictColour = {
              include: { yes: 'bg-emerald-50 border-emerald-200 text-emerald-800', no: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
              move:    { yes: 'bg-amber-50 border-amber-200 text-amber-800',   no: 'bg-amber-50 border-amber-200 text-amber-800' },
              remove:  { yes: 'bg-red-50 border-red-200 text-red-800',         no: 'bg-red-50 border-red-200 text-red-800' },
            }
            const yesColour = verdictColour[q.yesVerdict].yes
            const noColour  = verdictColour[q.noVerdict].no
            return (
              <div key={q.id} className="rounded-xl border border-border bg-white p-6">
                <div className="flex gap-4">
                  <div className="shrink-0 font-mono text-sm font-bold text-ink3 w-8">Q{q.id}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink mb-4">{q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className={`rounded-lg border px-4 py-3 ${yesColour}`}>
                        <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-70">YES →</span>
                        <p className="text-sm mt-1 leading-snug">{q.yesOutcome}</p>
                      </div>
                      <div className={`rounded-lg border px-4 py-3 ${noColour}`}>
                        <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-70">NO →</span>
                        <p className="text-sm mt-1 leading-snug">{q.noOutcome}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Common Design Traps */}
      <section>
        <h3 className="font-display text-xl font-semibold text-ink mb-2">Common Design Traps</h3>
        <p className="text-sm text-ink2 mb-6">
          Mistakes that recur when building course feature lists — each with a concrete example and the correct fix.
        </p>
        <div className="space-y-3">
          {designTraps.map((trap) => (
            <div key={trap.id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex gap-4">
                <span className="shrink-0 font-mono text-sm font-bold text-ink3 w-8">T{trap.id}</span>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-semibold text-ink">{trap.trap}</p>
                  <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                    <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-wider">Bad example</span>
                    <p className="text-xs text-red-800 mt-0.5 leading-relaxed">{trap.badExample}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                    <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider">Fix</span>
                    <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">{trap.fix}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tier Design Specs */}
      <section>
        <h3 className="font-display text-xl font-semibold text-ink mb-2">Tier Design Specifications</h3>
        <p className="text-sm text-ink2 mb-6">
          What each tier must contain. Use this as a checklist when scaffolding a new course.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {tierDesignSpecs.map((spec) => {
            const tierStyle: Record<string, string> = {
              Bronze: 'border-amber-300 bg-amber-50',
              Silver: 'border-slate-300 bg-slate-50',
              Gold:   'border-yellow-300 bg-yellow-50',
            }
            const badgeStyle: Record<string, string> = {
              Bronze: 'bg-amber-200 text-amber-900',
              Silver: 'bg-slate-200 text-slate-900',
              Gold:   'bg-yellow-200 text-yellow-900',
            }
            return (
              <div key={spec.tier} className={`rounded-xl border-2 p-5 space-y-4 ${tierStyle[spec.tier]}`}>
                <div>
                  <span className={`inline-block text-xs font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2 ${badgeStyle[spec.tier]}`}>
                    {spec.tier}
                  </span>
                  <p className="text-xs text-ink2 leading-relaxed">{spec.positioning}</p>
                </div>

                <div>
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-ink3 mb-1.5">Exam Prep</p>
                  <ul className="space-y-1">
                    {spec.examPrepProfile.map((item, i) => (
                      <li key={i} className="text-xs text-ink2 flex gap-1.5">
                        <span className="text-ink3 shrink-0 mt-0.5">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-ink3 mb-1.5">Active Learning</p>
                  <p className="text-xs text-ink2 leading-relaxed">{spec.activeLearningSections}</p>
                </div>

                <div>
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-ink3 mb-1.5">Support</p>
                  <ul className="space-y-1">
                    {spec.supportHighlights.map((item, i) => (
                      <li key={i} className="text-xs text-ink2 flex gap-1.5">
                        <span className="text-ink3 shrink-0 mt-0.5">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-white/70 px-3 py-2">
                  <p className="text-xs font-mono text-ink3">{spec.guarantee}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Course Family Differentiation Rule */}
      <section>
        <h3 className="font-display text-xl font-semibold text-ink mb-2">{courseFamilyDifferentiation.title}</h3>
        <p className="text-sm text-ink2 mb-6 leading-relaxed">{courseFamilyDifferentiation.whenToApply}</p>

        {/* Requirements */}
        <div className="space-y-3 mb-8">
          {courseFamilyDifferentiation.requirements.map((req) => (
            <div key={req.id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex gap-4">
                <span className="shrink-0 font-mono text-sm font-bold text-ink3 w-8">F{req.id}</span>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink3">{req.area}</span>
                  </div>
                  <p className="text-sm font-medium text-ink leading-snug">{req.requirement}</p>
                  <p className="text-xs text-ink2 leading-relaxed italic">Why: {req.rationale}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Worked example: Foundation vs Practitioner */}
        <div className="rounded-xl border-2 border-border bg-paper p-6 mb-8">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-ink3 mb-3">Worked example</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="rounded-lg bg-white border border-border px-4 py-3">
              <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">Lower level</span>
              <p className="text-sm font-semibold text-ink mt-0.5">{courseFamilyDifferentiation.workedExample.lowerLevel}</p>
            </div>
            <div className="rounded-lg bg-white border border-border px-4 py-3">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">Higher level</span>
              <p className="text-sm font-semibold text-ink mt-0.5">{courseFamilyDifferentiation.workedExample.higherLevel}</p>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-white overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-paper">
                  <th className="text-left px-4 py-2 font-mono uppercase tracking-widest text-ink3">Area</th>
                  <th className="text-left px-4 py-2 font-mono uppercase tracking-widest text-ink3">Lower</th>
                  <th className="text-left px-4 py-2 font-mono uppercase tracking-widest text-ink3">Higher</th>
                </tr>
              </thead>
              <tbody>
                {courseFamilyDifferentiation.workedExample.diffs.map((d, i) => (
                  <tr key={i} className="border-b border-border last:border-0 align-top">
                    <td className="px-4 py-2 font-medium text-ink whitespace-nowrap">{d.area}</td>
                    <td className="px-4 py-2 text-ink2 leading-snug">{d.lower}</td>
                    <td className="px-4 py-2 text-ink2 leading-snug">{d.higher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Red-flag checks */}
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-ink3 mb-3">Red-flag checks</p>
        <div className="space-y-3">
          {courseFamilyDifferentiation.redFlagChecks.map((check) => (
            <div key={check.id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex gap-4">
                <span className="shrink-0 font-mono text-sm font-bold text-ink3 w-8">C{check.id}</span>
                <div className="flex-1 space-y-2">
                  <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                    <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-wider">Red flag</span>
                    <p className="text-xs text-red-800 mt-0.5 leading-relaxed">{check.redFlag}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                    <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider">Fix</span>
                    <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">{check.fix}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Catalogue IA — Combo Course Nesting */}
      <section>
        <h3 className="font-display text-xl font-semibold text-ink mb-2">{catalogueIa.title}</h3>
        <p className="text-sm text-ink2 mb-6 leading-relaxed">{catalogueIa.whenToApply}</p>

        {/* Rules */}
        <div className="space-y-3 mb-8">
          {catalogueIa.rules.map((rule) => (
            <div key={rule.id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex gap-4">
                <span className="shrink-0 font-mono text-sm font-bold text-ink3 w-8">N{rule.id}</span>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-ink leading-snug">{rule.rule}</p>
                  <p className="text-xs text-ink2 leading-relaxed italic">Why: {rule.rationale}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current mappings */}
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-ink3 mb-3">Current combo families</p>
        <div className="rounded-xl border border-border bg-white overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-paper">
                <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-ink3">Combo (parent)</th>
                <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-ink3">Nested children</th>
              </tr>
            </thead>
            <tbody>
              {catalogueIa.mappings.map((m) => (
                <tr key={m.parentId} className="border-b border-border last:border-0 align-top">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-ink">{m.parentTitle}</p>
                    <p className="text-xs font-mono text-ink3 mt-0.5">{m.parentId}</p>
                  </td>
                  <td className="px-5 py-3">
                    <ul className="space-y-1">
                      {m.childTitles.map((title, i) => (
                        <li key={i} className="text-sm text-ink2 flex gap-2">
                          <span className="text-ink3 shrink-0">└</span>
                          <span>
                            {title}
                            <span className="ml-2 text-xs font-mono text-ink3">{m.childIds[i]}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* New family checklist */}
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-ink3 mb-3">When adding a new family</p>
        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5">
          <ol className="space-y-2 list-decimal list-inside">
            {catalogueIa.newFamilyChecklist.map((step, i) => (
              <li key={i} className="text-sm text-emerald-900 leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* Combo Course Packaging Rule */}
      <section>
        <h3 className="font-display text-xl font-semibold text-ink mb-2">{comboCoursePackaging.title}</h3>
        <p className="text-sm text-ink2 mb-6 leading-relaxed">{comboCoursePackaging.whenToApply}</p>

        {/* Rules */}
        <div className="space-y-3 mb-8">
          {comboCoursePackaging.rules.map((rule) => (
            <div key={rule.id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex gap-4">
                <span className="shrink-0 font-mono text-sm font-bold text-ink3 w-8">B{rule.id}</span>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-ink leading-snug">{rule.rule}</p>
                  <p className="text-xs text-ink2 leading-relaxed italic">Why: {rule.rationale}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing table */}
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-ink3 mb-3">Pricing formula</p>
        <div className="rounded-xl border border-border bg-white overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-paper">
                <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-ink3">Tier</th>
                <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-ink3">Formula</th>
                <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-ink3">Worked example (PRINCE2 F+P)</th>
              </tr>
            </thead>
            <tbody>
              {comboCoursePackaging.pricingTable.map((row) => (
                <tr key={row.tier} className="border-b border-border last:border-0 align-top">
                  <td className="px-5 py-3 font-medium text-ink whitespace-nowrap">{row.tier}</td>
                  <td className="px-5 py-3 text-ink2 leading-snug">{row.formula}</td>
                  <td className="px-5 py-3 text-ink2 leading-snug">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section shape */}
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-ink3 mb-3">Section shape</p>
        <div className="rounded-xl border border-border bg-white overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-paper">
                <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-ink3">Section</th>
                <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-ink3">Shape</th>
                <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-ink3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {comboCoursePackaging.sectionShape.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0 align-top">
                  <td className="px-5 py-3 font-medium text-ink leading-snug">{row.section}</td>
                  <td className="px-5 py-3 text-ink2 leading-snug">{row.shape}</td>
                  <td className="px-5 py-3 text-xs font-mono text-ink3 whitespace-nowrap">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Red-flag checks */}
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-ink3 mb-3">Red-flag checks</p>
        <div className="space-y-3">
          {comboCoursePackaging.redFlagChecks.map((check) => (
            <div key={check.id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex gap-4">
                <span className="shrink-0 font-mono text-sm font-bold text-ink3 w-8">X{check.id}</span>
                <div className="flex-1 space-y-2">
                  <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                    <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-wider">Red flag</span>
                    <p className="text-xs text-red-800 mt-0.5 leading-relaxed">{check.redFlag}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                    <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider">Fix</span>
                    <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">{check.fix}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
