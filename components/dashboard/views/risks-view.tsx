"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { RiskBadge, EvidenceLink } from "@/components/signals"
import { riskLabels, type RiskLevel } from "@/lib/data"
import { useProject } from "@/lib/project-context"

const ORDER: RiskLevel[] = ["critico", "alto", "medio", "bajo"]

export function RisksView() {
  const { data } = useProject()
  const risks = data.risks

  const counts = ORDER.map((lvl) => ({ lvl, n: risks.filter((r) => r.level === lvl).length }))
  const sorted = [...risks].sort((a, b) => ORDER.indexOf(a.level) - ORDER.indexOf(b.level))

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        breadcrumb="Riesgos"
        title="Riesgos y deuda técnica"
        desc="El Legacy Analyzer solo reporta: nunca modifica código. Cada hallazgo incluye el problema, su evidencia y el impacto estimado."
      />

      {/* Resumen por severidad */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {counts.map((c) => (
          <div key={c.lvl} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
            <div>
              <div className="font-mono text-2xl font-semibold tabular-nums text-foreground">{c.n}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{riskLabels[c.lvl]}</div>
            </div>
            <RiskBadge level={c.lvl} />
          </div>
        ))}
      </div>

      {/* Lista de riesgos */}
      <section className="flex flex-col gap-4">
        {sorted.map((r) => (
          <article key={r.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <RiskBadge level={r.level} className="mt-0.5" />
                <div>
                  <h2 className="font-semibold text-foreground">{r.title}</h2>
                  <span className="mt-0.5 inline-block font-mono text-xs text-muted-foreground">{r.category}</span>
                </div>
              </div>
              <EvidenceLink file={r.file} lines={r.lines !== "—" ? r.lines : undefined} />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Field label="Problema">{r.problem}</Field>
              <Field label="Impacto">{r.impact}</Field>
              <div>
                <div className="mb-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Evidencia</div>
                <pre className="overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-xs text-risk-high/90">
                  <code>{r.evidence}</code>
                </pre>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  )
}
