"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { ConfidenceBadge } from "@/components/signals"
import { useProject } from "@/lib/project-context"

export function DocsView() {
  const { data } = useProject()
  const { docSections, glossary, project } = data
  const [copied, setCopied] = useState(false)

  function exportMarkdown() {
    let md = `# Documentación de ${project.fullName || project.name}\n\n`
    md += `*Generado por Cartógrafo el ${new Date(project.analyzedAt).toLocaleDateString("es")} sobre el commit ${project.commit}*\n\n`

    docSections.forEach((s) => {
      md += `## ${s.title}\n\n${s.body}\n\n`
    })

    md += `## Glosario del Dominio\n\n`
    glossary.forEach((g) => {
      md += `- **${g.term}**: ${g.definition} *(${g.confidence})*\n`
    })

    const blob = new Blob([md], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${project.name}-documentacion.md`
    a.click()
    URL.revokeObjectURL(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        breadcrumb="Documentación"
        title="Documentación generada"
        desc="Consolidada por el agente de Documentación a partir de los hallazgos validados. Nada llega acá sin evidencia trazable."
      >
        <Button variant="outline" size="sm" onClick={exportMarkdown}>
          {copied ? "Descargado ✓" : "Exportar Markdown"}
        </Button>
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
        {/* Documento */}
        <article className="flex flex-col gap-6">
          {docSections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-8 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
                <h2 className="text-lg font-semibold text-foreground">{s.title}</h2>
                <span className="font-mono text-xs text-muted-foreground">{s.source}</span>
              </div>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground whitespace-pre-line">{s.body}</p>
            </section>
          ))}

          {/* Glosario */}
          <section id="glosario" className="scroll-mt-8 rounded-xl border border-border bg-card p-6">
            <h2 className="border-b border-border pb-3 text-lg font-semibold text-foreground">Glosario del dominio</h2>
            <dl className="mt-4 flex flex-col divide-y divide-border">
              {glossary.map((g) => (
                <div key={g.term} className="flex flex-col gap-1 py-3 first:pt-0 sm:flex-row sm:items-baseline sm:gap-4">
                  <dt className="flex items-center gap-2 sm:w-40 sm:shrink-0">
                    <span className="font-mono text-sm font-semibold text-foreground">{g.term}</span>
                  </dt>
                  <dd className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {g.definition}
                    <ConfidenceBadge value={g.confidence} className="ml-2 align-middle" />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </article>

        {/* Índice */}
        <aside className="hidden lg:block">
          <div className="sticky top-8 rounded-xl border border-border bg-card p-5">
            <div className="font-mono text-xs uppercase tracking-wide text-muted-foreground">En esta página</div>
            <nav className="mt-3 flex flex-col gap-1 text-sm">
              {[...docSections.map((s) => ({ id: s.id, title: s.title })), { id: "glosario", title: "Glosario del dominio" }].map((s) => (
                <a key={s.id} href={`#${s.id}`} className="rounded px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground">
                  {s.title}
                </a>
              ))}
            </nav>
            <div className="mt-4 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">
              Basado en {project.commit} · {project.branch}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
