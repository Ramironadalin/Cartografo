"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Logo } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { modules, type Role } from "@/lib/data"
import { useProject } from "@/lib/project-context"
import { saveConfig } from "@/lib/session"
import { cn } from "@/lib/utils"

type Step = 0 | 1 | 2 | 3 | 4

const STEP_TITLES = ["Repositorio", "Rol", "Área de trabajo", "Integraciones", "Análisis"]

const ROLE_INFO: { id: Role; title: string; desc: string }[] = [
  { id: "junior", title: "Junior", desc: "Tour didáctico y explicativo. Más contexto, ritmo pausado, primeras tareas de bajo riesgo." },
  { id: "semi", title: "Semi-senior", desc: "Balance entre contexto y densidad. Foco en flujos críticos y su deuda." },
  { id: "senior", title: "Senior", desc: "Directo y técnico. Riesgos, acoplamiento y plan de estabilización primero." },
]

const INTEGRATIONS = [
  { id: "slack", name: "Slack", desc: "Indexar menciones al módulo en canales." },
  { id: "jira", name: "Jira", desc: "Cruzar tickets y bugs con el código." },
  { id: "confluence", name: "Confluence", desc: "Incorporar documentación existente." },
]

const ANALYSIS_AGENTS = [
  "Explorador de Código (árbol de archivos y metadatos)",
  "Arquitectura (detección de capas y patrones)",
  "Flujos de Negocio (trazado de rutas y puntos de entrada)",
  "Base de Datos (mapeo de entidades y esquemas)",
  "Legacy Analyzer (auditoría de riesgos y dependencias)",
  "Test Analyzer (cobertura y suites de prueba)",
  "Orquestador (validación cruzada de consistencia)",
  "Documentación (redacción de guías y glosario)",
  "Mentor de Onboarding (personalización de tour por rol)",
]

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-mono text-sm text-muted-foreground">Cargando onboarding…</div>}>
      <OnboardingContent />
    </Suspense>
  )
}

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRepoParam = searchParams.get("repo")

  const [step, setStep] = useState<Step>(0)
  const [repo, setRepo] = useState(initialRepoParam || "")
  const [source, setSource] = useState<"git" | "zip">("git")
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [role, setRole] = useState<Role>("junior")
  const [moduleId, setModuleId] = useState("all")
  const [integrations, setIntegrations] = useState<string[]>([])

  const canContinue =
    step === 0
      ? source === "git"
        ? repo.trim().length > 3
        : zipFile !== null
      : true

  function next() {
    if (step < 3) setStep((s) => (s + 1) as Step)
    else if (step === 3) startAnalysis()
  }

  function back() {
    if (step === 0) {
      router.push("/")
    } else if (step > 0 && step < 4) {
      setStep((s) => (s - 1) as Step)
    }
  }

  function startAnalysis() {
    saveConfig({
      repo: source === "git" ? repo : (zipFile?.name || "proyecto.zip"),
      source,
      role,
      moduleId,
      integrations,
      completedAt: new Date().toISOString(),
    })
    setStep(4)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <Logo />
          <span className="font-mono text-xs text-muted-foreground">Onboarding</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
        {step < 4 && <Stepper current={step} />}

        <div className="mt-8">
          {step === 0 && (
            <RepoStep
              repo={repo}
              setRepo={setRepo}
              source={source}
              setSource={setSource}
              zipFile={zipFile}
              setZipFile={setZipFile}
            />
          )}
          {step === 1 && <RoleStep role={role} setRole={setRole} />}
          {step === 2 && <ModuleStep moduleId={moduleId} setModuleId={setModuleId} />}
          {step === 3 && <IntegrationsStep integrations={integrations} setIntegrations={setIntegrations} />}
          {step === 4 && (
            <AnalysisStep
              repo={repo}
              source={source}
              zipFile={zipFile}
              role={role}
              moduleId={moduleId}
              onDone={() => router.push("/dashboard")}
              onBack={() => setStep(0)}
            />
          )}
        </div>

        {step < 4 && (
          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <Button variant="ghost" onClick={back}>
              Atrás
            </Button>
            <Button onClick={next} disabled={!canContinue} size="lg">
              {step === 3 ? "Iniciar análisis" : "Continuar"}
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2">
      {STEP_TITLES.slice(0, 4).map((t, i) => (
        <li key={t} className="flex flex-1 items-center gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full border font-mono text-[11px]",
                i < current
                  ? "border-primary bg-primary text-primary-foreground"
                  : i === current
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground",
              )}
            >
              {i < current ? "✓" : i + 1}
            </span>
            <span className={cn("hidden text-xs sm:inline", i === current ? "text-foreground" : "text-muted-foreground")}>
              {t}
            </span>
          </div>
          {i < 3 && <span className={cn("h-px flex-1", i < current ? "bg-primary" : "bg-border")} />}
        </li>
      ))}
    </ol>
  )
}

function StepHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function RepoStep({
  repo,
  setRepo,
  source,
  setSource,
  zipFile,
  setZipFile,
}: {
  repo: string
  setRepo: (v: string) => void
  source: "git" | "zip"
  setSource: (v: "git" | "zip") => void
  zipFile: File | null
  setZipFile: (file: File | null) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const suggestions = [
    { label: "Monolito Bancario (Demo)", url: "https://github.com/banco-andes/nucleo-banca" },
    { label: "Express.js", url: "https://github.com/expressjs/express" },
    { label: "React", url: "https://github.com/facebook/react" },
  ]

  function handleFile(file: File) {
    if (file.name.toLowerCase().endsWith(".zip")) {
      setZipFile(file)
      setRepo(file.name)
    } else {
      alert("Por favor seleccioná un archivo comprimido .zip válido.")
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title="Conectá tu código"
        desc="Pegá el enlace de tu repositorio o subí un archivo .zip de tu proyecto. Analizamos la arquitectura de forma segura."
      />
      <div className="grid grid-cols-2 gap-2">
        {(["git", "zip"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSource(s)}
            className={cn(
              "rounded-lg border p-4 text-left transition-colors",
              source === s ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-border/80",
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn("size-2 rounded-full", source === s ? "bg-primary" : "bg-muted-foreground/40")} />
              <div className="font-medium text-foreground">{s === "git" ? "Enlace Git / GitHub" : "Subir archivo .zip"}</div>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {s === "git" ? "GitHub, GitLab o Bitbucket público/privado" : "Comprimido del proyecto (descompresión directa)"}
            </div>
          </button>
        ))}
      </div>

      {source === "git" ? (
        <div className="flex flex-col gap-3">
          <label htmlFor="repo" className="text-sm font-medium">URL de tu repositorio</label>
          <input
            id="repo"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="https://github.com/tu-usuario/tu-repositorio"
            className="h-11 w-full rounded-lg border border-input bg-card px-3.5 font-mono text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40"
          />

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="font-mono text-xs text-muted-foreground">Sugerencias rápidas:</span>
            {suggestions.map((s) => (
              <button
                key={s.url}
                type="button"
                onClick={() => setRepo(s.url)}
                className={cn(
                  "rounded border px-2 py-0.5 font-mono text-xs transition-colors",
                  repo === s.url ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Soporta enlaces públicos y privados autenticados con tu token de GitHub.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,application/zip"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
          />

          {!zipFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all",
                isDragging
                  ? "border-primary bg-primary/10 scale-[0.99]"
                  : "border-border bg-card hover:border-primary/50 hover:bg-card/80",
              )}
            >
              <div className="grid size-12 place-items-center rounded-xl border border-border bg-secondary/50 text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                <svg viewBox="0 0 24 24" fill="none" className="size-6">
                  <path d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <span className="block text-sm font-semibold text-foreground">Arrastrá tu archivo .zip acá</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">o hacé clic para seleccionarlo desde tu equipo</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/40 px-3 py-1 font-mono text-[11px] text-muted-foreground">
                <span>📦 .zip</span>
                <span>•</span>
                <span>Hasta 500 MB</span>
                <span>•</span>
                <span>Procesado seguro en memoria</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                    <svg viewBox="0 0 24 24" fill="none" className="size-5">
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-mono text-sm font-semibold text-foreground">
                        {zipFile.name}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-detected/40 bg-detected/10 px-2 py-0.5 text-[10px] font-medium text-detected">
                        ✓ Listo
                      </span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {formatFileSize(zipFile.size)} · Archivo ZIP
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Cambiar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      setZipFile(null)
                      setRepo("")
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                  >
                    Quitar
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground border-t border-border/40 pt-2.5">
                Al continuar, descomprimiremos el proyecto para auditar la estructura de archivos, módulos, capas y riesgos con nuestros 9 agentes.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RoleStep({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title="¿Quién hace el onboarding?"
        desc="El tour ajusta profundidad, orden y tono según el rol. Podés cambiarlo más tarde."
      />
      <div className="flex flex-col gap-3">
        {ROLE_INFO.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            className={cn(
              "flex items-start gap-4 rounded-lg border p-4 text-left transition-colors",
              role === r.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-border/80",
            )}
          >
            <span
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border",
                role === r.id ? "border-primary" : "border-border",
              )}
            >
              {role === r.id && <span className="size-2.5 rounded-full bg-primary" />}
            </span>
            <span>
              <span className="block font-medium text-foreground">{r.title}</span>
              <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">{r.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ModuleStep({ moduleId, setModuleId }: { moduleId: string; setModuleId: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title="¿En qué área vas a trabajar?"
        desc="Opcional. Priorizamos el tour y la documentación hacia el módulo elegido. Elegí 'Todo el proyecto' si aún no lo sabés."
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setModuleId("all")}
          className={cn(
            "rounded-lg border p-4 text-left transition-colors",
            moduleId === "all" ? "border-primary bg-primary/5" : "border-border bg-card hover:border-border/80",
          )}
        >
          <div className="font-medium text-foreground">Todo el proyecto</div>
          <div className="mt-1 text-xs text-muted-foreground">Visión general completa</div>
        </button>
        {modules.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setModuleId(m.id)}
            className={cn(
              "rounded-lg border p-4 text-left transition-colors",
              moduleId === m.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-border/80",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-foreground">{m.name}</span>
            </div>
            <div className="mt-1 font-mono text-xs text-muted-foreground">{m.path}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function IntegrationsStep({
  integrations,
  setIntegrations,
}: {
  integrations: string[]
  setIntegrations: (v: string[]) => void
}) {
  function toggle(id: string) {
    setIntegrations(integrations.includes(id) ? integrations.filter((x) => x !== id) : [...integrations, id])
  }
  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title="Integraciones (opcional)"
        desc="Solo con tu consentimiento explícito. Indexamos menciones al módulo para enriquecer el contexto. Podés omitir este paso."
      />
      <div className="flex flex-col gap-3">
        {INTEGRATIONS.map((it) => {
          const active = integrations.includes(it.id)
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => toggle(it.id)}
              className={cn(
                "flex items-center justify-between gap-4 rounded-lg border p-4 text-left transition-colors",
                active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-border/80",
              )}
            >
              <span>
                <span className="block font-medium text-foreground">{it.name}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{it.desc}</span>
              </span>
              <span
                className={cn(
                  "relative h-6 w-10 shrink-0 rounded-full border transition-colors",
                  active ? "border-primary bg-primary/30" : "border-border bg-secondary",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-4 rounded-full transition-all",
                    active ? "left-[1.375rem] bg-primary" : "left-0.5 bg-muted-foreground",
                  )}
                />
              </span>
            </button>
          )
        })}
      </div>
      <p className="rounded-lg border border-border bg-secondary/30 p-3 text-xs text-muted-foreground">
        Las credenciales se manejan con OAuth y permisos de solo lectura. Nunca se almacenan tokens en texto plano.
      </p>
    </div>
  )
}

function AnalysisStep({
  repo,
  source,
  zipFile,
  role,
  moduleId,
  onDone,
  onBack,
}: {
  repo: string
  source: "git" | "zip"
  zipFile: File | null
  role: Role
  moduleId: string
  onDone: () => void
  onBack: () => void
}) {
  const { analyzeRepo, analyzeZip, resetToDemo } = useProject()
  const [done, setDone] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState<boolean>(true)

  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    if (source === "zip") {
      if (!zipFile) {
        setError("No se ha seleccionado ningún archivo .zip para analizar.")
        setAnalyzing(false)
        return
      }

      const stepTimer = setInterval(() => {
        setDone((d) => Math.min(ANALYSIS_AGENTS.length - 1, d + 1))
      }, 400)

      analyzeZip(zipFile, role, moduleId)
        .then(() => {
          clearInterval(stepTimer)
          setDone(ANALYSIS_AGENTS.length)
          setAnalyzing(false)
          setTimeout(onDone, 700)
        })
        .catch((err) => {
          clearInterval(stepTimer)
          setAnalyzing(false)
          setError(err.message || "Error al descomprimir y procesar el archivo .zip.")
        })

      return () => {
        clearInterval(stepTimer)
      }
    }

    // Git source
    if (repo.includes("banco-andes/nucleo-banca")) {
      resetToDemo()
      const timer = setInterval(() => {
        setDone((d) => {
          if (d >= ANALYSIS_AGENTS.length) {
            clearInterval(timer)
            setTimeout(onDone, 600)
            return d
          }
          return d + 1
        })
      }, 350)
      return () => clearInterval(timer)
    }

    // Call real analyze API
    const stepTimer = setInterval(() => {
      setDone((d) => Math.min(ANALYSIS_AGENTS.length - 1, d + 1))
    }, 550)

    analyzeRepo(repo, role, moduleId)
      .then(() => {
        clearInterval(stepTimer)
        setDone(ANALYSIS_AGENTS.length)
        setAnalyzing(false)
        setTimeout(onDone, 800)
      })
      .catch((err) => {
        clearInterval(stepTimer)
        setAnalyzing(false)
        setError(err.message || "Error al analizar el repositorio.")
      })

    return () => {
      clearInterval(stepTimer)
    }
  }, [repo, source, zipFile, role, moduleId, analyzeRepo, analyzeZip, resetToDemo, onDone])

  const pct = Math.min(100, Math.round((done / ANALYSIS_AGENTS.length) * 100))

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title={source === "zip" ? "Analizando archivo ZIP" : "Analizando el repositorio"}
        desc="Nuestros agentes especializados están inspeccionando el código en tiempo real para generar la Capa de Conocimiento."
      />

      {error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6">
          <div className="flex items-center gap-2 font-semibold text-destructive">
            <svg viewBox="0 0 24 24" fill="none" className="size-5">
              <path d="M12 9v4m0 4h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            No se pudo completar el análisis
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={onBack}>
              {source === "zip" ? "Cambiar archivo .zip" : "Modificar URL"}
            </Button>
            <Button
              onClick={() => {
                hasStartedRef.current = false
                setError(null)
                setAnalyzing(true)
                setDone(1)
              }}
            >
              Reintentar
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span className="truncate max-w-[400px]">
              {source === "zip" ? `📦 ${zipFile?.name || repo}` : repo}
            </span>
            <span className="tabular-nums font-semibold text-foreground">{pct}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-6 flex flex-col gap-2.5">
            {ANALYSIS_AGENTS.map((a, i) => {
              const state = i < done ? "done" : i === done ? "running" : "pending"
              return (
                <li key={a} className="flex items-center gap-3 font-mono text-sm">
                  <span
                    className={cn(
                      "grid size-5 place-items-center rounded-full border text-[10px]",
                      state === "done" && "border-detected/40 bg-detected/10 text-detected",
                      state === "running" && "border-primary/50 bg-primary/10 text-primary animate-pulse",
                      state === "pending" && "border-border text-muted-foreground",
                    )}
                  >
                    {state === "done" ? "✓" : state === "running" ? "•" : ""}
                  </span>
                  <span className={cn(state === "pending" ? "text-muted-foreground" : "text-foreground")}>{a}</span>
                  {state === "running" && <span className="text-xs text-primary font-sans">analizando…</span>}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
