"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { ConfidenceBadge } from "@/components/signals"
import { agentList, roleLabels, type Role } from "@/lib/data"
import { useProject } from "@/lib/project-context"
import { loadConfig, saveConfig, type OnboardingConfig } from "@/lib/session"
import { cn } from "@/lib/utils"

const ROLES: Role[] = ["junior", "semi", "senior"]
const INTEGRATIONS = [
  { id: "slack", name: "Slack" },
  { id: "jira", name: "Jira" },
  { id: "confluence", name: "Confluence" },
]

export default function SettingsPage() {
  const router = useRouter()
  const { data, analyzeRepo, resetToDemo, isCustom } = useProject()
  const { project, modules } = data

  const [cfg, setCfg] = useState<OnboardingConfig>({
    repo: project.source,
    source: "git",
    role: "junior",
    moduleId: "all",
    integrations: [],
  })
  const [token, setToken] = useState("")
  const [saved, setSaved] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = loadConfig()
    if (stored) {
      setCfg(stored)
    } else {
      setCfg((c) => ({ ...c, repo: project.source }))
    }
  }, [project.source])

  function update(patch: Partial<OnboardingConfig>) {
    setCfg((c) => ({ ...c, ...patch }))
    setSaved(false)
  }

  function persist() {
    saveConfig(cfg)
    setSaved(true)
  }

  async function handleReanalyze() {
    if (!cfg.repo || cfg.repo.trim().length < 3) return
    setAnalyzing(true)
    setError(null)
    try {
      await analyzeRepo(cfg.repo.trim(), cfg.role, cfg.moduleId, token.trim() || undefined)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Error al re-analizar el repositorio")
    } finally {
      setAnalyzing(false)
    }
  }

  function toggleIntegration(id: string) {
    update({
      integrations: cfg.integrations.includes(id)
        ? cfg.integrations.filter((x) => x !== id)
        : [...cfg.integrations, id],
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        breadcrumb="Configuración"
        title="Configuración del análisis"
        desc="Ajustá el perfil, el área de foco y las integraciones. Los cambios se aplican en el próximo re-análisis."
      >
        <div className="flex items-center gap-2">
          <Button onClick={persist} variant="outline" size="sm">
            {saved ? "Guardado ✓" : "Guardar cambios"}
          </Button>
          <Button onClick={handleReanalyze} disabled={analyzing} size="sm">
            {analyzing ? "Analizando…" : "Re-analizar ahora"}
          </Button>
        </div>
      </PageHeader>

      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Fuente */}
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold">Repositorio</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="repo" className="text-sm text-muted-foreground">Origen del repositorio</label>
          <div className="flex gap-2">
            <input
              id="repo"
              value={cfg.repo}
              onChange={(e) => update({ repo: e.target.value })}
              placeholder="https://github.com/usuario/repositorio"
              className="h-10 flex-1 rounded-lg border border-input bg-background px-3.5 font-mono text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40"
            />
            <Button onClick={handleReanalyze} disabled={analyzing} size="default">
              {analyzing ? "Cargando…" : "Analizar"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="token" className="text-sm text-muted-foreground">GitHub Personal Access Token (opcional para repos privados o cuota alta)</label>
          <input
            id="token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="github_pat_..."
            className="h-10 w-full rounded-lg border border-input bg-background px-3.5 font-mono text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40"
          />
          <p className="text-xs text-muted-foreground">
            Si tenés un token configurado en .env.local, se usará automáticamente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4 font-mono text-xs text-muted-foreground">
          <span>Rama: <span className="text-foreground">{project.branch}</span></span>
          <span>Commit: <span className="text-foreground">{project.commit}</span></span>
          <span>Último análisis: <span className="text-foreground">{new Date(project.analyzedAt).toLocaleDateString("es")}</span></span>
        </div>
      </section>

      {/* Perfil y foco */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Perfil de onboarding</h2>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => update({ role: r })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  cfg.role === r ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {roleLabels[r]}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Define profundidad y orden del tour guiado.</p>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Área de foco</h2>
          <select
            value={cfg.moduleId}
            onChange={(e) => update({ moduleId: e.target.value })}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40"
          >
            <option value="all">Todo el proyecto</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>{m.name} — {m.path}</option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground">Prioriza documentación y tour hacia el módulo elegido.</p>
        </div>
      </section>

      {/* Integraciones */}
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
        <div>
          <h2 className="text-base font-semibold">Integraciones</h2>
          <p className="mt-1 text-sm text-muted-foreground">Solo lectura, vía OAuth. Se activan con tu consentimiento explícito.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {INTEGRATIONS.map((it) => {
            const active = cfg.integrations.includes(it.id)
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => toggleIntegration(it.id)}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-4 py-3 text-sm transition-colors",
                  active ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {it.name}
                <span className={cn("font-mono text-[11px] uppercase", active ? "text-detected" : "text-muted-foreground")}>
                  {active ? "conectado" : "off"}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Pipeline de agentes */}
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Pipeline de agentes</h2>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-detected">
            <span className="size-1.5 rounded-full bg-detected" /> todos operativos
          </span>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {agentList.map((a) => (
            <li key={a.name} className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
              <span className="grid size-6 shrink-0 place-items-center rounded-md border border-border bg-background font-mono text-[10px] text-primary">
                {a.name.slice(0, 2)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm text-foreground">{a.name}</span>
              </span>
              <span className="ml-auto size-1.5 rounded-full bg-detected" />
            </li>
          ))}
        </ul>
      </section>

      {/* Datos y re-análisis */}
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold">Datos y re-análisis</h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 p-4">
            <div>
              <div className="text-sm font-medium text-foreground">Re-análisis completo</div>
              <div className="text-xs text-muted-foreground">Vuelve a inspeccionar el repositorio en busca de nuevos commits o ramas.</div>
            </div>
            <Button onClick={handleReanalyze} disabled={analyzing} variant="outline" size="sm">
              {analyzing ? "Ejecutando…" : "Ejecutar"}
            </Button>
          </div>
          {isCustom && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <div>
                <div className="text-sm font-medium text-foreground">Restaurar proyecto demo</div>
                <div className="text-xs text-muted-foreground">Vuelve al monolito de ejemplo nucleo-banca.</div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  resetToDemo()
                  router.push("/dashboard")
                }}
              >
                Volver a demo
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          <ConfidenceBadge value="detectado" className="mr-1 align-middle" />
          Cartógrafo nunca modifica tu repositorio: el acceso es de solo lectura.
        </p>
      </section>
    </div>
  )
}
