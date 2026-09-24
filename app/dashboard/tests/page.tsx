import type { Metadata } from "next"
import { TestsView } from "@/components/dashboard/views/tests-view"

export const metadata: Metadata = { title: "Tests y cobertura" }

export default function TestsPage() {
  return <TestsView />
}
