"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { useProject } from "@/lib/project-context"
import { cn } from "@/lib/utils"

const qualityStyle: Record<string, string> = {
  buena: "border-detected/30 bg-detected/10 text-detected",
  media: "border-inferred/30 bg-inferred/10 text-inferred",
  baja: "border-risk-high/30 bg-risk-high/10 text-risk-high",
  "sin tests": "border-risk-critical/40 bg-risk-critical/15 text-risk-critical",
}

export function TestsView() {
  const { data } = useProject()
  const tests = data.tests

  const totalFiles = tests.reduce((a, t) => a + t.testFiles, 0)
  const withIntegration = tests.filter((t) => t.hasIntegration).length

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        breadcrumb="Tests"
        title="Tests y cobertura"
        desc="El Test Analyzer nunca estima cobertura sin un reporte verificable. Donde no hay datos, lo dice explícitamente en lugar de inventar un número."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric value={String(totalFiles)} label="Archivos de test" />
        <Metric value={String(withIntegration)} label="Con tests de integración" />
        <Metric value={String(tests.filter((t) => t.quality === "sin tests").length)} label="Módulos sin tests" />
        <Metric value={String(tests.filter((t) => !t.coverageVerifiable).length)} label="Cobertura no verificable" />
      </div>

      <section className="flex flex-col gap-3">
        {tests.map((t) => (
          <div key={t.moduleId} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-foreground">{t.moduleName}</h2>
                <span className={cn("rounded-full border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide", qualityStyle[t.quality])}>
                  {t.quality}
                </span>
              </div>
              <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
                <span><span className="text-foreground">{t.testFiles}</span> archivos</span>
                <span className={t.hasIntegration ? "text-detected" : "text-muted-foreground"}>
                  {t.hasIntegration ? "con integración" : "sin integración"}
                </span>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.note}</p>

            <div className="mt-4">
              {t.coverageVerifiable && t.coveragePct !== undefined ? (
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono uppercase tracking-wide text-muted-foreground">Cobertura (reporte verificado)</span>
                    <span className="font-mono tabular-nums text-foreground">{t.coveragePct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        t.coveragePct >= 70 ? "bg-detected" : t.coveragePct >= 40 ? "bg-inferred" : "bg-risk-high",
                      )}
                      style={{ width: `${t.coveragePct}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-inferred/30 bg-inferred/5 px-3 py-2 text-xs text-inferred">
                  <svg viewBox="0 0 24 24" fill="none" className="size-4 shrink-0"><path d="M12 9v4m0 4h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Cobertura no verificable: no se encontró un reporte de cobertura para este módulo. No se estima un número.
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <div className="font-mono text-2xl font-semibold tabular-nums text-foreground">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
