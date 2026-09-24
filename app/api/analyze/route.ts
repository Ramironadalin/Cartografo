import { NextResponse } from "next/server"
import { analyzeRepository } from "@/lib/analyzer"
import type { Role } from "@/lib/data"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { url, role, moduleId, token } = body as {
      url?: string
      role?: Role
      moduleId?: string
      token?: string
    }

    if (!url || typeof url !== "string" || url.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Por favor, ingresá una URL de repositorio válida." },
        { status: 400 },
      )
    }

    const data = await analyzeRepository(url.trim(), {
      role,
      moduleId,
      token: token?.trim(),
    })

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    console.error("Error in /api/analyze:", err)
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Ocurrió un error inesperado al analizar el repositorio.",
      },
      { status: 500 },
    )
  }
}
