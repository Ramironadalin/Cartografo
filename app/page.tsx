import Link from "next/link"
import { SiteNav, SiteFooter } from "@/components/site-chrome"
import { Button } from "@/components/ui/button"
import { DemoButton } from "@/components/demo-button"
import { ConfidenceBadge } from "@/components/signals"
import { agentList } from "@/lib/data"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <Agents />
        <UseCases />
        <Pricing />
        <FinalCta />
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Cartógrafo",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
            description:
              "Plataforma de onboarding inteligente sobre código legacy: documentación, arquitectura, deuda técnica y tour guiado a partir de un repositorio.",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-detected" />
          Basado en evidencia · nunca alucina
        </div>
        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Entendé cualquier base de código legacy en <span className="text-primary">horas</span>, no en meses.
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Cartógrafo analiza tu repositorio y genera documentación, mapas de arquitectura, un reporte de
          deuda técnica y un tour de onboarding personalizado según el rol de cada desarrollador. Cada
          afirmación es trazable hasta el archivo y la línea que la respalda.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link href="/onboarding">Analizar mi repositorio</Link>
          </Button>
          <DemoButton size="lg" variant="outline">
            Explorar demo en vivo
          </DemoButton>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><ConfidenceBadge value="detectado" /> hechos extraídos del código</span>
          <span className="inline-flex items-center gap-2"><ConfidenceBadge value="inferido" /> hipótesis marcadas siempre</span>
        </div>

        <HeroPanel />
      </div>
    </section>
  )
}

function HeroPanel() {
  return (
    <div className="mt-14 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-risk-critical/70" />
        <span className="size-2.5 rounded-full bg-inferred/70" />
        <span className="size-2.5 rounded-full bg-detected/70" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">cartografo · nucleo-banca @ a3f91c2</span>
      </div>
      <div className="grid gap-px bg-border md:grid-cols-3">
        {[
          { k: "Líneas analizadas", v: "214.530", s: "1.284 archivos" },
          { k: "Módulos mapeados", v: "7", s: "grafo de acoplamiento" },
          { k: "Riesgos detectados", v: "7", s: "3 críticos" },
        ].map((c) => (
          <div key={c.k} className="bg-card p-5">
            <div className="font-mono text-2xl font-semibold tabular-nums text-foreground">{c.v}</div>
            <div className="mt-1 text-sm text-foreground">{c.k}</div>
            <div className="text-xs text-muted-foreground">{c.s}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-border p-5 font-mono text-xs leading-relaxed text-muted-foreground">
        <div><span className="text-detected">✓ detectado</span>  Spring 4.3.30, Hibernate 5.2.17, Struts 2.3.34</div>
        <div><span className="text-inferred">~ inferido </span>  arquitectura MVC en 4 capas</div>
        <div><span className="text-risk-critical">! crítico  </span>  Struts 2.3.34 con RCE conocido · pom.xml:44-47</div>
      </div>
    </div>
  )
}

function TrustStrip() {
  return (
    <section className="border-b border-border bg-secondary/20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-8 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          El costo real del onboarding
        </p>
        <div className="grid w-full gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
          {[
            { v: "3-9 meses", l: "para que un dev sea productivo en un monolito heredado" },
            { v: "60%", l: "del tiempo inicial se va en leer código sin guía" },
            { v: "1 tarde", l: "es lo que tarda Cartógrafo en mapear el proyecto" },
          ].map((s) => (
            <div key={s.l} className="bg-background px-6 py-6">
              <div className="text-2xl font-semibold text-foreground">{s.v}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Conectá el repositorio",
      d: "Pegá un link de Git o subí un .zip. Elegí el rol (junior a senior) y el módulo donde vas a trabajar.",
    },
    {
      n: "02",
      t: "Los agentes analizan en paralelo",
      d: "Nueve agentes especializados recorren estructura, arquitectura, flujos, datos, riesgos y tests. El Orquestador valida la consistencia cruzada.",
    },
    {
      n: "03",
      t: "Se consolida la Capa de Conocimiento",
      d: "Todo hallazgo se guarda con su origen y su nivel de confianza. Es la única fuente de verdad para la documentación y el tour.",
    },
    {
      n: "04",
      t: "Recibís tu tour personalizado",
      d: "Un recorrido paso a paso con código real embebido, ordenado según tu rol y con la justificación de por qué empezar por ahí.",
    },
  ]
  return (
    <section id="como-funciona" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading
          kicker="Cómo funciona"
          title="De un repositorio crudo a un mapa navegable"
          desc="Un pipeline transparente donde cada paso deja rastro de su evidencia."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="flex flex-col gap-3 bg-card p-6">
              <span className="font-mono text-sm text-primary">{s.n}</span>
              <h3 className="text-base font-semibold text-foreground">{s.t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Agents() {
  return (
    <section id="agentes" className="border-b border-border bg-secondary/20">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading
          kicker="Sistema multi-agente"
          title="Nueve especialistas, una sola fuente de verdad"
          desc="Cada agente es un módulo independiente con su propio contrato de entrada/salida. Ninguno lee la salida cruda de otro: se comunican solo a través de la Capa de Conocimiento."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {agentList.map((a) => (
            <div key={a.name} className="flex flex-col gap-2 bg-card p-6">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-md border border-border bg-secondary/50 font-mono text-xs text-primary">
                  {a.name.slice(0, 2)}
                </span>
                <h3 className="font-mono text-sm font-semibold text-foreground">{a.name}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{a.role}</p>
              <p className="mt-1 border-t border-border/70 pt-2 text-xs text-muted-foreground">
                <span className="font-mono uppercase tracking-wide text-foreground/70">Regla dura: </span>
                {a.hard}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function UseCases() {
  const cases = [
    { t: "Onboarding de nuevos ingresos", d: "Un junior arranca con un tour didáctico; un senior, con el mapa de riesgos. El mismo repo, distinta profundidad." },
    { t: "Auditoría de deuda técnica", d: "Reporte priorizado de dependencias obsoletas, clases Dios, código sin tests y problemas de seguridad, cada uno con su evidencia." },
    { t: "Traspaso de proyectos", d: "Cuando un equipo hereda un sistema sin autores originales, Cartógrafo reconstruye la arquitectura y los flujos desde el código." },
    { t: "Documentación siempre viva", d: "Re-análisis incremental: cuando el repo cambia, la Capa de Conocimiento se actualiza sin recalcular todo desde cero." },
  ]
  return (
    <section id="casos" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading kicker="Casos de uso" title="Pensado para equipos que heredan código" />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {cases.map((c) => (
            <div key={c.t} className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-base font-semibold text-foreground">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const plans = [
    { name: "Explorador", price: "Gratis", desc: "Para probar en un repo público.", features: ["1 repositorio", "Análisis completo", "Documentación generada", "Tour para 1 rol"], cta: "Empezar gratis", highlight: false },
    { name: "Equipo", price: "US$29", per: "/dev/mes", desc: "Para squads que heredan sistemas.", features: ["Repos ilimitados", "Los 3 roles de tour", "Integraciones Slack/Jira/Confluence", "Re-análisis incremental", "Trazabilidad a línea y commit"], cta: "Analizar mi repo", highlight: true },
    { name: "Empresa", price: "A medida", desc: "Para organizaciones con on-premise.", features: ["Despliegue self-hosted", "SSO / SAML", "Auditoría y control de accesos", "Soporte dedicado"], cta: "Hablar con ventas", highlight: false },
  ]
  return (
    <section id="precios" className="border-b border-border bg-secondary/20">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading kicker="Precios" title="Simple y por desarrollador" />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-xl border p-6 ${p.highlight ? "border-primary/50 bg-card ring-1 ring-primary/30" : "border-border bg-card"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-semibold uppercase tracking-wide text-foreground">{p.name}</h3>
                {p.highlight ? <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[11px] text-primary">Popular</span> : null}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-foreground">{p.price}</span>
                {p.per ? <span className="text-sm text-muted-foreground">{p.per}</span> : null}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-muted-foreground">
                    <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 size-4 shrink-0 text-detected">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 w-full" variant={p.highlight ? "default" : "outline"}>
                <Link href="/onboarding">{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Tu próximo proyecto legacy no tiene que doler.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          Conectá un repositorio y obtené un mapa navegable con evidencia trazable en minutos.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/onboarding">Analizar mi repositorio</Link>
          </Button>
          <DemoButton size="lg" variant="outline">
            Ver la demo
          </DemoButton>
        </div>
      </div>
    </section>
  )
}

function SectionHeading({ kicker, title, desc }: { kicker: string; title: string; desc?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">{kicker}</p>
      <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      {desc ? <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{desc}</p> : null}
    </div>
  )
}
