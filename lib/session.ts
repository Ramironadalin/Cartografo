"use client"

import type { Role } from "@/lib/data"

export interface OnboardingConfig {
  repo: string
  source: "git" | "zip"
  role: Role
  moduleId: string // "all" o id de módulo
  integrations: string[]
  completedAt?: string
}

const CONFIG_KEY = "cartografo:config"
const TOUR_KEY = "cartografo:tour-progress"

export function saveConfig(cfg: OnboardingConfig) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg))
  } catch {}
}

export function loadConfig(): OnboardingConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    return raw ? (JSON.parse(raw) as OnboardingConfig) : null
  } catch {
    return null
  }
}

export function saveTourProgress(role: Role, completedIds: number[]) {
  try {
    localStorage.setItem(TOUR_KEY, JSON.stringify({ role, completedIds }))
  } catch {}
}

export function loadTourProgress(): { role: Role; completedIds: number[] } | null {
  try {
    const raw = localStorage.getItem(TOUR_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
