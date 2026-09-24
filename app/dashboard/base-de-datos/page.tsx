import type { Metadata } from "next"
import { DatabaseView } from "@/components/dashboard/views/database-view"

export const metadata: Metadata = { title: "Base de datos" }

export default function DatabasePage() {
  return <DatabaseView />
}
