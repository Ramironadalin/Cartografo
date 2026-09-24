import Link from "next/link"
import { ConfidenceBadge } from "@/components/signals"
import type { Confidence } from "@/lib/data"

export function PageHeader({
  breadcrumb,
  title,
  desc,
  confidence,
  children,
}: {
  breadcrumb?: string
  title: string
  desc?: string
  confidence?: Confidence
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6">
      <nav className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
        {breadcrumb ? (
          <>
            <span aria-hidden>/</span>
            <span className="text-foreground">{breadcrumb}</span>
          </>
        ) : null}
      </nav>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {confidence ? <ConfidenceBadge value={confidence} /> : null}
          </div>
          {desc ? <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{desc}</p> : null}
        </div>
        {children ? <div className="flex items-center gap-2">{children}</div> : null}
      </div>
    </div>
  )
}
