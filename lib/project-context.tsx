"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { DEFAULT_PROJECT_DATA, type ProjectData, type Role, type Module } from "./data"
import { saveConfig, loadConfig } from "./session"
import { analyzeRepository, analyzeZipBuffer } from "./analyzer"

interface ProjectContextType {
  data: ProjectData
  isCustom: boolean
  isAnalyzing: boolean
  analysisError: string | null
  analysisAgentIndex: number
  analyzeRepo: (url: string, role?: Role, moduleId?: string, token?: string) => Promise<ProjectData>
  analyzeZip: (file: File, role?: Role, moduleId?: string) => Promise<ProjectData>
  setProject: (data: ProjectData) => void
  resetToDemo: () => void
  savedCustomProject: ProjectData | null
  restoreSavedCustom: () => void
  repoHistory: { name: string; url: string; analyzedAt: string }[]
  switchRepo: (url: string) => void
  moduleById: (id?: string) => Module | undefined
}

const STORAGE_PROJECT_KEY = "cartografo:active-project-data"
const STORAGE_HISTORY_KEY = "cartografo:project-history"
const STORAGE_SAVED_CUSTOM_KEY = "cartografo:custom-project-backup"

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ProjectData>(DEFAULT_PROJECT_DATA)
  const [isCustom, setIsCustom] = useState<boolean>(false)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [analysisAgentIndex, setAnalysisAgentIndex] = useState<number>(0)
  const [savedCustomProject, setSavedCustomProject] = useState<ProjectData | null>(null)
  const [repoHistory, setRepoHistory] = useState<{ name: string; url: string; analyzedAt: string }[]>([])

  // Hydrate from localStorage on client
  useEffect(() => {
    try {
      // Check if URL forces demo mode
      const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null
      const forceDemo = urlParams?.get("demo") === "true" || urlParams?.get("demo") === "1"

      const stored = localStorage.getItem(STORAGE_PROJECT_KEY)
      const backup = localStorage.getItem(STORAGE_SAVED_CUSTOM_KEY)

      if (backup) {
        try {
          setSavedCustomProject(JSON.parse(backup))
        } catch {}
      }

      if (forceDemo) {
        setData(DEFAULT_PROJECT_DATA)
        setIsCustom(false)
        localStorage.removeItem(STORAGE_PROJECT_KEY)
      } else if (stored) {
        const parsed = JSON.parse(stored) as ProjectData
        if (parsed?.project?.name) {
          setData(parsed)
          const custom = parsed.project.source !== DEFAULT_PROJECT_DATA.project.source
          setIsCustom(custom)
          if (custom) {
            setSavedCustomProject(parsed)
            localStorage.setItem(STORAGE_SAVED_CUSTOM_KEY, JSON.stringify(parsed))
          }
        }
      }

      const hist = localStorage.getItem(STORAGE_HISTORY_KEY)
      if (hist) {
        setRepoHistory(JSON.parse(hist))
      }
    } catch (e) {
      console.error("Error hydrating project data:", e)
    }
  }, [])

  const persistProject = useCallback((newData: ProjectData) => {
    setData(newData)
    const custom = newData.project.source !== DEFAULT_PROJECT_DATA.project.source
    setIsCustom(custom)
    try {
      localStorage.setItem(STORAGE_PROJECT_KEY, JSON.stringify(newData))
      if (custom) {
        setSavedCustomProject(newData)
        localStorage.setItem(STORAGE_SAVED_CUSTOM_KEY, JSON.stringify(newData))
        localStorage.setItem(`cartografo:cached:${newData.project.source}`, JSON.stringify(newData))
        setRepoHistory((prev) => {
          const filtered = prev.filter((p) => p.url !== newData.project.source)
          const next = [
            {
              name: newData.project.fullName || newData.project.name,
              url: newData.project.source,
              analyzedAt: newData.project.analyzedAt,
            },
            ...filtered,
          ].slice(0, 8)
          localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(next))
          return next
        })
      }
    } catch (e) {
      console.error("Error saving project data:", e)
    }
  }, [])

  const resetToDemo = useCallback(() => {
    setData(DEFAULT_PROJECT_DATA)
    setIsCustom(false)
    try {
      localStorage.removeItem(STORAGE_PROJECT_KEY)
    } catch {}
  }, [])

  const restoreSavedCustom = useCallback(() => {
    if (savedCustomProject) {
      persistProject(savedCustomProject)
      return
    }
    try {
      const stored = localStorage.getItem(STORAGE_SAVED_CUSTOM_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as ProjectData
        persistProject(parsed)
      }
    } catch (e) {
      console.error("Error restoring saved custom project:", e)
    }
  }, [savedCustomProject, persistProject])

  const switchRepo = useCallback(
    (url: string) => {
      if (url === DEFAULT_PROJECT_DATA.project.source) {
        resetToDemo()
        return
      }
      try {
        const stored = localStorage.getItem(`cartografo:cached:${url}`)
        if (stored) {
          persistProject(JSON.parse(stored))
        }
      } catch {}
    },
    [persistProject, resetToDemo],
  )

  const analyzeRepo = useCallback(
    async (url: string, role: Role = "junior", moduleId: string = "all", token?: string): Promise<ProjectData> => {
      setIsAnalyzing(true)
      setAnalysisError(null)
      setAnalysisAgentIndex(0)

      // Start simulated agent progression while processing
      const interval = setInterval(() => {
        setAnalysisAgentIndex((prev) => Math.min(8, prev + 1))
      }, 500)

      try {
        let projectData: ProjectData

        try {
          const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, role, moduleId, token }),
          })

          if (!res.ok) throw new Error("API endpoint unavailable")
          const json = await res.json()
          if (!json.success || !json.data) {
            throw new Error(json.error || "Error en API")
          }
          projectData = json.data as ProjectData
        } catch {
          // Fallback to client-side analysis directly (required for static GitHub Pages)
          projectData = await analyzeRepository(url.trim(), {
            role,
            moduleId,
            token: token?.trim(),
          })
        }

        clearInterval(interval)
        setAnalysisAgentIndex(9)

        // Cache this repo
        try {
          localStorage.setItem(`cartografo:cached:${url}`, JSON.stringify(projectData))
        } catch {}

        persistProject(projectData)

        // Save session config
        saveConfig({
          repo: url,
          source: "git",
          role,
          moduleId,
          integrations: [],
          completedAt: new Date().toISOString(),
        })

        return projectData
      } catch (err: any) {
        clearInterval(interval)
        const msg = err.message || "Error al analizar el repositorio."
        setAnalysisError(msg)
        throw err
      } finally {
        setIsAnalyzing(false)
      }
    },
    [persistProject],
  )

  const analyzeZip = useCallback(
    async (file: File, role: Role = "junior", moduleId: string = "all"): Promise<ProjectData> => {
      setIsAnalyzing(true)
      setAnalysisError(null)
      setAnalysisAgentIndex(0)

      const interval = setInterval(() => {
        setAnalysisAgentIndex((prev) => Math.min(8, prev + 1))
      }, 500)

      try {
        let projectData: ProjectData

        try {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("role", role)
          formData.append("moduleId", moduleId)

          const res = await fetch("/api/analyze-zip", {
            method: "POST",
            body: formData,
          })

          if (!res.ok) throw new Error("API endpoint unavailable")
          const json = await res.json()
          if (!json.success || !json.data) {
            throw new Error(json.error || "Error en API")
          }
          projectData = json.data as ProjectData
        } catch {
          // Fallback to client-side JSZip directly in browser (required for static GitHub Pages)
          const arrayBuffer = await file.arrayBuffer()
          projectData = await analyzeZipBuffer(arrayBuffer, file.name, { role, moduleId })
        }

        clearInterval(interval)
        setAnalysisAgentIndex(9)
        persistProject(projectData)

        saveConfig({
          repo: file.name,
          source: "zip",
          role,
          moduleId,
          integrations: [],
          completedAt: new Date().toISOString(),
        })

        return projectData
      } catch (err: any) {
        clearInterval(interval)
        const msg = err.message || "Error al analizar el archivo .zip."
        setAnalysisError(msg)
        throw err
      } finally {
        setIsAnalyzing(false)
      }
    },
    [persistProject],
  )

  const moduleById = useCallback(
    (id?: string) => {
      return data.modules.find((m) => m.id === id)
    },
    [data.modules],
  )

  return (
    <ProjectContext.Provider
      value={{
        data,
        isCustom,
        isAnalyzing,
        analysisError,
        analysisAgentIndex,
        analyzeRepo,
        analyzeZip,
        setProject: persistProject,
        resetToDemo,
        savedCustomProject,
        restoreSavedCustom,
        repoHistory,
        switchRepo,
        moduleById,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider")
  }
  return context
}
