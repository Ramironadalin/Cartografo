"use client"

import { useMemo, useState } from "react"
import { riskLabels, type RiskLevel, type Module } from "@/lib/data"
import { useProject } from "@/lib/project-context"
import { cn } from "@/lib/utils"

const riskColor: Record<RiskLevel, string> = {
  bajo: "var(--risk-low)",
  medio: "var(--risk-medium)",
  alto: "var(--risk-high)",
  critico: "var(--risk-critical)",
}

const NW = 148
const NH = 52
const VBW = 820
const VBH = 452

// Preset positions for demo modules
const defaultPresetPos: Record<string, { x: number; y: number }> = {
  web: { x: 410, y: 62 },
  auth: { x: 130, y: 214 },
  accounts: { x: 320, y: 214 },
  transfers: { x: 510, y: 214 },
  loans: { x: 700, y: 214 },
  persistence: { x: 300, y: 372 },
  audit: { x: 540, y: 372 },
}

function calculatePositions(modulesList: Module[]): Record<string, { x: number; y: number }> {
  const result: Record<string, { x: number; y: number }> = {}
  const total = modulesList.length
  if (total === 0) return result

  // Check if all modules have presets
  const hasAllPresets = modulesList.every((m) => defaultPresetPos[m.id])
  if (hasAllPresets) {
    return defaultPresetPos
  }

  if (total === 1) {
    result[modulesList[0].id] = { x: VBW / 2, y: VBH / 2 }
    return result
  }

  if (total <= 3) {
    modulesList.forEach((m, i) => {
      result[m.id] = { x: (VBW / (total + 1)) * (i + 1), y: VBH / 2 }
    })
    return result
  }

  // Multi-tier layout (top, middle, bottom)
  const topCount = Math.max(1, Math.min(2, Math.floor(total * 0.3)))
  const bottomCount = Math.max(1, Math.min(3, Math.floor((total - topCount) * 0.4)))
  const middleCount = total - topCount - bottomCount

  let idx = 0
  // Top tier
  for (let i = 0; i < topCount; i++) {
    const m = modulesList[idx++]
    if (m) result[m.id] = { x: (VBW / (topCount + 1)) * (i + 1), y: 70 }
  }
  // Middle tier
  for (let i = 0; i < middleCount; i++) {
    const m = modulesList[idx++]
    if (m) result[m.id] = { x: (VBW / (middleCount + 1)) * (i + 1), y: 220 }
  }
  // Bottom tier
  for (let i = 0; i < bottomCount; i++) {
    const m = modulesList[idx++]
    if (m) result[m.id] = { x: (VBW / (bottomCount + 1)) * (i + 1), y: 370 }
  }

  return result
}

// Punto en el borde del rect (centro cx,cy) en dirección a (sx,sy)
function edgePoint(cx: number, cy: number, sx: number, sy: number) {
  const dx = sx - cx
  const dy = sy - cy
  if (dx === 0 && dy === 0) return { x: cx, y: cy }
  const hw = NW / 2 + 2
  const hh = NH / 2 + 2
  const scale = Math.min(hw / (Math.abs(dx) || 1e-6), hh / (Math.abs(dy) || 1e-6))
  return { x: cx + dx * scale, y: cy + dy * scale }
}

interface Edge {
  from: string
  to: string
}

export function DependencyGraph() {
  const { data, moduleById } = useProject()
  const modulesList = data.modules

  const [active, setActive] = useState<string | null>(null)

  const pos = useMemo(() => calculatePositions(modulesList), [modulesList])

  const edges = useMemo<Edge[]>(() => {
    const list: Edge[] = []
    for (const m of modulesList) {
      for (const dep of m.dependsOn) {
        if (pos[m.id] && pos[dep]) {
          list.push({ from: m.id, to: dep })
        }
      }
    }
    return list
  }, [modulesList, pos])

  const neighbors = useMemo(() => {
    if (!active) return null
    const set = new Set<string>([active])
    for (const e of edges) {
      if (e.from === active) set.add(e.to)
      if (e.to === active) set.add(e.from)
    }
    return set
  }, [active, edges])

  const maxIncoming = Math.max(1, ...modulesList.map((m) => m.incomingDeps))

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <svg
          viewBox={`0 0 ${VBW} ${VBH}`}
          className="relative w-full"
          role="img"
          aria-label="Grafo dirigido de dependencias entre módulos"
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="currentColor" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="var(--primary)" />
            </marker>
          </defs>

          {/* Aristas */}
          {edges.map((e, i) => {
            const from = pos[e.from]
            const to = pos[e.to]
            if (!from || !to) return null
            const start = edgePoint(from.x, from.y, to.x, to.y)
            const end = edgePoint(to.x, to.y, from.x, from.y)
            const on = neighbors && (e.from === active || e.to === active)
            const dim = neighbors && !on
            const mx = (start.x + end.x) / 2
            const my = (start.y + end.y) / 2 - 24
            return (
              <path
                key={i}
                d={`M${start.x} ${start.y} Q${mx} ${my} ${end.x} ${end.y}`}
                fill="none"
                stroke={on ? "var(--primary)" : "currentColor"}
                strokeWidth={on ? 2 : 1.25}
                className={cn("text-muted-foreground transition-opacity", dim ? "opacity-10" : on ? "opacity-100" : "opacity-35")}
                markerEnd={on ? "url(#arrow-active)" : "url(#arrow)"}
              />
            )
          })}

          {/* Nodos */}
          {modulesList.map((m) => {
            const p = pos[m.id]
            if (!p) return null
            const isActive = active === m.id
            const inScope = !neighbors || neighbors.has(m.id)
            const r = 3 + (m.incomingDeps / maxIncoming) * 5
            return (
              <g
                key={m.id}
                transform={`translate(${p.x - NW / 2} ${p.y - NH / 2})`}
                className={cn("cursor-pointer transition-opacity", inScope ? "opacity-100" : "opacity-25")}
                onMouseEnter={() => setActive(m.id)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setActive((cur) => (cur === m.id ? null : m.id))}
              >
                <rect
                  width={NW}
                  height={NH}
                  rx={10}
                  fill="var(--card)"
                  stroke={isActive ? "var(--primary)" : riskColor[m.risk]}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <circle cx={14} cy={NH / 2} r={r} fill={riskColor[m.risk]} />
                <text x={30} y={22} className="fill-foreground font-sans text-[13px] font-semibold">
                  {m.name}
                </text>
                <text x={30} y={39} className="fill-muted-foreground font-mono text-[10px]">
                  {m.incomingDeps} in · {m.outgoingDeps} out
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {(["bajo", "medio", "alto", "critico"] as RiskLevel[]).map((lvl) => (
            <span key={lvl} className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: riskColor[lvl] }} />
              {riskLabels[lvl]}
            </span>
          ))}
        </div>
        <p className="font-mono text-[11px]">
          {active ? `Resaltando: ${moduleById(active)?.name} y sus vecinos` : "Pasá el cursor o hacé clic en un módulo para trazar su acoplamiento"}
        </p>
      </div>
    </div>
  )
}
