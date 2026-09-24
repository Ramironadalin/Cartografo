"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/brand"
import { project } from "@/lib/data"
import { cn } from "@/lib/utils"

const NAV: { group: string; items: { href: string; label: string; icon: string }[] }[] = [
  {
    group: "Conocimiento",
    items: [
      { href: "/dashboard", label: "Vista general", icon: "M4 6h16M4 12h16M4 18h10" },
      { href: "/dashboard/arquitectura", label: "Arquitectura", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
      { href: "/dashboard/modulos", label: "Módulos y dependencias", icon: "M12 2l8 4v8l-8 4-8-4V6zM12 22V12M4 6l8 4 8-4" },
      { href: "/dashboard/flujos", label: "Flujos de negocio", icon: "M4 6h6l4 6h6M4 18h6l2-3" },
      { href: "/dashboard/base-de-datos", label: "Base de datos", icon: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" },
      { href: "/dashboard/riesgos", label: "Riesgos y deuda", icon: "M12 3l9 16H3zM12 9v5M12 17h.01" },
      { href: "/dashboard/tests", label: "Tests y cobertura", icon: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" },
      { href: "/dashboard/documentacion", label: "Documentación", icon: "M6 3h9l5 5v13H6zM15 3v5h5" },
    ],
  },
  {
    group: "Onboarding",
    items: [
      { href: "/tour", label: "Tour guiado", icon: "M12 2l3 6 6 .5-4.5 4 1.5 6-6-3.2L6 18.5 7.5 12.5 3 8.5 9 8z" },
      { href: "/dashboard/configuracion", label: "Configuración", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 00-1.7-1L14.5 2h-4l-.3 2.4a7 7 0 00-1.7 1l-2.4-1-2 3.4L4 10a7 7 0 000 2l-2 1.6 2 3.4 2.4-1a7 7 0 001.7 1l.3 2.4h4l.3-2.4a7 7 0 001.7-1l2.4 1 2-3.4-2-1.6a7 7 0 00.1-1z" },
    ],
  },
]

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-6 px-3 py-4">
      {NAV.map((group) => (
        <div key={group.group}>
          <p className="px-2 pb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {group.group}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent font-medium text-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                    )}
                  >
                    <svg viewBox="0 0 24 24" fill="none" className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground")}>
                      <path d={item.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

import { useProject } from "@/lib/project-context"

function ProjectCard() {
  const { data, isCustom, resetToDemo, savedCustomProject, restoreSavedCustom } = useProject()
  const p = data.project
  const isZip = isCustom && (p.source?.toLowerCase().endsWith(".zip") || p.commit === "zip-local")

  return (
    <div className="mx-3 mb-3 flex flex-col gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3">
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn("size-2 shrink-0 rounded-full", isCustom ? "bg-primary" : "bg-detected")} />
          <span className="truncate font-mono text-xs font-semibold text-foreground" title={p.fullName || p.name}>
            {p.name}
          </span>
        </div>
        <span className={cn(
          "shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider",
          isCustom ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
        )}>
          {isCustom ? (isZip ? "ZIP" : "Tu repo") : "Demo"}
        </span>
      </div>
      <div className="font-mono text-[10px] text-muted-foreground truncate">
        {isZip ? "Archivo .zip local" : `${p.branch} @ ${p.commit}`}
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-sidebar-border/60 pt-2 text-[11px]">
        <Link href="/onboarding" className="text-primary hover:underline font-medium">
          + Cambiar {isZip ? "código" : "repo"}
        </Link>
        {isCustom ? (
          <button
            type="button"
            onClick={resetToDemo}
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Ver demo
          </button>
        ) : savedCustomProject ? (
          <button
            type="button"
            onClick={restoreSavedCustom}
            className="text-primary hover:underline transition-colors font-medium truncate max-w-[100px]"
            title={`Volver a ${savedCustomProject.project.name}`}
          >
            ← Volver a {savedCustomProject.project.name}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground"
          aria-label="Abrir menú"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-5">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Logo />
        </div>
        <div className="flex flex-1 flex-col justify-between overflow-y-auto">
          <NavList pathname={pathname} />
          <ProjectCard />
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-sidebar-border bg-sidebar">
            <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-md text-muted-foreground" aria-label="Cerrar menú">
                <svg viewBox="0 0 24 24" fill="none" className="size-5"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="flex flex-1 flex-col justify-between overflow-y-auto">
              <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
              <ProjectCard />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
