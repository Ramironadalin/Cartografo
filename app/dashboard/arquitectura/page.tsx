import type { Metadata } from "next"
import { ArchitectureView } from "@/components/dashboard/views/architecture-view"

export const metadata: Metadata = { title: "Arquitectura" }

export default function ArchitecturePage() {
  return <ArchitectureView />
}
