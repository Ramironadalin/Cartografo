"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useProject } from "@/lib/project-context"

export function DemoParamDetector() {
  const searchParams = useSearchParams()
  const { isCustom, resetToDemo } = useProject()

  useEffect(() => {
    const isDemo = searchParams.get("demo") === "true" || searchParams.get("demo") === "1"
    if (isDemo && isCustom) {
      resetToDemo()
    }
  }, [searchParams, isCustom, resetToDemo])

  return null
}
