import type { Metadata } from "next"
import { PageHeader } from "@/components/dashboard/page-header"
import { FlowExplorer } from "@/components/dashboard/flow-explorer"

export const metadata: Metadata = { title: "Flujos de negocio" }

export default function FlowsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        breadcrumb="Flujos"
        title="Flujos de negocio"
        desc="Recorridos end-to-end reconstruidos desde el código. Cada paso se ubica en el carril de su módulo y enlaza al archivo que lo respalda."
      />

      <FlowExplorer />
    </div>
  )
}
