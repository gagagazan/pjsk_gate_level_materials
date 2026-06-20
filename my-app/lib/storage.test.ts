import { describe, it, expect, beforeEach } from 'vitest'
import { loadState, saveState, exportState, importState, DEFAULT_STATE } from './storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns default state when localStorage is empty', () => {
    const state = loadState()
    expect(state.units.ln.current).toBe(1)
    expect(state.units.ln.target).toBe(1)
    expect(state.units['25'].current).toBe(1)
    expect(state.inventory).toEqual({})
  })

  it('round-trips state through localStorage', () => {
    const state = { ...DEFAULT_STATE, inventory: { 'wish-wood': 10 } }
    saveState(state)
    const loaded = loadState()
    expect(loaded.inventory['wish-wood']).toBe(10)
  })

  it('exports and imports state JSON', () => {
    const exported = exportState({ ...DEFAULT_STATE, inventory: { 'copper': 5 } })
    const imported = importState(exported)
    expect(imported.inventory['copper']).toBe(5)
  })

  it('rejects invalid import format', () => {
    expect(() => importState('not json')).toThrow()
    expect(() => importState('{}')).toThrow('Missing fields')
  })

  it('migrates missing units to defaults', () => {
    localStorage.setItem('pjsk-gate-materials-v1', JSON.stringify({
      units: { ln: { current: 10, target: 20 } },
      inventory: {},
    }))
    const loaded = loadState()
    expect(loaded.units.vbs.current).toBe(1)
    expect(loaded.units.ln.current).toBe(10)
  })

  it('clamps out-of-range levels', () => {
    localStorage.setItem('pjsk-gate-materials-v1', JSON.stringify({
      units: {
        ln: { current: 0, target: 99 },
      },
      inventory: {},
    }))
    const loaded = loadState()
    expect(loaded.units.ln.current).toBe(1)
    expect(loaded.units.ln.target).toBe(40)
  })
})
