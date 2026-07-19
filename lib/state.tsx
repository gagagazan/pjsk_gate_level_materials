"use client"

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react"
import { UserState, UnitId } from "./types"
import { loadState, saveState, DEFAULT_STATE } from "./storage"
import { getLevelCost } from "./calculator"
import { UNIT_MAP } from "./recipes"

type Action =
  | { type: "SET_CURRENT"; unitId: UnitId; value: number }
  | { type: "SET_TARGET"; unitId: UnitId; value: number }
  | { type: "SET_INVENTORY"; key: string; value: number }
  | { type: "LEVEL_UP"; unitId: UnitId }
  | { type: "LEVEL_DOWN"; unitId: UnitId }
  | { type: "LOAD_STATE"; state: UserState }
  | { type: "RESET_STATE" }

function reducer(state: UserState, action: Action): UserState {
  switch (action.type) {
    case "SET_CURRENT": {
      const current = clamp(action.value, 1, 40)
      const target = Math.max(state.units[action.unitId].target, current)
      return {
        ...state,
        units: { ...state.units, [action.unitId]: { current, target } },
      }
    }
    case "SET_TARGET": {
      const target = clamp(action.value, state.units[action.unitId].current, 40)
      return {
        ...state,
        units: {
          ...state.units,
          [action.unitId]: { ...state.units[action.unitId], target },
        },
      }
    }
    case "SET_INVENTORY":
      return {
        ...state,
        inventory: {
          ...state.inventory,
          [action.key]: Math.max(0, action.value),
        },
      }
    case "LEVEL_UP": {
      const progress = state.units[action.unitId]
      const unit = UNIT_MAP.get(action.unitId)
      if (!progress || !unit || progress.current >= 40) return state

      const cost = getLevelCost(unit, progress.current + 1)
      const costByKey = sumMaterialCounts(cost)
      for (const [key, count] of costByKey) {
        if ((state.inventory[key] ?? 0) < count) return state
      }

      const inventory = { ...state.inventory }
      for (const [key, count] of costByKey) {
        inventory[key] = (inventory[key] ?? 0) - count
      }

      return {
        ...state,
        units: {
          ...state.units,
          [action.unitId]: {
            ...progress,
            current: progress.current + 1,
            target: Math.max(progress.target, progress.current + 1),
          },
        },
        inventory,
      }
    }
    case "LEVEL_DOWN": {
      const progress = state.units[action.unitId]
      const unit = UNIT_MAP.get(action.unitId)
      if (!progress || !unit || progress.current <= 1) return state

      const cost = getLevelCost(unit, progress.current)
      const inventory = { ...state.inventory }
      for (const [key, count] of sumMaterialCounts(cost)) {
        inventory[key] = (inventory[key] ?? 0) + count
      }

      return {
        ...state,
        units: {
          ...state.units,
          [action.unitId]: { ...progress, current: progress.current - 1 },
        },
        inventory,
      }
    }
    case "LOAD_STATE":
      return action.state
    case "RESET_STATE":
      return DEFAULT_STATE
    default:
      return state
  }
}

const AppStateContext = createContext<{
  state: UserState
  dispatch: React.Dispatch<Action>
} | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE)

  useEffect(() => {
    dispatch({ type: "LOAD_STATE", state: loadState() })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => saveState(state), 500)
    return () => clearTimeout(timer)
  }, [state])

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider")
  return ctx
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function sumMaterialCounts(materials: { key: string; count: number }[]) {
  const counts = new Map<string, number>()
  for (const material of materials) {
    counts.set(material.key, (counts.get(material.key) ?? 0) + material.count)
  }
  return counts
}
