import { describe, it, expect } from 'vitest'
import { calculateUnitRequirements, calculateGlobalRequirements } from './calculator'
import { UNITS } from './recipes'

describe('calculateUnitRequirements', () => {
  it('returns empty when current equals target', () => {
    const unit = UNITS.find(u => u.id === 'ln')!
    const result = calculateUnitRequirements(unit, 1, 1)
    expect(result.totalRequired.size).toBe(0)
  })

  it('sums materials from current+1 to target', () => {
    const unit = UNITS.find(u => u.id === 'ln')!
    const result = calculateUnitRequirements(unit, 1, 2)
    expect(result.totalRequired.get('wish-wood')).toBe(5)
    expect(result.totalRequired.get('wish-pebble')).toBe(5)
  })

  it('expands vs memory for ln level 5', () => {
    const ln = UNITS.find(u => u.id === 'ln')!
    const result = calculateUnitRequirements(ln, 4, 5)
    expect(result.totalRequired.get('vs-memory-巡音流歌')).toBe(2)
    expect(result.totalRequired.get('vs-memory-初音未来')).toBe(2)
    expect(result.totalRequired.get('copper')).toBe(7)
  })

  it('expands oc memory for ln level 3', () => {
    const ln = UNITS.find(u => u.id === 'ln')!
    const result = calculateUnitRequirements(ln, 2, 3)
    expect(result.totalRequired.get('oc-memory-星乃一歌')).toBe(2)
    expect(result.totalRequired.get('oc-memory-天马咲希')).toBe(2)
    expect(result.totalRequired.get('oc-memory-望月穗波')).toBe(2)
    expect(result.totalRequired.get('oc-memory-日野森志步')).toBe(2)
    expect(result.totalRequired.get('wish-pebble')).toBe(25)
  })

  it('expands 3 vs members for vbs', () => {
    const vbs = UNITS.find(u => u.id === 'vbs')!
    const result = calculateUnitRequirements(vbs, 4, 5)
    expect(result.totalRequired.get('vs-memory-初音未来')).toBe(2)
    expect(result.totalRequired.get('vs-memory-镜音连')).toBe(2)
    expect(result.totalRequired.get('vs-memory-MEIKO')).toBe(2)
  })

  it('uses vs memory for 25 unit', () => {
    const p25 = UNITS.find(u => u.id === '25')!
    const result = calculateUnitRequirements(p25, 4, 5)
    expect(result.totalRequired.get('vs-memory-初音未来')).toBe(2)
    expect(result.totalRequired.get('copper')).toBe(7)
    expect(result.totalRequired.get('wish-pebble')).toBe(50)
  })
})

describe('calculateGlobalRequirements', () => {
  it('aggregates across units', () => {
    const unitStates = {
      ln: { current: 1, target: 2 },
      mmj: { current: 1, target: 2 },
      vbs: { current: 1, target: 1 },
      ws: { current: 1, target: 1 },
      '25': { current: 1, target: 1 },
    }
    const global = calculateGlobalRequirements(UNITS, unitStates)
    expect(global.get('wish-wood')).toBe(10)
    expect(global.get('wish-pebble')).toBe(10)
  })
})
