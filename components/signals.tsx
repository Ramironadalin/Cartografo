import { cn } from "@/lib/utils"
import type { Confidence, RiskLevel } from "@/lib/data"
import { riskLabels } from "@/lib/data"

export function ConfidenceBadge({
  value,
  className,
}: {
  value: Confidence
  className?: string
}) {
  const detected = value === "detectado"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide",
        detected
          ? "border-detected/30 bg-detected/10 text-detected"
          : "border-inferred/30 bg-inferred/10 text-inferred [border-style:dashed]",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", detected ? "bg-detected" : "bg-inferred")}
      />
      {detected ? "Detectado" : "Inferido"}
    </span>
  )
}

const riskStyles: Record<RiskLevel, string> = {
  bajo: "border-risk-low/30 bg-risk-low/10 text-risk-low",
  medio: "border-risk-medium/30 bg-risk-medium/10 text-risk-medium",
  alto: "border-risk-high/30 bg-risk-high/10 text-risk-high",
  critico: "border-risk-critical/40 bg-risk-critical/15 text-risk-critical",
}

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide",
        riskStyles[level],
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {riskLabels[level]}
    </span>
  )
}

export function EvidenceLink({
  file,
  lines,
  commit,
  className,
}: {
  file: string
  lines?: string
  commit?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "group inline-flex max-w-full items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground",
        className,
      )}
      title="Ver evidencia de origen"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-3 shrink-0 text-primary">
        <path d="M9 12h6M9 8h6M9 16h4M6 3h9l5 5v13H6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span className="truncate">{file}{lines ? `:${lines}` : ""}</span>
      {commit ? <span className="text-primary/70">@{commit}</span> : null}
    </span>
  )
}

export function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <div className="font-mono text-lg font-semibold text-foreground tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
