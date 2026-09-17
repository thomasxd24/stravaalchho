import type { AppData } from '../types'

const KEY = 'achcool.data.v1'

export function loadData(): AppData | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as AppData
  } catch {
    return null
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // storage unavailable (private mode, quota) — fail silently, state stays in-memory
  }
}
