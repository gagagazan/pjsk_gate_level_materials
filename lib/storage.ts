import { UserState, UnitId } from './types'

const STORAGE_KEY = 'pjsk-gate-materials-v1'

export const DEFAULT_STATE: UserState = {
  units: {
    ln: { current: 1, target: 1 },
    mmj: { current: 1, target: 1 },
    vbs: { current: 1, target: 1 },
    ws: { current: 1, target: 1 },
    '25': { current: 1, target: 1 },
  },
  inventory: {},
}

export function loadState(): UserState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw)
    return migrateState(parsed)
  } catch {
    return DEFAULT_STATE
  }
}

export function saveState(state: UserState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function exportState(state: UserState): string {
  return JSON.stringify(state, null, 2)
}

export function importState(raw: string): UserState {
  const parsed = JSON.parse(raw)
  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid format')
  if (!parsed.units || !parsed.inventory) throw new Error('Missing fields')
  return migrateState(parsed)
}

function migrateState(parsed: unknown): UserState {
  const state = JSON.parse(JSON.stringify(parsed)) as UserState
  const unitIds: UnitId[] = ['ln', 'mmj', 'vbs', 'ws', '25']
  for (const id of unitIds) {
    state.units[id] = state.units[id] ?? { current: 1, target: 1 }
    state.units[id].current = clamp(state.units[id].current, 1, 40)
    state.units[id].target = clamp(state.units[id].target, 1, 40)
  }
  state.inventory = state.inventory ?? {}
  state.inventory = migrateMemoryKeys(state.inventory)
  return state
}

// 旧存档使用 oc-memory-${name} / vs-memory-${name}，新 key 统一为 memory-${name}
function migrateMemoryKeys(inventory: Record<string, number>): Record<string, number> {
  const result: Record<string, number> = {}
  for (const [key, count] of Object.entries(inventory)) {
    if (typeof count !== 'number' || !Number.isFinite(count)) continue
    const normalized = key.replace(/^(oc-memory|vs-memory)-/, 'memory-')
    result[normalized] = (result[normalized] ?? 0) + count
  }
  return result
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Number.isFinite(n) ? n : min))
}
