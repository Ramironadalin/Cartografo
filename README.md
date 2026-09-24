# 🗺️ Cartógrafo

> **Entendé cualquier base de código legacy en horas, no en meses.**  
> Plataforma de onboarding inteligente, análisis estático y cartografía viva para sistemas complejos y legacy.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![GitHub Actions](https://img.shields.io/badge/Deploy-GitHub_Pages-success?style=flat-square&logo=github-actions)](https://github.com/LuchoDB/Cartografo/actions)

---

## 📌 ¿Qué es Cartógrafo?

Incorporarse a un proyecto con una base de código legacy de cientos de miles de líneas suele requerir semanas o meses de arqueología de software, código indocumentado y dependencias obsoletas.

**Cartógrafo** automatiza este proceso: ingesta cualquier repositorio (mediante URL de GitHub o arrastrando un archivo ZIP local) y genera al instante una **cartografía viva y accionable** del sistema:
- Mapas visuales de arquitectura y grafos de dependencia.
- Flujos de negocio reconstruidos paso a paso.
- Modelo entidad-relación (ERD) interactivo.
- Matriz de riesgos, CVEs y deuda técnica priorizada.
- Un **Tour de Onboarding Guiado** adaptado al rol del desarrollador (Junior, Semi-Senior, Senior).

---

## 🛡️ Principio Fundacional: Cero Alucinaciones

A diferencia de asistentes genéricos que inventan explicaciones plausibles, Cartógrafo opera bajo un **estricto principio de evidencia**:

| Señal | Significado | Comportamiento |
| :--- | :--- | :--- |
| <kbd>**detectado**</kbd> | Hecho extraído directamente del código fuente | Trazable al archivo exacto, línea de código y commit. |
| <kbd>**inferido**</kbd> | Hipótesis deducida mediante patrones o heurísticas | Claramente etiquetada para que el equipo la valide sin asumir certezas falsas. |

---

## 🤖 Arquitectura Conceptual Multi-Agente

Cartógrafo modela el análisis del código a través de **9 agentes especializados**:

```
                          ┌──────────────────────────┐
                          │     🎯 Orquestador       │
                          │ (Síntesis de Conocimiento)│
                          └────────────┬─────────────┘
                                       │
     ┌──────────────────┬──────────────┼──────────────┬──────────────────┐
     │                  │              │              │                  │
┌────┴────────┐  ┌──────┴──────┐ ┌─────┴──────┐ ┌─────┴──────┐  ┌───────┴──────┐
│ 🔍          │  │ 🏛️          │ │ 🔀         │ │ 🗄️         │  │ ⚠️           │
│ Explorador  │  │ Arquitectura│ │ Flujos     │ │ BD & ERD   │  │ Legacy       │
│ (Archivos y │  │ (Capas y    │ │ (Casos de  │ │ (Tablas y  │  │ (Riesgos y    │
│  Métricas)  │  │  Grafos)    │ │  Negocio)  │ │  Relaciones│  │  Deuda Téc.) │
└─────────────┘  └─────────────┘ └────────────┘ └────────────┘  └──────────────┘
     │                  │              │              │                  │
     └──────────────────┴──────────────┼──────────────┴──────────────────┘
                                       │
                        ┌──────────────┴──────────────┐
                        │                             │
                 ┌──────┴───────┐              ┌──────┴───────┐
                 │ 🧪 Test      │              │ 📚 Docs      │
                 │ Analyzer     │              │ & Mentor     │
                 │ (Aserciones y│              │ (Tours por   │
                 │  Cobertura)  │              │  Seniority)  │
                 └──────────────┘              └──────────────┘
```

1. **Explorador**: Inventario de archivos, líneas de código, distribución de lenguajes y entrypoints.
2. **Arquitectura**: Detección de capas (Controladores, Servicios, Repositorios), patrones arquitectónicos y grafo de dependencias interactivo con detección de ciclos.
3. **Flujos**: Reconstrucción paso a paso de recorridos de negocio transversales (ej. *Transferencia Bancaria Inmediata*, *Autenticación y Sesión*).
4. **Base de Datos**: Extracción de entidades, claves primarias/foráneas, pools de conexiones (HikariCP, DBCP) y renderizado de diagrama ERD SVG interactivo.
5. **Legacy Analyzer**: Auditoría de dependencias obsoletas, versiones EOL (End of Life), flags de seguridad y matriz de riesgo (*Bajo, Medio, Alto, Crítico*).
6. **Test Analyzer**: Análisis de cobertura, tipos de tests (unitarios, integración), bibliotecas utilizadas (JUnit, Mockito) y zonas desprotegidas.
7. **Documentación**: Generación de documentación técnica viva, registro de decisiones arquitectónicas (ADRs) y glosario del dominio de negocio.
8. **Mentor**: Generación de un itinerario guiado de onboarding interactivo con hitos específicos según el seniority del desarrollador.
9. **Orquestador**: Consolidación y estructuración de la memoria central del proyecto analizado.

---

## 🚀 Modos de Ingesta

Cartógrafo ofrece 3 maneras de explorar un proyecto:

1. **Modo Demo en Vivo**: Carga inmediata de un caso de estudio real de alta complejidad (`nucleo-banca`: monolito bancario de 214.000 líneas con Spring 4 y Struts 2).
2. **Repositorio de GitHub**: Ingrese la URL de cualquier repositorio público (o privado mediante token) para clonar la estructura mediante la API REST de GitHub.
3. **Subida de ZIP Local**: Arrastre un archivo `.zip` de su proyecto. El análisis se ejecuta en memoria (usando `JSZip`), **garantizando que el código sensible de la empresa no sale del navegador**.

---

## 🧭 Vistas y Módulos del Dashboard

* 📊 **Vista General**: Métricas clave, distribución de lenguajes, frameworks detectados y resumen de salud.
* 🏛️ **Arquitectura**: Vista en capas y grafo interactivo de dependencias con filtros y zoom.
* 📦 **Módulos**: Aislamiento, acoplamiento aferente/eferente y responsabilidades de cada módulo.
* 🔀 **Flujos de Negocio**: Líneas de tiempo paso a paso con enlace directo a los archivos involucrados.
* 🗄️ **Base de Datos**: Tablero de configuración de conexión y diagrama interactivo Entidad-Relación (ERD).
* ⚠️ **Riesgos y Deuda**: Detección de vulnerabilidades conocidas (CVEs), bibliotecas deprecadas y deuda técnica.
* 🧪 **Tests**: Catálogo de suites de pruebas, ratio de cobertura y aserciones.
* 📖 **Documentación**: Manual vivo del sistema y glosario de términos de negocio.
* 🎓 **Tour de Onboarding**: Misiones paso a paso personalizadas según el perfil seleccionado.
* ⚙️ **Configuración**: Gestión del repositorio actual, tokens de acceso y exportación de reportes.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Framework Web** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, exportación estática) |
| **Biblioteca UI** | [React 19](https://react.dev/) |
| **Estilos & Diseño** | [Tailwind CSS v4](https://tailwindcss.com/) + CSS Variables dinámicas |
| **Iconografía** | [Lucide React](https://lucide.dev/) |
| **Componentes Base** | Radix / Shadcn UI / Base UI |
| **Procesamiento de Archivos** | [JSZip](https://stuk.github.io/jszip/) |
| **Tipado Estricto** | [TypeScript 5.7](https://www.typescriptlang.org/) |
| **CI / CD & Hosting** | GitHub Pages mediante [GitHub Actions](.github/workflows/deploy.yml) |
| **Automatización de Video** | Python 3 + Playwright + FFmpeg |

---

## 📂 Estructura del Proyecto

```
cartografo/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Pipeline de CI/CD para deploy en GitHub Pages
├── app/
│   ├── api/                        # API Routes de análisis (GitHub API & ZIP upload)
│   ├── dashboard/                  # Rutas y páginas del panel interactivo
│   │   ├── arquitectura/
│   │   ├── base-de-datos/
│   │   ├── configuracion/
│   │   ├── documentacion/
│   │   ├── flujos/
│   │   ├── modulos/
│   │   ├── riesgos/
│   │   └── tests/
│   ├── onboarding/                 # Flujo inicial de selección y carga de repositorios
│   ├── tour/                       # Experiencia del Tour de Onboarding guiado
│   ├── globals.css                 # Sistema de diseño y tokens de Tailwind v4
│   ├── layout.tsx                  # Layout raíz y metaetiquetas SEO / OpenGraph
│   └── page.tsx                    # Landing page principal
├── components/
│   ├── dashboard/                  # Componentes y widgets del dashboard
│   │   ├── views/                  # Vistas modulares de cada sección
│   │   ├── dependency-graph.tsx    # Grafo interactivo de dependencias
│   │   ├── erd-diagram.tsx         # Diagrama ERD interactivo en SVG
│   │   ├── flow-explorer.tsx       # Explorador visual de flujos de negocio
│   │   └── sidebar.tsx             # Navegación lateral reactiva
│   ├── ui/                         # Primitivas UI reutilizables
│   ├── brand.tsx                   # Isotipo y logotipo de Cartógrafo
│   ├── demo-button.tsx             # Botón de acceso rápido a demo
│   ├── signals.tsx                 # Insignias de confianza y etiquetas de evidencia
│   └── site-chrome.tsx             # Navegación global y pie de página
├── lib/
│   ├── analyzer.ts                 # Motor de análisis estático, heurísticas y parsers
│   ├── data.ts                     # Datos de muestra, contratos TypeScript e interfaces
│   ├── project-context.tsx         # React Context global para el estado del proyecto
│   ├── session.ts                  # Persistencia en cliente / sesión
│   └── utils.ts                    # Helpers de formato y Tailwind
├── public/                         # Assets estáticos, íconos y logos
├── scripts/                        # Scripts auxiliares y grabación de demos
│   ├── record_demo_video.py        # Automatización de grabación en 1080p con Playwright
│   ├── requirements.txt
│   └── README.md
├── .env.example                    # Plantilla de variables de entorno
├── next.config.mjs                 # Configuración de export estático y basePath
├── package.json                    # Dependencias y scripts del proyecto
└── tsconfig.json                   # Configuración del compilador TypeScript
```

---

## ⚡ Inicio Rápido en Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/LuchoDB/Cartografo.git
cd Cartografo
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno (Opcional)
Si deseas analizar repositorios directamente desde la API de GitHub sin limitaciones de cuota:
```bash
cp .env.example .env.local
```
Edita `.env.local` y agrega tu token personal de GitHub:
```env
GITHUB_TOKEN=ghp_tu_token_de_github_aqui
```

### 4. Iniciar el entorno de desarrollo
```bash
npm run dev
```
Abre en tu navegador [http://localhost:3000](http://localhost:3000).

---

## 🧪 Scripts Disponibles

* `npm run dev`: Inicia el servidor de desarrollo local con recarga rápida de Turbopack.
* `npm run build`: Genera el bundle de producción y realiza la exportación estática a la carpeta `/out`.
* `npm run start`: Inicia el servidor de producción de Next.js.
* `npm run typecheck`: Ejecuta la verificación estricta de tipos de TypeScript sin emitir archivos (`tsc --noEmit`).

---

## 🚢 Despliegue en GitHub Pages

El proyecto está configurado para exportación estática completa (`output: 'export'`). Cada `push` a la rama `main` activa automáticamente el flujo de GitHub Actions definido en [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), el cual:

1. Instala dependencias con caché optimizado.
2. Compila el proyecto con TypeScript y Next.js.
3. Genera la carpeta estática `out/` con el `basePath` correspondiente al repositorio.
4. Despliega automáticamente en la rama `gh-pages`.

---

## 👥 Equipo & Hackathon

Proyecto desarrollado para el Hackathon de Desarrollo de Software e IA.

## Desarrollado por:

### Luciano Diaz Bertozzi
### Ramiro Nadalin
### Harahel Jesús Ayun

- **Email:** lucianodiazbertozzi@gmail.com
- **Email:** ramironadalin8@gmail.com
- **Email:** harahelayun54@gmail.com
- **LinkedIn** [Luciano Díaz Bertozzi](https://www.linkedin.com/in/luciano-diaz-bertozzi)
- **LinkedIn** [Ramiro Gastón Nadalin](https://www.linkedin.com/in/ramiro-gaston-nadalin-0a05a7430)
- **LinkedIn** [Harahel Ayun](https://www.linkedin.com/in/harahel-ayun-4aa1b330b)
