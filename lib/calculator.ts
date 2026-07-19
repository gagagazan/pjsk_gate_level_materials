import { UnitConfig, MaterialItem } from "./types"

export interface UnitRequirements {
  totalRequired: Map<string, number>
  byLevel: Map<number, MaterialItem[]>
}

export function getLevelCost(unit: UnitConfig, level: number): MaterialItem[] {
  return unit.recipes.find((recipe) => recipe.level === level)?.materials ?? []
}

export function calculateUnitRequirements(
  unit: UnitConfig,
  current: number,
  target: number
): UnitRequirements {
  const totalRequired = new Map<string, number>()
  const byLevel = new Map<number, MaterialItem[]>()

  for (const recipe of unit.recipes) {
    if (recipe.level <= current || recipe.level > target) continue
    byLevel.set(recipe.level, recipe.materials)
    for (const m of recipe.materials) {
      totalRequired.set(m.key, (totalRequired.get(m.key) ?? 0) + m.count)
    }
  }

  return { totalRequired, byLevel }
}

export function calculateGlobalRequirements(
  units: UnitConfig[],
  unitStates: Record<string, { current: number; target: number }>
): Map<string, number> {
  const global = new Map<string, number>()
  for (const unit of units) {
    const state = unitStates[unit.id]
    if (!state || state.target <= state.current) continue
    const { totalRequired } = calculateUnitRequirements(
      unit,
      state.current,
      state.target
    )
    for (const [key, count] of totalRequired) {
      global.set(key, (global.get(key) ?? 0) + count)
    }
  }
  return global
}
