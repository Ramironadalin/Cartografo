import { NextResponse } from "next/server"
import { analyzeZipBuffer } from "@/lib/analyzer"
import type { Role } from "@/lib/data"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const role = (formData.get("role") as Role) || "junior"
    const moduleId = (formData.get("moduleId") as string) || "all"

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "No se proporcionó ningún archivo .zip válido." },
        { status: 400 },
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const data = await analyzeZipBuffer(buffer, file.name, { role, moduleId })

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    console.error("Error in /api/analyze-zip:", err)
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Ocurrió un error al descomprimir y analizar el archivo .zip.",
      },
      { status: 500 },
    )
  }
}
