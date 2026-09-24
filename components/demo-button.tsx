"use client"

import React from "react"
import Link from "next/link"
import { useProject } from "@/lib/project-context"
import { Button } from "@/components/ui/button"

type ButtonProps = React.ComponentProps<typeof Button>

export function DemoButton({
  children = "Ver demo",
  className,
  variant = "ghost",
  size = "sm",
  ...props
}: ButtonProps) {
  const { resetToDemo } = useProject()

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      <Link href="/dashboard?demo=true" onClick={() => resetToDemo()}>
        {children}
      </Link>
    </Button>
  )
}
