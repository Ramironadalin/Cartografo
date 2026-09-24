"use client"

import Link from "next/link"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { ConfidenceBadge, RiskBadge, StatPill } from "@/components/signals"
import { useProject } from "@/lib/project-context"

export function OverviewView() {
  const { data, isCustom, resetToDemo } = useProject()
  const { project, languages, frameworks, risks, modules, entryPoints } = data

  const criticalRisks = risks.filter((r) => r.level === "critico").length
  const highRisks = risks.filter((r) => r.level === "alto").length

  return (
    <div className="flex flex-col gap-8">
      {isCustom && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-detected" />
            <span className="font-semibold text-foreground">Repositorio analizado:</span>
            <span className="font-mono text-primary">{project.fullName || project.name}</span>
            <span className="text-xs text-muted-foreground">({project.branch} @ {project.commit})</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/onboarding">Analizar otro repo</Link>
            </Button>
            <Button size="sm" variant="ghost" onClick={resetToDemo}>
              Volver a demo
            </Button>
          </div>
        </div>
      )}

      <PageHeader
        title="Vista general"
        desc={project.description}
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/configuracion">Regenerar análisis</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/tour">Iniciar tour</Link>
        </Button>
      </PageHeader>

      {/* Métricas clave */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatPill label="Archivos" value={project.stats.files.toLocaleString("es")} />
        <StatPill label="Líneas de código" value={project.stats.linesOfCode.toLocaleString("es")} />
        <StatPill label="Contribuidores" value={String(project.stats.contributors)} />
        <StatPill label="Módulos" value={String(modules.length)} />
        <StatPill label="Riesgos críticos" value={String(criticalRisks)} />
        <StatPill label="TO DO / FIX ME" value={String(project.stats.openTodos)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Resumen ejecutivo */}
        <section className="lg:col-span-2 flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Resumen ejecutivo</h2>
            <span className="font-mono text-xs text-muted-foreground">Generado por Documentación</span>
          </div>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            <span className="text-foreground">{project.name}</span> es un proyecto {project.primaryLanguage} de {project.stats.linesOfCode.toLocaleString("es")} líneas
            {project.stats.firstCommit ? `, registrado desde ${project.stats.firstCommit}` : ""}.
            Se organiza en {modules.length} módulos principales de dominio.
            El análisis detectó <span className="text-foreground">{criticalRisks} riesgos críticos</span> y {highRisks} altos
            en la base de código.
          </p>
          <p className="rounded-lg border border-inferred/20 bg-inferred/5 p-3 text-sm leading-relaxed text-muted-foreground">
            <span className="font-mono text-xs uppercase tracking-wide text-inferred">Nota de confianza · </span>
            Los hechos estructurales están <span className="text-foreground">detectados</span> a partir del análisis del código,
            mientras que las relaciones de dominio complejas son <span className="text-foreground">inferidas</span> con evidencia trazable.
          </p>

          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <div className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Actividad</div>
              <div className="mt-2 text-sm text-foreground">Primer registro {project.stats.firstCommit}</div>
              <div className="text-sm text-foreground">Último commit {project.stats.lastCommit}</div>
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <div className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Puntos de entrada</div>
              <ul className="mt-2 flex flex-col gap-1">
                {entryPoints.map((e) => (
                  <li key={e.path} className="truncate font-mono text-xs text-foreground" title={e.path}>
                    {e.path.split("/").pop()} <span className="text-muted-foreground">({e.kind})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Stack */}
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Stack detectado</h2>
          <div>
            <div className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">Lenguajes</div>
            <div className="flex flex-col gap-2">
              {languages.map((l) => (
                <div key={l.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{l.name}</span>
                    <span className="font-mono text-muted-foreground tabular-nums">{l.pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary/80" style={{ width: `${l.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">Frameworks</div>
            <ul className="flex flex-col gap-2">
              {frameworks.map((f) => (
                <li key={f.name} className="flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate text-foreground">
                    {f.name} <span className="font-mono text-xs text-muted-foreground">{f.version}</span>
                  </span>
                  <ConfidenceBadge value={f.confidence} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Riesgos destacados */}
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Riesgos más urgentes</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/riesgos">Ver todos</Link>
          </Button>
        </div>
        <ul className="flex flex-col divide-y divide-border">
          {risks
            .filter((r) => r.level === "critico" || r.level === "alto" || r.level === "medio")
            .slice(0, 4)
            .map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-4 py-3 first:pt-0">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">{r.title}</div>
                  <div className="mt-0.5 font-mono text-xs text-muted-foreground">{r.file}:{r.lines}</div>
                </div>
                <RiskBadge level={r.level} />
              </li>
            ))}
        </ul>
      </section>
    </div>
  )
}
