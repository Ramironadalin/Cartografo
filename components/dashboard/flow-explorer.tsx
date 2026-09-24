"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { type RiskLevel } from "@/lib/data"
import { useProject } from "@/lib/project-context"
import { ConfidenceBadge, EvidenceLink } from "@/components/signals"
import { cn } from "@/lib/utils"

const riskColor: Record<RiskLevel, string> = {
  bajo: "var(--risk-low)",
  medio: "var(--risk-medium)",
  alto: "var(--risk-high)",
  critico: "var(--risk-critical)",
}

interface Seg {
  d: string
  ex: number
  ey: number
}

export function FlowExplorer() {
  const { data, moduleById } = useProject()
  const flows = data.flows

  const [flowId, setFlowId] = useState<string>(flows[0]?.id || "")
  const [step, setStep] = useState<number | null>(null)

  useEffect(() => {
    if (flows.length > 0 && !flows.some((f) => f.id === flowId)) {
      setFlowId(flows[0].id)
    }
  }, [flows, flowId])

  const flow = useMemo(() => flows.find((f) => f.id === flowId) ?? flows[0] ?? { id: "", name: "", confidence: "inferido" as const, summary: "", steps: [] }, [flows, flowId])

  // Carriles: módulos únicos en el orden en que aparecen
  const lanes = useMemo(() => {
    const seen: string[] = []
    if (!flow?.steps) return seen
    for (const s of flow.steps) if (!seen.includes(s.moduleId)) seen.push(s.moduleId)
    return seen
  }, [flow])

  const laneIndex = useCallback((moduleId: string) => lanes.indexOf(moduleId), [lanes])

  const contentRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<Map<number, HTMLElement>>(new Map())
  const [segs, setSegs] = useState<Seg[]>([])
  const [dims, setDims] = useState({ w: 0, h: 0 })

  const setStepRef = useCallback((i: number) => (el: HTMLElement | null) => {
    if (el) stepRefs.current.set(i, el)
    else stepRefs.current.delete(i)
  }, [])

  const compute = useCallback(() => {
    const content = contentRef.current
    if (!content) return
    const base = content.getBoundingClientRect()
    setDims({ w: content.scrollWidth, h: content.clientHeight })
    const next: Seg[] = []
    for (let i = 0; i < flow.steps.length - 1; i++) {
      const a = stepRefs.current.get(i)
      const b = stepRefs.current.get(i + 1)
      if (!a || !b) continue
      const ar = a.getBoundingClientRect()
      const br = b.getBoundingClientRect()
      const sx = ar.right - base.left
      const sy = ar.top + ar.height / 2 - base.top
      const ex = br.left - base.left
      const ey = br.top + br.height / 2 - base.top
      const dx = Math.max(24, (ex - sx) * 0.5)
      next.push({ d: `M${sx} ${sy} C${sx + dx} ${sy} ${ex - dx} ${ey} ${ex} ${ey}`, ex, ey })
    }
    setSegs(next)
  }, [flow])

  useLayoutEffect(() => {
    setStep(null)
    stepRefs.current.clear()
  }, [flowId])

  useLayoutEffect(() => {
    compute()
  }, [compute])

  useEffect(() => {
    const t = setTimeout(compute, 80)
    window.addEventListener("resize", compute)
    return () => {
      clearTimeout(t)
      window.removeEventListener("resize", compute)
    }
  }, [compute])

  const activeStep = step !== null ? flow.steps[step] : null

  return (
    <div className="flex flex-col gap-5">
      {/* Selector de flujo */}
      <div className="flex flex-wrap gap-2">
        {flows.map((f) => (
          <button
            key={f.id}
            onClick={() => setFlowId(f.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
              f.id === flowId
                ? "border-primary/50 bg-primary/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-border hover:bg-secondary/40 hover:text-foreground",
            )}
          >
            <span className="font-medium">{f.name}</span>
            <ConfidenceBadge value={f.confidence} />
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-5">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-foreground">{flow.name}</h2>
              <ConfidenceBadge value={flow.confidence} />
            </div>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{flow.summary}</p>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {flow.steps.length} pasos · {lanes.length} módulos
          </span>
        </div>

        {/* Diagrama de carriles */}
        <div className="overflow-x-auto p-5">
          <div ref={contentRef} className="relative min-w-max">
            <svg
              className="pointer-events-none absolute inset-0 z-10 overflow-visible"
              width={dims.w}
              height={dims.h}
              aria-hidden
            >
              <defs>
                <marker id="flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0 0L10 5L0 10z" fill="var(--primary)" />
                </marker>
              </defs>
              {segs.map((s, i) => (
                <path key={i} d={s.d} fill="none" stroke="var(--primary)" strokeWidth={1.75} markerEnd="url(#flow-arrow)" className="opacity-70" />
              ))}
            </svg>

            <div
              className="grid gap-x-6 gap-y-4"
              style={{
                gridTemplateColumns: `180px repeat(${flow.steps.length}, minmax(200px, 1fr))`,
                gridTemplateRows: `repeat(${lanes.length}, auto)`,
              }}
            >
              {/* Carriles de fondo (swimlane tracks) */}
              {lanes.map((laneId, r) => (
                <div
                  key={`track-${laneId}`}
                  className="pointer-events-none rounded-xl border border-border/40 bg-secondary/15"
                  style={{
                    gridRow: r + 1,
                    gridColumn: `1 / span ${flow.steps.length + 1}`,
                    zIndex: 0,
                  }}
                />
              ))}

              {/* Cabecera de módulo por carril */}
              {lanes.map((laneId, r) => {
                const m = moduleById(laneId)
                return (
                  <div
                    key={laneId}
                    className="z-20 flex items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 py-3 shadow-sm"
                    style={{ gridColumn: 1, gridRow: r + 1 }}
                  >
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: riskColor[m?.risk ?? "bajo"] }} />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-foreground">{m?.name ?? laneId}</div>
                      <div className="truncate font-mono text-[10px] text-muted-foreground">{m?.path}</div>
                    </div>
                  </div>
                )
              })}

              {/* Tarjetas de paso */}
              {flow.steps.map((s, i) => {
                const selected = step === i
                const m = moduleById(s.moduleId)
                return (
                  <button
                    key={i}
                    ref={setStepRef(i) as never}
                    onClick={() => setStep((cur) => (cur === i ? null : i))}
                    style={{ gridColumn: i + 2, gridRow: laneIndex(s.moduleId) + 1, zIndex: 20 }}
                    className={cn(
                      "group relative flex flex-col justify-between gap-2 rounded-lg border p-3.5 text-left transition-all shadow-sm",
                      selected
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-border bg-card hover:border-primary/50 hover:bg-secondary/30",
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10 font-mono text-[10px] font-bold text-primary">
                          {i + 1}
                        </span>
                        <span className="truncate font-mono text-xs font-semibold text-foreground">{s.component}</span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">{s.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-border/50 font-mono text-[10px] text-muted-foreground">
                      <span className="size-1.5 shrink-0 rounded-full" style={{ background: riskColor[m?.risk ?? "bajo"] }} />
                      <span className="truncate">{m?.name ?? s.moduleId}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Detalle del paso */}
        <div className="border-t border-border p-5">
          {activeStep ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full border border-primary/40 bg-primary/10 font-mono text-xs text-primary">
                  {(step ?? 0) + 1}
                </span>
                <span className="font-mono text-sm font-semibold text-foreground">{activeStep.component}</span>
                <span className="rounded border border-border bg-secondary/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {moduleById(activeStep.moduleId)?.name ?? activeStep.moduleId}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{activeStep.description}</p>
              <EvidenceLink file={activeStep.file} lines={activeStep.lines} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Seleccioná un paso del diagrama para ver su descripción y la evidencia en el código.
            </p>
          )}
        </div>

        {flow.confidence === "inferido" && (
          <div className="border-t border-inferred/20 bg-inferred/5 p-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-mono uppercase tracking-wide text-inferred">Parcialmente inferido · </span>
              Parte de este flujo no pudo trazarse por completo en el código (invocación vía job batch externo).
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
