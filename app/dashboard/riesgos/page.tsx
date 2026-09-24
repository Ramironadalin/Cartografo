import type { Metadata } from "next"
import { RisksView } from "@/components/dashboard/views/risks-view"

export const metadata: Metadata = { title: "Riesgos y deuda técnica" }

export default function RisksPage() {
  return <RisksView />
}
