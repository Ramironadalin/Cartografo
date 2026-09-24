import type { Metadata } from "next"
import { DocsView } from "@/components/dashboard/views/docs-view"

export const metadata: Metadata = { title: "Documentación" }

export default function DocsPage() {
  return <DocsView />
}
