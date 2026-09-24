"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { ConfidenceBadge, EvidenceLink } from "@/components/signals"
import { ErdDiagram } from "@/components/dashboard/erd-diagram"
import { useProject } from "@/lib/project-context"

export function DatabaseView() {
  const { data } = useProject()
  const dbConfig = data.dbConfig

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        breadcrumb="Base de datos"
        title="Modelo de datos"
        desc="Entidades, tablas y relaciones detectadas en los esquemas, modelos o consultas del código fuente."
      />

      {/* Motor */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <span className="grid size-10 place-items-center rounded-lg border border-border bg-secondary/50 text-primary">
            <svg viewBox="0 0 24 24" fill="none" className="size-5">
              <path d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{dbConfig.engine}</span>
              <ConfidenceBadge value={dbConfig.confidence} />
            </div>
            <div className="mt-0.5 font-mono text-xs text-muted-foreground">{dbConfig.driver}</div>
          </div>
        </div>
        <EvidenceLink file={dbConfig.evidence.file} lines={dbConfig.evidence.lines} />
      </section>

      {/* Entidades / ERD */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Entidades y relaciones</h2>
          <span className="font-mono text-xs text-muted-foreground">Las líneas conectan cada FK con su tabla referenciada</span>
        </div>
        <ErdDiagram />
      </section>
    </div>
  )
}
