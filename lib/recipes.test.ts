import { describe, it, expect } from 'vitest'
import { UNITS } from './recipes'
import { calculateUnitRequirements } from './calculator'

describe('recipe correctness', () => {
  it('ln level 5 matches expected vs memory counts', () => {
    const ln = UNITS.find(u => u.id === 'ln')!
    const { totalRequired } = calculateUnitRequirements(ln, 4, 5)
    expect(totalRequired.get('memory-巡音流歌')).toBe(2)
    expect(totalRequired.get('memory-初音未来')).toBe(2)
    expect(totalRequired.get('copper')).toBe(7)
    expect(totalRequired.get('iron')).toBe(7)
    expect(totalRequired.get('clay')).toBe(7)
  })

  it('ln level 3 matches expected oc memory counts', () => {
    const ln = UNITS.find(u => u.id === 'ln')!
    const { totalRequired } = calculateUnitRequirements(ln, 2, 3)
    expect(totalRequired.get('memory-星乃一歌')).toBe(2)
    expect(totalRequired.get('memory-天马咲希')).toBe(2)
    expect(totalRequired.get('memory-望月穗波')).toBe(2)
    expect(totalRequired.get('memory-日野森志步')).toBe(2)
    expect(totalRequired.get('wish-pebble')).toBe(25)
  })

  it('mmj level 15 matches expected oc memory and screw', () => {
    const mmj = UNITS.find(u => u.id === 'mmj')!
    const { totalRequired } = calculateUnitRequirements(mmj, 14, 15)
    expect(totalRequired.get('memory-花里实乃理')).toBe(6)
    expect(totalRequired.get('memory-桐谷遥')).toBe(6)
    expect(totalRequired.get('memory-桃井爱莉')).toBe(6)
    expect(totalRequired.get('memory-日野森雫')).toBe(6)
    expect(totalRequired.get('screw')).toBe(30)
  })

  it('vbs level 5 matches expected vs counts', () => {
    const vbs = UNITS.find(u => u.id === 'vbs')!
    const { totalRequired } = calculateUnitRequirements(vbs, 4, 5)
    expect(totalRequired.get('memory-初音未来')).toBe(2)
    expect(totalRequired.get('memory-镜音连')).toBe(2)
    expect(totalRequired.get('memory-MEIKO')).toBe(2)
    expect(totalRequired.get('copper')).toBe(7)
    expect(totalRequired.get('iron')).toBe(7)
  })

  it('ws level 25 matches expected vs memory and processed materials', () => {
    const ws = UNITS.find(u => u.id === 'ws')!
    const { totalRequired } = calculateUnitRequirements(ws, 24, 25)
    expect(totalRequired.get('memory-初音未来')).toBe(10)
    expect(totalRequired.get('memory-KAITO')).toBe(10)
    expect(totalRequired.get('plastic')).toBe(40)
    expect(totalRequired.get('new-tone')).toBe(4)
    expect(totalRequired.get('nail')).toBe(40)
  })

  it('25 level 5 uses 初音未来 memory and pebbles', () => {
    const p25 = UNITS.find(u => u.id === '25')!
    const { totalRequired } = calculateUnitRequirements(p25, 4, 5)
    expect(totalRequired.get('memory-初音未来')).toBe(2)
    expect(totalRequired.get('copper')).toBe(7)
    expect(totalRequired.get('iron')).toBe(7)
    expect(totalRequired.get('clay')).toBe(7)
    expect(totalRequired.get('wish-pebble')).toBe(50)
  })

  it('level 40 special materials are correct for ln', () => {
    const ln = UNITS.find(u => u.id === 'ln')!
    const { totalRequired } = calculateUnitRequirements(ln, 39, 40)
    expect(totalRequired.get('shiny-quartz')).toBe(100)
    expect(totalRequired.get('new-tone')).toBe(15)
    expect(totalRequired.get('diamond')).toBe(15)
    expect(totalRequired.get('clover')).toBe(15)
    expect(totalRequired.get('evening-paulownia')).toBe(15)
  })
})
