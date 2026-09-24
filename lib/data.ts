// Capa de Conocimiento del Proyecto (datos de muestra)
// Cada nodo conserva su origen (agente) y su nivel de confianza (detectado/inferido).

export type Confidence = "detectado" | "inferido"
export type RiskLevel = "bajo" | "medio" | "alto" | "critico"
export type Role = "junior" | "semi" | "senior"

export type Agent =
  | "Explorador"
  | "Arquitectura"
  | "Flujos"
  | "Base de Datos"
  | "Legacy Analyzer"
  | "Test Analyzer"
  | "Documentación"
  | "Mentor"
  | "Orquestador"

export interface Evidence {
  file: string
  lines?: string
  commit?: string
  snippet?: string
}

export const project = {
  name: "nucleo-banca",
  fullName: "banco-andes/nucleo-banca",
  description:
    "Monolito de core bancario. Gestiona cuentas, transferencias, préstamos y auditoría. En producción desde 2014.",
  source: "https://github.com/banco-andes/nucleo-banca",
  primaryLanguage: "Java",
  analyzedAt: "2026-09-15T14:20:00Z",
  commit: "a3f91c2",
  branch: "main",
  stats: {
    files: 1284,
    linesOfCode: 214_530,
    contributors: 37,
    firstCommit: "2014-03-11",
    lastCommit: "2026-09-12",
    openTodos: 148,
  },
}

export const languages: { name: string; pct: number }[] = [
  { name: "Java", pct: 71 },
  { name: "SQL", pct: 12 },
  { name: "XML", pct: 8 },
  { name: "JavaScript", pct: 6 },
  { name: "Shell", pct: 3 },
]

export const frameworks: { name: string; version: string; confidence: Confidence }[] = [
  { name: "Spring Framework", version: "4.3.30", confidence: "detectado" },
  { name: "Hibernate ORM", version: "5.2.17", confidence: "detectado" },
  { name: "Apache Struts", version: "2.3.34", confidence: "detectado" },
  { name: "JUnit", version: "4.12", confidence: "detectado" },
  { name: "Oracle JDBC", version: "12.1", confidence: "detectado" },
  { name: "Patrón MVC en capas", version: "—", confidence: "inferido" },
]

export const dependencies: {
  name: string
  version: string
  latest: string
  outdated: boolean
  risk: RiskLevel
}[] = [
  { name: "org.apache.struts:struts2-core", version: "2.3.34", latest: "6.4.0", outdated: true, risk: "critico" },
  { name: "org.springframework:spring-core", version: "4.3.30", latest: "6.1.6", outdated: true, risk: "alto" },
  { name: "org.hibernate:hibernate-core", version: "5.2.17", latest: "6.4.4", outdated: true, risk: "medio" },
  { name: "com.oracle:ojdbc7", version: "12.1.0", latest: "23.4.0", outdated: true, risk: "medio" },
  { name: "junit:junit", version: "4.12", latest: "5.10", outdated: true, risk: "bajo" },
  { name: "com.google.guava:guava", version: "31.1", latest: "33.1", outdated: true, risk: "bajo" },
]

export const entryPoints: { path: string; kind: string; confidence: Confidence }[] = [
  { path: "src/main/java/com/andes/Application.java", kind: "Bootstrap Spring", confidence: "detectado" },
  { path: "src/main/webapp/WEB-INF/web.xml", kind: "Descriptor servlet", confidence: "detectado" },
  { path: "src/main/resources/struts.xml", kind: "Ruteo de acciones", confidence: "detectado" },
]

// ---------- Módulos ----------
export interface Module {
  id: string
  name: string
  path: string
  language: string
  loc: number
  files: number
  incomingDeps: number
  outgoingDeps: number
  coupling: "bajo" | "medio" | "alto"
  risk: RiskLevel
  confidence: Confidence
  summary: string
  dependsOn: string[]
}

export const modules: Module[] = [
  {
    id: "auth",
    name: "Autenticación",
    path: "com.andes.security",
    language: "Java",
    loc: 8_420,
    files: 34,
    incomingDeps: 19,
    outgoingDeps: 4,
    coupling: "alto",
    risk: "alto",
    confidence: "detectado",
    summary:
      "Gestiona sesiones, roles y tokens. Es el módulo con más dependencias entrantes: casi todo el sistema lo consume.",
    dependsOn: ["persistence", "audit"],
  },
  {
    id: "accounts",
    name: "Cuentas",
    path: "com.andes.accounts",
    language: "Java",
    loc: 22_140,
    files: 88,
    incomingDeps: 12,
    outgoingDeps: 6,
    coupling: "alto",
    risk: "medio",
    confidence: "detectado",
    summary: "Dominio central de cuentas y saldos. Contiene la clase más grande del proyecto (AccountService).",
    dependsOn: ["auth", "persistence", "audit"],
  },
  {
    id: "transfers",
    name: "Transferencias",
    path: "com.andes.transfers",
    language: "Java",
    loc: 15_760,
    files: 61,
    incomingDeps: 7,
    outgoingDeps: 8,
    coupling: "medio",
    risk: "critico",
    confidence: "detectado",
    summary: "Orquesta transferencias entre cuentas. Alto acoplamiento con Cuentas y sin tests de integración.",
    dependsOn: ["accounts", "auth", "persistence", "audit"],
  },
  {
    id: "loans",
    name: "Préstamos",
    path: "com.andes.loans",
    language: "Java",
    loc: 18_900,
    files: 72,
    incomingDeps: 4,
    outgoingDeps: 7,
    coupling: "medio",
    risk: "medio",
    confidence: "detectado",
    summary: "Cálculo de amortización y aprobación de préstamos. Contiene lógica de negocio compleja poco documentada.",
    dependsOn: ["accounts", "auth", "persistence"],
  },
  {
    id: "persistence",
    name: "Persistencia",
    path: "com.andes.persistence",
    language: "Java",
    loc: 12_300,
    files: 54,
    incomingDeps: 24,
    outgoingDeps: 1,
    coupling: "alto",
    risk: "medio",
    confidence: "detectado",
    summary: "Capa de repositorios Hibernate y acceso JDBC directo. Consumida por casi todos los módulos de dominio.",
    dependsOn: ["audit"],
  },
  {
    id: "audit",
    name: "Auditoría",
    path: "com.andes.audit",
    language: "Java",
    loc: 5_120,
    files: 21,
    incomingDeps: 15,
    outgoingDeps: 1,
    coupling: "medio",
    risk: "bajo",
    confidence: "detectado",
    summary: "Registro de eventos y trazas de operaciones sensibles. Transversal a todo el sistema.",
    dependsOn: ["persistence"],
  },
  {
    id: "web",
    name: "Capa Web",
    path: "com.andes.web",
    language: "Java",
    loc: 19_400,
    files: 96,
    incomingDeps: 0,
    outgoingDeps: 11,
    coupling: "medio",
    risk: "alto",
    confidence: "detectado",
    summary: "Acciones Struts y JSPs. Punto de entrada de las peticiones de usuario.",
    dependsOn: ["auth", "accounts", "transfers", "loans"],
  },
]

// ---------- Arquitectura (capas) ----------
export const layers: {
  id: string
  name: string
  confidence: Confidence
  note: string
  modules: string[]
}[] = [
  { id: "presentation", name: "Presentación", confidence: "detectado", note: "Struts Actions + JSP", modules: ["web"] },
  {
    id: "application",
    name: "Aplicación / Servicios",
    confidence: "detectado",
    note: "Servicios de dominio Spring",
    modules: ["auth", "accounts", "transfers", "loans"],
  },
  {
    id: "data",
    name: "Acceso a Datos",
    confidence: "detectado",
    note: "Repositorios Hibernate + JDBC",
    modules: ["persistence"],
  },
  {
    id: "cross",
    name: "Transversal",
    confidence: "inferido",
    note: "No hay un aspecto formal; inferido por uso repetido",
    modules: ["audit"],
  },
]

export const patterns: { name: string; confidence: Confidence; evidence: Evidence }[] = [
  {
    name: "Arquitectura en capas (MVC)",
    confidence: "detectado",
    evidence: { file: "struts.xml", lines: "12-88", snippet: "<action name=\"transfer\" class=\"com.andes.web.TransferAction\">" },
  },
  {
    name: "Repository Pattern",
    confidence: "detectado",
    evidence: { file: "com/andes/persistence/AccountRepository.java", lines: "1-40" },
  },
  {
    name: "Service Layer",
    confidence: "detectado",
    evidence: { file: "com/andes/accounts/AccountService.java", lines: "1-60" },
  },
  {
    name: "Singleton en configuración legacy",
    confidence: "inferido",
    evidence: { file: "com/andes/config/LegacyConfig.java", lines: "22-31", snippet: "private static LegacyConfig INSTANCE;" },
  },
]

// ---------- Flujos de negocio ----------
export interface FlowStep {
  component: string
  moduleId: string
  file: string
  lines: string
  description: string
}
export interface Flow {
  id: string
  name: string
  confidence: Confidence
  summary: string
  steps: FlowStep[]
}

export const flows: Flow[] = [
  {
    id: "transfer",
    name: "Transferencia entre cuentas",
    confidence: "detectado",
    summary: "Recorrido de una transferencia desde la petición web hasta el asiento en base de datos.",
    steps: [
      {
        component: "TransferAction",
        moduleId: "web",
        file: "com/andes/web/TransferAction.java",
        lines: "44-72",
        description: "Recibe el formulario, valida parámetros básicos y delega en el servicio.",
      },
      {
        component: "AuthInterceptor",
        moduleId: "auth",
        file: "com/andes/security/AuthInterceptor.java",
        lines: "30-58",
        description: "Verifica sesión y permisos de la operación antes de continuar.",
      },
      {
        component: "TransferService",
        moduleId: "transfers",
        file: "com/andes/transfers/TransferService.java",
        lines: "88-190",
        description: "Orquesta la lógica: débito, crédito y control de límites. 102 líneas en un solo método.",
      },
      {
        component: "AccountService",
        moduleId: "accounts",
        file: "com/andes/accounts/AccountService.java",
        lines: "210-260",
        description: "Actualiza los saldos de origen y destino.",
      },
      {
        component: "AccountRepository",
        moduleId: "persistence",
        file: "com/andes/persistence/AccountRepository.java",
        lines: "70-96",
        description: "Persiste los cambios vía Hibernate.",
      },
      {
        component: "AuditLogger",
        moduleId: "audit",
        file: "com/andes/audit/AuditLogger.java",
        lines: "15-33",
        description: "Registra la operación en la tabla de auditoría.",
      },
    ],
  },
  {
    id: "login",
    name: "Inicio de sesión",
    confidence: "detectado",
    summary: "Autenticación de un usuario y creación de la sesión.",
    steps: [
      {
        component: "LoginAction",
        moduleId: "web",
        file: "com/andes/web/LoginAction.java",
        lines: "20-55",
        description: "Recibe credenciales del formulario de login.",
      },
      {
        component: "AuthService",
        moduleId: "auth",
        file: "com/andes/security/AuthService.java",
        lines: "40-120",
        description: "Valida credenciales y construye el contexto de seguridad.",
      },
      {
        component: "UserRepository",
        moduleId: "persistence",
        file: "com/andes/persistence/UserRepository.java",
        lines: "18-44",
        description: "Consulta el usuario y su hash de contraseña.",
      },
      {
        component: "AuditLogger",
        moduleId: "audit",
        file: "com/andes/audit/AuditLogger.java",
        lines: "15-33",
        description: "Registra intento de acceso (exitoso o fallido).",
      },
    ],
  },
  {
    id: "loan",
    name: "Aprobación de préstamo",
    confidence: "inferido",
    summary:
      "Reconstruido parcialmente: parte del flujo depende de un job batch cuya invocación no pudo trazarse en el código.",
    steps: [
      {
        component: "LoanAction",
        moduleId: "web",
        file: "com/andes/web/LoanAction.java",
        lines: "31-60",
        description: "Recibe la solicitud de préstamo.",
      },
      {
        component: "LoanService",
        moduleId: "loans",
        file: "com/andes/loans/LoanService.java",
        lines: "70-240",
        description: "Calcula amortización y evalúa aprobación. Lógica compleja poco documentada.",
      },
      {
        component: "AccountService",
        moduleId: "accounts",
        file: "com/andes/accounts/AccountService.java",
        lines: "300-330",
        description: "Acredita el monto aprobado en la cuenta del cliente.",
      },
    ],
  },
]

// ---------- Base de datos ----------
export interface DbEntity {
  name: string
  table: string
  confidence: Confidence
  columns: { name: string; type: string; pk?: boolean; fk?: string }[]
  touchedBy: { file: string; via: string }[]
}

export const dbEntities: DbEntity[] = [
  {
    name: "Cuenta",
    table: "ACCOUNTS",
    confidence: "detectado",
    columns: [
      { name: "ACCOUNT_ID", type: "NUMBER(18)", pk: true },
      { name: "CUSTOMER_ID", type: "NUMBER(18)", fk: "CUSTOMERS" },
      { name: "BALANCE", type: "NUMBER(18,2)" },
      { name: "STATUS", type: "VARCHAR2(12)" },
      { name: "CREATED_AT", type: "TIMESTAMP" },
    ],
    touchedBy: [
      { file: "AccountRepository.java", via: "Hibernate @Entity" },
      { file: "TransferService.java", via: "consulta nativa" },
    ],
  },
  {
    name: "Movimiento",
    table: "TRANSACTIONS",
    confidence: "detectado",
    columns: [
      { name: "TX_ID", type: "NUMBER(18)", pk: true },
      { name: "ACCOUNT_ID", type: "NUMBER(18)", fk: "ACCOUNTS" },
      { name: "AMOUNT", type: "NUMBER(18,2)" },
      { name: "TYPE", type: "VARCHAR2(8)" },
      { name: "CREATED_AT", type: "TIMESTAMP" },
    ],
    touchedBy: [{ file: "TransferService.java", via: "SQL embebido" }],
  },
  {
    name: "Usuario",
    table: "USERS",
    confidence: "detectado",
    columns: [
      { name: "USER_ID", type: "NUMBER(18)", pk: true },
      { name: "USERNAME", type: "VARCHAR2(64)" },
      { name: "PASSWORD_HASH", type: "VARCHAR2(256)" },
      { name: "ROLE", type: "VARCHAR2(24)" },
    ],
    touchedBy: [{ file: "UserRepository.java", via: "Hibernate @Entity" }],
  },
  {
    name: "Préstamo",
    table: "LOANS",
    confidence: "detectado",
    columns: [
      { name: "LOAN_ID", type: "NUMBER(18)", pk: true },
      { name: "ACCOUNT_ID", type: "NUMBER(18)", fk: "ACCOUNTS" },
      { name: "PRINCIPAL", type: "NUMBER(18,2)" },
      { name: "RATE", type: "NUMBER(5,4)" },
      { name: "TERM_MONTHS", type: "NUMBER(4)" },
    ],
    touchedBy: [{ file: "LoanService.java", via: "consulta nativa" }],
  },
  {
    name: "Auditoría",
    table: "AUDIT_LOG",
    confidence: "detectado",
    columns: [
      { name: "AUDIT_ID", type: "NUMBER(18)", pk: true },
      { name: "USER_ID", type: "NUMBER(18)", fk: "USERS" },
      { name: "ACTION", type: "VARCHAR2(64)" },
      { name: "PAYLOAD", type: "CLOB" },
      { name: "CREATED_AT", type: "TIMESTAMP" },
    ],
    touchedBy: [{ file: "AuditLogger.java", via: "JDBC directo" }],
  },
]

export const dbConfig = {
  engine: "Oracle Database 12c",
  confidence: "detectado" as Confidence,
  driver: "ojdbc7 12.1.0",
  connection: "jdbc:oracle:thin:@//db-prod:1521/NUCLEO",
  evidence: { file: "src/main/resources/application.properties", lines: "3-9" },
}

// ---------- Riesgos / deuda técnica ----------
export interface Risk {
  id: string
  title: string
  file: string
  lines: string
  problem: string
  evidence: string
  impact: string
  level: RiskLevel
  category: string
  moduleId: string
}

export const risks: Risk[] = [
  {
    id: "r1",
    title: "Dependencia con vulnerabilidad conocida (Struts 2.3.34)",
    file: "pom.xml",
    lines: "44-47",
    problem: "La versión de Apache Struts tiene CVEs críticos de ejecución remota de código.",
    evidence: "<artifactId>struts2-core</artifactId><version>2.3.34</version>",
    impact: "Superficie de ataque crítica en un sistema financiero expuesto a internet.",
    level: "critico",
    category: "Dependencia obsoleta",
    moduleId: "web",
  },
  {
    id: "r2",
    title: "Método excesivamente largo en TransferService",
    file: "com/andes/transfers/TransferService.java",
    lines: "88-190",
    problem: "El método executeTransfer() concentra 102 líneas y múltiples responsabilidades.",
    evidence: "public void executeTransfer(TransferRequest req) { /* 102 líneas */ }",
    impact: "Difícil de testear y modificar; foco frecuente de regresiones.",
    level: "alto",
    category: "Complejidad",
    moduleId: "transfers",
  },
  {
    id: "r3",
    title: "Módulo de transferencias sin tests de integración",
    file: "com/andes/transfers/",
    lines: "—",
    problem: "No se detectaron tests que ejerciten el flujo completo de transferencia.",
    evidence: "0 archivos *IT.java o *IntegrationTest.java en el paquete transfers",
    impact: "Cambios en un flujo crítico de dinero no tienen red de seguridad automatizada.",
    level: "critico",
    category: "Falta de tests",
    moduleId: "transfers",
  },
  {
    id: "r4",
    title: "Clase Dios: AccountService",
    file: "com/andes/accounts/AccountService.java",
    lines: "1-1420",
    problem: "1.420 líneas y 47 métodos públicos. Alta responsabilidad concentrada.",
    evidence: "class AccountService { /* 47 métodos públicos */ }",
    impact: "Cuello de botella de mantenimiento y merge conflicts frecuentes.",
    level: "alto",
    category: "Clase excesivamente grande",
    moduleId: "accounts",
  },
  {
    id: "r5",
    title: "SQL embebido con concatenación de strings",
    file: "com/andes/transfers/TransferService.java",
    lines: "150-156",
    problem: "Consulta construida por concatenación, posible inyección SQL.",
    evidence: 'String q = "SELECT * FROM ACCOUNTS WHERE ID = " + accountId;',
    impact: "Riesgo de inyección SQL en un módulo que mueve dinero.",
    level: "critico",
    category: "Seguridad",
    moduleId: "transfers",
  },
  {
    id: "r6",
    title: "Bloque de 34 TODO/FIXME sin resolver en Préstamos",
    file: "com/andes/loans/LoanService.java",
    lines: "varias",
    problem: "Marcadores de deuda acumulados, algunos desde 2016.",
    evidence: "// FIXME: cálculo de interés no contempla años bisiestos",
    impact: "Deuda funcional latente en cálculos financieros.",
    level: "medio",
    category: "TODO / FIXME",
    moduleId: "loans",
  },
  {
    id: "r7",
    title: "Configuración de conexión hardcodeada",
    file: "com/andes/config/LegacyConfig.java",
    lines: "22-31",
    problem: "Credenciales y URL de base de datos embebidas en código fuente.",
    evidence: 'String url = "jdbc:oracle:thin:@//db-prod:1521/NUCLEO";',
    impact: "Secretos versionados en el repositorio; riesgo de filtración.",
    level: "alto",
    category: "Configuración",
    moduleId: "persistence",
  },
]

// ---------- Tests ----------
export interface TestGroup {
  moduleId: string
  moduleName: string
  testFiles: number
  hasIntegration: boolean
  quality: "buena" | "media" | "baja" | "sin tests"
  note: string
  coverageVerifiable: boolean
  coveragePct?: number
}

export const tests: TestGroup[] = [
  {
    moduleId: "auth",
    moduleName: "Autenticación",
    testFiles: 12,
    hasIntegration: true,
    quality: "buena",
    note: "Buena cobertura de casos de credenciales y roles.",
    coverageVerifiable: true,
    coveragePct: 78,
  },
  {
    moduleId: "accounts",
    moduleName: "Cuentas",
    testFiles: 18,
    hasIntegration: true,
    quality: "media",
    note: "Tests unitarios presentes; faltan casos de borde en saldos negativos.",
    coverageVerifiable: true,
    coveragePct: 61,
  },
  {
    moduleId: "transfers",
    moduleName: "Transferencias",
    testFiles: 3,
    hasIntegration: false,
    quality: "baja",
    note: "Área crítica sin tests de integración. Riesgo alto.",
    coverageVerifiable: true,
    coveragePct: 22,
  },
  {
    moduleId: "loans",
    moduleName: "Préstamos",
    testFiles: 0,
    hasIntegration: false,
    quality: "sin tests",
    note: "No se detectaron tests. Cobertura no verificable por falta de reporte.",
    coverageVerifiable: false,
  },
  {
    moduleId: "persistence",
    moduleName: "Persistencia",
    testFiles: 6,
    hasIntegration: false,
    quality: "media",
    note: "Tests de repositorios con base en memoria.",
    coverageVerifiable: true,
    coveragePct: 54,
  },
  {
    moduleId: "audit",
    moduleName: "Auditoría",
    testFiles: 4,
    hasIntegration: false,
    quality: "media",
    note: "Cubre el registro básico de eventos.",
    coverageVerifiable: true,
    coveragePct: 66,
  },
]

// ---------- Documentación generada ----------
export const docSections: { id: string; title: string; body: string; source: string }[] = [
  {
    id: "readme",
    title: "README",
    source: "Consolidado de Explorador + Arquitectura",
    body: "nucleo-banca es el core bancario de Banco Andes: un monolito Java/Spring que gestiona cuentas, transferencias, préstamos y auditoría. Este documento se generó a partir del análisis del repositorio en el commit a3f91c2.",
  },
  {
    id: "install",
    title: "Instalación",
    source: "Detectado en pom.xml y scripts",
    body: "Requiere JDK 8, Maven 3.6 y una instancia de Oracle 12c. Construir con `mvn clean package` y desplegar el WAR resultante en un servlet container (Tomcat 8.5 detectado en la configuración).",
  },
  {
    id: "config",
    title: "Configuración",
    source: "Detectado en application.properties",
    body: "La configuración de base de datos vive en src/main/resources/application.properties. ATENCIÓN: se detectaron credenciales hardcodeadas — ver el reporte de riesgos.",
  },
  {
    id: "troubleshoot",
    title: "Troubleshooting",
    source: "Inferido de logs y comentarios",
    body: "Los errores más frecuentes reportados en comentarios se relacionan con timeouts de conexión a Oracle bajo carga. Inferido a partir de comentarios en el código; no verificado con logs de producción.",
  },
]

export const glossary: { term: string; definition: string; confidence: Confidence }[] = [
  { term: "Asiento", definition: "Registro contable de una operación en la tabla TRANSACTIONS.", confidence: "detectado" },
  { term: "Núcleo", definition: "Nombre interno del core bancario (schema NUCLEO en Oracle).", confidence: "detectado" },
  { term: "Cupo", definition: "Límite de transferencia por operación. Inferido del control en TransferService.", confidence: "inferido" },
  { term: "Batch nocturno", definition: "Proceso de cierre diario. Referenciado pero no trazable en el repo.", confidence: "inferido" },
]

// ---------- Tour guiado (Agente Mentor) ----------
export interface TourStep {
  id: number
  title: string
  moduleId?: string
  reason: string
  detail: string
  file?: string
  lines?: string
  snippet?: string
  roles: Role[]
}

export const tourStepsByRole: Record<Role, TourStep[]> = {
  junior: [
    {
      id: 1,
      title: "Entender la estructura general",
      reason: "Empezamos por el mapa completo porque orientarse es lo que más frena a alguien nuevo en un monolito de 214k líneas.",
      detail: "Recorré el árbol de paquetes com.andes.* y quedate con las 4 capas: web, servicios, persistencia y auditoría.",
      file: "src/main/java/com/andes/",
      roles: ["junior"],
    },
    {
      id: 2,
      title: "Revisar el módulo de Autenticación",
      moduleId: "auth",
      reason: "Es el módulo con más dependencias entrantes detectadas (19): entenderlo te da la llave del resto del sistema.",
      detail: "Leé AuthService y AuthInterceptor. Fijate cómo cada acción web pasa por el interceptor de seguridad.",
      file: "com/andes/security/AuthService.java",
      lines: "40-120",
      snippet: "public SecurityContext authenticate(Credentials c) { ... }",
      roles: ["junior"],
    },
    {
      id: 3,
      title: "Seguir el flujo principal: una transferencia",
      moduleId: "transfers",
      reason: "Es el flujo de negocio central y toca 6 componentes; verlo de punta a punta conecta las capas que ya conocés.",
      detail: "Seguí el flujo Transferencia en la sección Flujos. No te asustes con executeTransfer(): tiene 102 líneas, está marcado como riesgo.",
      file: "com/andes/transfers/TransferService.java",
      lines: "88-190",
      roles: ["junior"],
    },
    {
      id: 4,
      title: "Comprender el acceso a datos",
      moduleId: "persistence",
      reason: "Toda operación termina en la capa de persistencia (24 dependencias entrantes): es donde se materializan los cambios.",
      detail: "Mirá AccountRepository y cómo Hibernate mapea la tabla ACCOUNTS.",
      file: "com/andes/persistence/AccountRepository.java",
      lines: "1-96",
      roles: ["junior"],
    },
    {
      id: 5,
      title: "Revisar los tests existentes",
      moduleId: "auth",
      reason: "Los tests son la documentación viva del comportamiento esperado; Autenticación tiene los mejores del proyecto.",
      detail: "Corré los tests de auth para ver cómo se espera que funcione el login antes de tocar nada.",
      file: "src/test/java/com/andes/security/",
      roles: ["junior"],
    },
    {
      id: 6,
      title: "Primera tarea de bajo riesgo",
      moduleId: "audit",
      reason: "Auditoría tiene riesgo bajo y acoplamiento medio: es el lugar más seguro para tu primer cambio real.",
      detail: "Sugerencia: agregar un nuevo tipo de evento de auditoría. Cambio acotado, con tests que te respaldan.",
      file: "com/andes/audit/AuditLogger.java",
      lines: "15-33",
      roles: ["junior"],
    },
  ],
  semi: [
    {
      id: 1,
      title: "Mapa de módulos y acoplamiento",
      reason: "Con experiencia previa, lo útil es ver de una el grafo de dependencias y dónde está el acoplamiento alto.",
      detail: "Revisá el grafo: auth, persistence y accounts son los nodos más conectados.",
      roles: ["semi"],
    },
    {
      id: 2,
      title: "Flujo crítico + su deuda",
      moduleId: "transfers",
      reason: "Transferencias es crítico y concentra 3 riesgos (incluida inyección SQL): conviene conocerlo temprano.",
      detail: "Combiná el flujo de Transferencia con el reporte de riesgos del mismo módulo.",
      file: "com/andes/transfers/TransferService.java",
      lines: "88-190",
      roles: ["semi"],
    },
    {
      id: 3,
      title: "Modelo de datos",
      moduleId: "persistence",
      reason: "Entender el ERD y qué clases tocan cada tabla acelera cualquier cambio de dominio.",
      detail: "Revisá el diagrama entidad-relación y el mapeo código→tabla.",
      roles: ["semi"],
    },
    {
      id: 4,
      title: "Estado de los tests",
      moduleId: "transfers",
      reason: "Antes de tocar dinero necesitás saber dónde NO hay red de seguridad. Transferencias está al 22%.",
      detail: "Priorizá agregar tests de integración en transfers antes de refactorizar.",
      roles: ["semi"],
    },
    {
      id: 5,
      title: "Primera tarea de valor",
      moduleId: "transfers",
      reason: "Extraer la validación de executeTransfer() es un cambio acotado que reduce riesgo real.",
      detail: "Refactor sugerido: extraer método de validación de límites con su test.",
      file: "com/andes/transfers/TransferService.java",
      lines: "120-140",
      roles: ["semi"],
    },
  ],
  senior: [
    {
      id: 1,
      title: "Riesgos críticos primero",
      moduleId: "web",
      reason: "Para un senior, el mayor valor inicial es la superficie de riesgo: Struts 2.3.34 tiene RCE conocido.",
      detail: "Evaluá el impacto de la vulnerabilidad de Struts y el SQL embebido en transfers.",
      file: "pom.xml",
      lines: "44-47",
      roles: ["senior"],
    },
    {
      id: 2,
      title: "Acoplamiento y clases Dios",
      moduleId: "accounts",
      reason: "AccountService (1.420 líneas) es el cuello de botella arquitectónico del sistema.",
      detail: "Analizá el grafo de acoplamiento y planificá una estrategia de descomposición.",
      file: "com/andes/accounts/AccountService.java",
      lines: "1-1420",
      roles: ["senior"],
    },
    {
      id: 3,
      title: "Cobertura vs. criticidad",
      moduleId: "transfers",
      reason: "El cruce riesgo alto + cobertura baja marca dónde invertir primero en calidad.",
      detail: "Transfers y Loans son los focos: crítico sin tests de integración.",
      roles: ["senior"],
    },
    {
      id: 4,
      title: "Definir el plan de estabilización",
      reason: "Con el panorama completo, el paso senior es priorizar deuda por impacto y proponer un roadmap.",
      detail: "Ordená los 7 riesgos por nivel e impacto y definí quick wins vs. proyectos estructurales.",
      roles: ["senior"],
    },
  ],
}

// ---------- Utilidades de presentación ----------
export const roleLabels: Record<Role, string> = {
  junior: "Junior",
  semi: "Semi-senior",
  senior: "Senior",
}

export const riskLabels: Record<RiskLevel, string> = {
  bajo: "Bajo",
  medio: "Medio",
  alto: "Alto",
  critico: "Crítico",
}

export const agentList: { name: Agent; role: string; hard: string }[] = [
  { name: "Explorador", role: "Estructura, lenguajes, dependencias y puntos de entrada.", hard: "Nunca inventa: todo dato viene de archivos reales." },
  { name: "Arquitectura", role: "Capas, módulos, patrones y acoplamiento.", hard: "Etiqueta cada afirmación como detectada o inferida." },
  { name: "Flujos", role: "Reconstruye flujos end-to-end del negocio.", hard: "Cada paso enlaza a código real." },
  { name: "Base de Datos", role: "Entidades, tablas, relaciones y queries.", hard: "Mapea código ↔ tabla con evidencia." },
  { name: "Legacy Analyzer", role: "Deuda técnica, complejidad y riesgos.", hard: "Solo reporta, nunca modifica código." },
  { name: "Test Analyzer", role: "Cobertura y calidad de tests.", hard: "No estima cobertura sin reporte verificable." },
  { name: "Documentación", role: "README, guías, glosario, troubleshooting.", hard: "Solo usa datos validados por el Orquestador." },
  { name: "Mentor", role: "Tour de onboarding personalizado por rol.", hard: "Justifica por qué se eligió cada paso." },
  { name: "Orquestador", role: "Coordina y valida consistencia cruzada.", hard: "Bloquea hallazgos sin evidencia trazable." },
]

export function moduleById(id?: string, customModules?: Module[]) {
  const list = customModules ?? modules
  return list.find((m) => m.id === id)
}

export interface ProjectInfo {
  name: string
  fullName: string
  description: string
  source: string
  primaryLanguage: string
  analyzedAt: string
  commit: string
  branch: string
  stats: {
    files: number
    linesOfCode: number
    contributors: number
    firstCommit: string
    lastCommit: string
    openTodos: number
  }
}

export interface LanguageItem {
  name: string
  pct: number
}

export interface FrameworkItem {
  name: string
  version: string
  confidence: Confidence
}

export interface DependencyItem {
  name: string
  version: string
  latest: string
  outdated: boolean
  risk: RiskLevel
}

export interface EntryPointItem {
  path: string
  kind: string
  confidence: Confidence
}

export interface LayerItem {
  id: string
  name: string
  confidence: Confidence
  note: string
  modules: string[]
}

export interface PatternItem {
  name: string
  confidence: Confidence
  evidence: Evidence
}

export interface DbConfigItem {
  engine: string
  confidence: Confidence
  driver: string
  connection: string
  evidence: Evidence
}

export interface DocSectionItem {
  id: string
  title: string
  body: string
  source: string
}

export interface GlossaryItem {
  term: string
  definition: string
  confidence: Confidence
}

export interface ProjectData {
  project: ProjectInfo
  languages: LanguageItem[]
  frameworks: FrameworkItem[]
  dependencies: DependencyItem[]
  entryPoints: EntryPointItem[]
  modules: Module[]
  layers: LayerItem[]
  patterns: PatternItem[]
  flows: Flow[]
  dbConfig: DbConfigItem
  dbEntities: DbEntity[]
  risks: Risk[]
  tests: TestGroup[]
  docSections: DocSectionItem[]
  glossary: GlossaryItem[]
  tourStepsByRole: Record<Role, TourStep[]>
}

export const DEFAULT_PROJECT_DATA: ProjectData = {
  project,
  languages,
  frameworks,
  dependencies,
  entryPoints,
  modules,
  layers,
  patterns,
  flows,
  dbConfig,
  dbEntities,
  risks,
  tests,
  docSections,
  glossary,
  tourStepsByRole,
}
