import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="relative grid size-7 place-items-center rounded-md border border-border bg-card"
      >
        <span className="absolute inset-0 grid-bg rounded-md opacity-60" />
        <svg viewBox="0 0 24 24" fill="none" className="relative size-4 text-primary">
          <path d="M4 6l6-2 4 2 6-2v14l-6 2-4-2-6 2V6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M10 4v14M14 6v14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.6" />
        </svg>
      </span>
      <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
        Cartógrafo
      </span>
    </Link>
  )
}
