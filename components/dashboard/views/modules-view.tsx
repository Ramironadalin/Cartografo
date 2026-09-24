"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { ConfidenceBadge, RiskBadge } from "@/components/signals"
import { DependencyGraph } from "@/components/dashboard/dependency-graph"
import { useProject } from "@/lib/project-context"
import { cn } from "@/lib/utils"

const couplingStyle: Record<string, string> = {
  bajo: "text-detected",
  medio: "text-inferred",
  alto: "text-risk-high",
}

export function ModulesView() {
  const { data } = useProject()
  const modules = data.modules

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        breadcrumb="Módulos"
        title="Módulos y dependencias"
        desc="Cada módulo con su tamaño, acoplamiento y dependencias detectadas por análisis estático del repositorio."
        confidence="detectado"
      />

      {/* Grafo dirigido de dependencias */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Grafo de acoplamiento</h2>
          <span className="font-mono text-xs text-muted-foreground">Dirigido · por capa de arquitectura</span>
        </div>
        <DependencyGraph />
      </section>

      {/* Tabla detallada */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">Detalle por módulo</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Módulo</th>
                <th className="px-4 py-3 font-medium">Ruta / Paquete</th>
                <th className="px-4 py-3 text-right font-medium">LoC</th>
                <th className="px-4 py-3 text-right font-medium">Archivos</th>
                <th className="px-4 py-3 font-medium">Acoplamiento</th>
                <th className="px-4 py-3 font-medium">Riesgo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {modules.map((m) => (
                <tr key={m.id} className="bg-card transition-colors hover:bg-secondary/20">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{m.name}</div>
                    <div className="mt-0.5 max-w-xs truncate text-xs text-muted-foreground">{m.summary}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{m.path}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">{m.loc.toLocaleString("es")}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-muted-foreground">{m.files}</td>
                  <td className={cn("px-4 py-3 font-mono text-xs uppercase", couplingStyle[m.coupling])}>{m.coupling}</td>
                  <td className="px-4 py-3"><RiskBadge level={m.risk} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          <ConfidenceBadge value="detectado" className="mr-1 align-middle" />
          Las dependencias y tamaño se derivan del análisis del árbol de archivos del repositorio.
        </p>
      </section>
    </div>
  )
}
