'use client'

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'
import { UserState, UnitId } from './types'
import { loadState, saveState, DEFAULT_STATE } from './storage'

type Action =
  | { type: 'SET_CURRENT'; unitId: UnitId; value: number }
  | { type: 'SET_TARGET'; unitId: UnitId; value: number }
  | { type: 'SET_INVENTORY'; key: string; value: number }
  | { type: 'LOAD_STATE'; state: UserState }
  | { type: 'RESET_STATE' }

function reducer(state: UserState, action: Action): UserState {
  switch (action.type) {
    case 'SET_CURRENT': {
      const current = clamp(action.value, 1, 40)
      const target = Math.max(state.units[action.unitId].target, current)
      return {
        ...state,
        units: { ...state.units, [action.unitId]: { current, target } },
      }
    }
    case 'SET_TARGET': {
      const target = clamp(action.value, state.units[action.unitId].current, 40)
      return {
        ...state,
        units: { ...state.units, [action.unitId]: { ...state.units[action.unitId], target } },
      }
    }
    case 'SET_INVENTORY':
      return {
        ...state,
        inventory: { ...state.inventory, [action.key]: Math.max(0, action.value) },
      }
    case 'LOAD_STATE':
      return action.state
    case 'RESET_STATE':
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
    dispatch({ type: 'LOAD_STATE', state: loadState() })
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
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
