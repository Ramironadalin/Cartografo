"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Logo } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { EvidenceLink } from "@/components/signals"
import {
  roleLabels,
  type Role,
} from "@/lib/data"
import { useProject } from "@/lib/project-context"
import { loadConfig, loadTourProgress, saveTourProgress } from "@/lib/session"
import { cn } from "@/lib/utils"

const ROLES: Role[] = ["junior", "semi", "senior"]

export default function TourPage() {
  const { data, moduleById } = useProject()
  const tourSteps = data.tourStepsByRole

  const [role, setRole] = useState<Role>("junior")
  const [current, setCurrent] = useState(0)
  const [completed, setCompleted] = useState<number[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Cargar rol y progreso persistidos
  useEffect(() => {
    const progress = loadTourProgress()
    const cfg = loadConfig()
    const initialRole = progress?.role ?? cfg?.role ?? "junior"
    setRole(initialRole)
    if (progress?.role === initialRole) setCompleted(progress.completedIds ?? [])
    setHydrated(true)
  }, [])

  const steps = useMemo(() => tourSteps[role] || [], [tourSteps, role])
  const step = steps[current]
  const pct = Math.round((completed.length / steps.length) * 100)

  function switchRole(r: Role) {
    setRole(r)
    setCurrent(0)
    const progress = loadTourProgress()
    const next = progress?.role === r ? (progress.completedIds ?? []) : []
    setCompleted(next)
    saveTourProgress(r, next)
  }

  function markDone() {
    if (!step) return
    const next = completed.includes(step.id) ? completed : [...completed, step.id]
    setCompleted(next)
    saveTourProgress(role, next)
    if (current < steps.length - 1) setCurrent((c) => c + 1)
  }

  function resetProgress() {
    setCompleted([])
    setCurrent(0)
    saveTourProgress(role, [])
  }

  const m = step ? moduleById(step.moduleId) : undefined

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden font-mono text-xs text-muted-foreground sm:inline">Tour de onboarding</span>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">Ir al dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-5 py-8 lg:grid-cols-[320px_1fr]">
        {/* Panel lateral: rol + progreso + pasos */}
        <aside className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Recorrido según rol</div>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => switchRole(r)}
                  className={cn(
                    "rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                    role === r ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {roleLabels[r]}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-mono tabular-nums text-foreground">{completed.length}/{steps.length}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${hydrated ? pct : 0}%` }} />
              </div>
              {completed.length > 0 && (
                <button onClick={resetProgress} className="mt-2 font-mono text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
                  Reiniciar progreso
                </button>
              )}
            </div>
          </div>

          <ol className="flex flex-col gap-1">
            {steps.map((s, i) => {
              const isDone = completed.includes(s.id)
              const isCurrent = i === current
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setCurrent(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                      isCurrent ? "border-primary/40 bg-primary/5" : "border-transparent hover:bg-secondary/40",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[11px]",
                        isDone ? "border-detected/40 bg-detected/10 text-detected" : isCurrent ? "border-primary text-primary" : "border-border text-muted-foreground",
                      )}
                    >
                      {isDone ? "✓" : i + 1}
                    </span>
                    <span className={cn("text-sm", isCurrent ? "font-medium text-foreground" : "text-muted-foreground")}>
                      {s.title}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </aside>

        {/* Contenido del paso */}
        <section className="min-w-0">
          {step && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <span>Paso {current + 1} de {steps.length}</span>
                <span aria-hidden>·</span>
                <span>Perfil {roleLabels[role]}</span>
                {m && (
                  <>
                    <span aria-hidden>·</span>
                    <span className="rounded border border-border bg-secondary/40 px-1.5 py-0.5 text-foreground">{m.name}</span>
                  </>
                )}
              </div>

              <h1 className="text-balance text-3xl font-semibold tracking-tight">{step.title}</h1>

              {/* Por qué este paso — la justificación del Mentor */}
              <div className="rounded-xl border border-primary/25 bg-primary/5 p-5">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-primary">
                  <svg viewBox="0 0 24 24" fill="none" className="size-4"><path d="M12 3l3 6 6 .5-4.5 4 1.5 6-6-3.2L6 19.5 7.5 13.5 3 9.5 9 9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                  Por qué empezar por acá
                </div>
                <p className="mt-2 text-pretty leading-relaxed text-foreground/90">{step.reason}</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Qué hacer</div>
                <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{step.detail}</p>

                {step.file && (
                  <div className="mt-4 flex flex-col gap-3">
                    <EvidenceLink file={step.file} lines={step.lines} />
                    {step.snippet && (
                      <pre className="overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-xs leading-relaxed text-muted-foreground">
                        <code>{step.snippet}</code>
                      </pre>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-6">
                <Button variant="ghost" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
                  Anterior
                </Button>
                <div className="flex items-center gap-2">
                  {current === steps.length - 1 ? (
                    <Button onClick={markDone}>Finalizar tour</Button>
                  ) : (
                    <Button onClick={markDone}>
                      {completed.includes(step.id) ? "Siguiente" : "Marcar hecho y seguir"}
                    </Button>
                  )}
                </div>
              </div>

              {completed.length === steps.length && (
                <div className="rounded-xl border border-detected/30 bg-detected/5 p-5">
                  <div className="flex items-center gap-2 font-semibold text-detected">
                    <svg viewBox="0 0 24 24" fill="none" className="size-5"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Tour completado
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    Ya tenés el mapa del proyecto. Seguí explorando los módulos en el dashboard o cambiá de rol para ver otra perspectiva.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
