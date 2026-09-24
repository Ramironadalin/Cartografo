"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useProject } from "@/lib/project-context"
import { ConfidenceBadge } from "@/components/signals"
import { cn } from "@/lib/utils"

interface Rel {
  id: string
  fromTable: string
  toTable: string
  fromKey: string // ref key for the FK row
  toKey: string   // ref key for the PK row
}

interface Line {
  id: string
  fromTable: string
  toTable: string
  d: string
  sx: number
  sy: number
  ex: number
  ey: number
}

export function ErdDiagram() {
  const { data } = useProject()
  const dbEntities = data.dbEntities

  const tablesPresent = useMemo(() => new Set(dbEntities.map((e) => e.table)), [dbEntities])

  const pkByTable = useMemo(() => {
    const map = new Map<string, string>()
    for (const e of dbEntities) {
      const pkCol = e.columns.find((c) => c.pk) || e.columns[0]
      if (pkCol) map.set(e.table, pkCol.name)
    }
    return map
  }, [dbEntities])

  const rels = useMemo<Rel[]>(() => {
    return dbEntities.flatMap((e) =>
      e.columns
        .filter((c) => c.fk && tablesPresent.has(c.fk))
        .map((c) => {
          const targetPk = pkByTable.get(c.fk as string) || "id"
          return {
            id: `${e.table}.${c.name}->${c.fk}.${targetPk}`,
            fromTable: e.table,
            toTable: c.fk as string,
            fromKey: `${e.table}::${c.name}`,
            toKey: `${c.fk}::${targetPk}`,
          }
        }),
    )
  }, [dbEntities, tablesPresent, pkByTable])

  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map())
  const rowRefs = useRef<Map<string, HTMLElement>>(new Map())
  const [lines, setLines] = useState<Line[]>([])
  const [hover, setHover] = useState<string | null>(null)

  const setCard = useCallback((table: string) => (el: HTMLElement | null) => {
    if (el) cardRefs.current.set(table, el)
    else cardRefs.current.delete(table)
  }, [])

  const setRow = useCallback((key: string) => (el: HTMLElement | null) => {
    if (el) rowRefs.current.set(key, el)
    else rowRefs.current.delete(key)
  }, [])

  const compute = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const base = container.getBoundingClientRect()
    const next: Line[] = []

    for (const rel of rels) {
      const fromRow = rowRefs.current.get(rel.fromKey)
      const toRow = rowRefs.current.get(rel.toKey)
      const fromCard = cardRefs.current.get(rel.fromTable)
      const toCard = cardRefs.current.get(rel.toTable)

      if (!fromRow || !fromCard || !toCard) continue

      const fr = fromRow.getBoundingClientRect()
      const fc = fromCard.getBoundingClientRect()
      const tc = toCard.getBoundingClientRect()
      const tr = toRow ? toRow.getBoundingClientRect() : null

      const sy = fr.top + fr.height / 2 - base.top
      const ey = tr ? tr.top + tr.height / 2 - base.top : tc.top + 40 - base.top

      const fcCenter = fc.left + fc.width / 2
      const tcCenter = tc.left + tc.width / 2
      const colDiff = tcCenter - fcCenter

      let sx: number
      let ex: number
      let d: string

      // Caso 1: La tabla destino está en una columna a la derecha
      if (colDiff > 60) {
        sx = fc.right - base.left
        ex = tc.left - base.left
        const dx = Math.max(30, (ex - sx) * 0.45)
        d = `M${sx} ${sy} C${sx + dx} ${sy} ${ex - dx} ${ey} ${ex} ${ey}`
      }
      // Caso 2: La tabla destino está en una columna a la izquierda
      else if (colDiff < -60) {
        sx = fc.left - base.left
        ex = tc.right - base.left
        const dx = Math.max(30, (sx - ex) * 0.45)
        d = `M${sx} ${sy} C${sx - dx} ${sy} ${ex + dx} ${ey} ${ex} ${ey}`
      }
      // Caso 3: Ambas tablas están en la MISMA columna (apiladas verticalmente)
      else {
        // En 2 columnas, si están en la columna izquierda salen hacia el canal central (derecha).
        // Si están en la columna derecha, salen hacia el canal central (izquierda).
        const isLeftCol = fcCenter - base.left < base.width * 0.5

        if (isLeftCol) {
          sx = fc.right - base.left
          ex = tc.right - base.left
          const dx = Math.max(36, Math.min(65, 26 + Math.abs(ey - sy) * 0.1))
          d = `M${sx} ${sy} C${sx + dx} ${sy} ${ex + dx} ${ey} ${ex} ${ey}`
        } else {
          sx = fc.left - base.left
          ex = tc.left - base.left
          const dx = Math.max(36, Math.min(65, 26 + Math.abs(ey - sy) * 0.1))
          d = `M${sx} ${sy} C${sx - dx} ${sy} ${ex - dx} ${ey} ${ex} ${ey}`
        }
      }

      next.push({
        id: rel.id,
        fromTable: rel.fromTable,
        toTable: rel.toTable,
        sx,
        sy,
        ex,
        ey,
        d,
      })
    }
    setLines(next)
  }, [rels])

  useLayoutEffect(() => {
    compute()
  }, [compute])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(() => compute())
    ro.observe(container)
    for (const el of cardRefs.current.values()) ro.observe(el)
    for (const el of rowRefs.current.values()) ro.observe(el)
    window.addEventListener("resize", compute)
    const t = setTimeout(compute, 100)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", compute)
      clearTimeout(t)
    }
  }, [compute])

  const isDim = (table: string) =>
    hover !== null &&
    hover !== table &&
    !lines.some(
      (l) =>
        (l.fromTable === table && l.toTable === hover) ||
        (l.toTable === table && l.fromTable === hover),
    )

  return (
    <div ref={containerRef} className="relative">
      <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <marker id="erd-dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6">
            <circle cx="5" cy="5" r="4" fill="var(--primary)" />
          </marker>
        </defs>
        {lines.map((l) => {
          const on = hover === null || hover === l.fromTable || hover === l.toTable
          return (
            <g key={l.id} className={cn("transition-opacity", on ? "opacity-100" : "opacity-15")}>
              <path
                d={l.d}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={2}
                strokeDasharray="1 0"
                markerEnd="url(#erd-dot)"
                className="opacity-90"
              />
              <circle cx={l.sx} cy={l.sy} r={3.5} fill="var(--primary)" />
              <circle cx={l.ex} cy={l.ey} r={3.5} fill="var(--primary)" />
            </g>
          )
        })}
      </svg>

      <div className="grid gap-x-16 gap-y-6 md:grid-cols-2">
        {dbEntities.map((e) => (
          <div
            key={e.table}
            ref={setCard(e.table)}
            onMouseEnter={() => setHover(e.table)}
            onMouseLeave={() => setHover(null)}
            className={cn(
              "relative z-10 overflow-hidden rounded-xl border bg-card transition-all shadow-sm",
              hover === e.table ? "border-primary/60 shadow-lg shadow-primary/5 ring-1 ring-primary/30" : "border-border",
              isDim(e.table) && "opacity-35",
            )}
          >
            <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{e.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{e.table}</span>
              </div>
              <ConfidenceBadge value={e.confidence} />
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {e.columns.map((c) => (
                  <tr
                    key={c.name}
                    ref={(c.fk || c.pk) ? (setRow(`${e.table}::${c.name}`) as never) : undefined}
                    className={cn(
                      c.fk && tablesPresent.has(c.fk) && "bg-primary/5",
                      c.pk && "font-medium",
                    )}
                  >
                    <td className="px-4 py-2 font-mono text-xs">
                      <span className="text-foreground">{c.name}</span>
                      {c.pk && <span className="ml-2 rounded bg-primary/15 px-1 py-0.5 text-[10px] font-medium text-primary">PK</span>}
                      {c.fk && <span className="ml-2 rounded bg-inferred/15 px-1 py-0.5 text-[10px] font-medium text-inferred">FK → {c.fk}</span>}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-xs text-muted-foreground">{c.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-border bg-background/50 px-4 py-3">
              <div className="mb-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Tocada por</div>
              <div className="flex flex-col gap-1.5">
                {e.touchedBy.map((t) => (
                  <div key={t.file} className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono text-foreground">{t.file}</span>
                    <span className="text-muted-foreground">{t.via}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
