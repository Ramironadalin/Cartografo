import type { Metadata } from "next"
import { ModulesView } from "@/components/dashboard/views/modules-view"

export const metadata: Metadata = { title: "Módulos y dependencias" }

export default function ModulesPage() {
  return <ModulesView />
}
