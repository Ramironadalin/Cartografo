"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { ConfidenceBadge, EvidenceLink } from "@/components/signals"
import { useProject } from "@/lib/project-context"

export function ArchitectureView() {
  const { data, moduleById } = useProject()
  const { layers, patterns } = data

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        breadcrumb="Arquitectura"
        title="Arquitectura del sistema"
        desc="Capas detectadas a partir de la organización de directorios y puntos de entrada. El acoplamiento transversal se marca como inferido."
      />

      {/* Diagrama de capas */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">Vista en capas</h2>
        <div className="flex flex-col gap-3">
          {layers.map((layer, i) => (
            <div key={layer.id} className="relative">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">L{i + 1}</span>
                    <h3 className="font-semibold text-foreground">{layer.name}</h3>
                    <ConfidenceBadge value={layer.confidence} />
                  </div>
                  <span className="text-xs text-muted-foreground">{layer.note}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {layer.modules.map((mid) => {
                    const m = moduleById(mid)
                    return (
                      <span
                        key={mid}
                        className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-1.5 text-sm"
                      >
                        <span className="size-1.5 rounded-full bg-primary" />
                        {m?.name ?? mid}
                        <span className="font-mono text-xs text-muted-foreground">{m?.path}</span>
                      </span>
                    )
                  })}
                </div>
              </div>
              {i < layers.length - 1 && (
                <div className="flex justify-center py-1" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" className="size-5 text-muted-foreground">
                    <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Patrones */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">Patrones de diseño detectados</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {patterns.map((p) => (
            <div key={p.name} className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-card p-5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-foreground">{p.name}</h3>
                  <ConfidenceBadge value={p.confidence} />
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <EvidenceLink file={p.evidence.file} lines={p.evidence.lines} />
                {p.evidence.snippet && (
                  <code className="truncate max-w-[200px] font-mono text-[11px] text-muted-foreground">
                    {p.evidence.snippet}
                  </code>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
