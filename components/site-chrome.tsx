"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { DemoButton } from "@/components/demo-button"
import { useProject } from "@/lib/project-context"

export function SiteNav() {
  const router = useRouter()
  const { isCustom, data, savedCustomProject, restoreSavedCustom } = useProject()

  const customName = isCustom ? data.project.name : savedCustomProject?.project?.name

  const handleIrAMiProyecto = () => {
    if (!isCustom && savedCustomProject) {
      restoreSavedCustom()
    }
    router.push("/dashboard")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#como-funciona" className="transition-colors hover:text-foreground">Cómo funciona</a>
          <a href="#agentes" className="transition-colors hover:text-foreground">Agentes</a>
          <a href="#casos" className="transition-colors hover:text-foreground">Casos de uso</a>
          <a href="#precios" className="transition-colors hover:text-foreground">Precios</a>
        </nav>
        <div className="flex items-center gap-2">
          {customName && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleIrAMiProyecto}
              className="hidden sm:inline-flex border-primary/40 text-primary hover:text-primary hover:bg-primary/10 gap-1.5"
              title={`Ir al dashboard de ${customName}`}
            >
              <span className="size-1.5 rounded-full bg-primary" />
              <span className="max-w-[120px] truncate">{customName}</span>
            </Button>
          )}
          <DemoButton variant="ghost" size="sm" className="hidden sm:inline-flex">
            Ver demo
          </DemoButton>
          <Button asChild size="sm">
            <Link href="/onboarding">Analizar repo</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  const { isCustom, resetToDemo } = useProject()

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Onboarding inteligente sobre código legacy. Basado en evidencia, nunca en suposiciones.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <Link href="/onboarding" className="hover:text-foreground">Empezar</Link>
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <Link href="/dashboard?demo=true" onClick={() => resetToDemo()} className="hover:text-foreground">
            Ver demo
          </Link>
          <Link href="/tour" className="hover:text-foreground">Tour guiado</Link>
          <a href="#agentes" className="hover:text-foreground">Agentes</a>
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto max-w-6xl px-5 py-4 font-mono text-xs text-muted-foreground">
          © 2026 Cartógrafo · Hecho para equipos que heredan código.
        </div>
      </div>
    </footer>
  )
}
