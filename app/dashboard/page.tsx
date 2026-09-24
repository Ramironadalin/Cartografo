import type { Metadata } from "next"
import { OverviewView } from "@/components/dashboard/views/overview-view"

export const metadata: Metadata = { title: "Vista general" }

export default function OverviewPage() {
  return <OverviewView />
}
