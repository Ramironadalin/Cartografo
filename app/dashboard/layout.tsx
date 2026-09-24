import { Suspense } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DemoParamDetector } from "@/components/dashboard/demo-detector"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Suspense fallback={null}>
        <DemoParamDetector />
      </Suspense>
      <DashboardSidebar />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">{children}</div>
      </main>
    </div>
  )
}

