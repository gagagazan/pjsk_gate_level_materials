'use client'

import { Input } from '@/components/ui/input'
import { useAppState } from '@/lib/state'
import { MaterialMeta } from '@/lib/materials'
import { MaterialIconSlot } from './material-icon-slot'

interface MaterialRowProps {
  meta: MaterialMeta
}

export function MaterialRow({ meta }: MaterialRowProps) {
  const { state, dispatch } = useAppState()
  const value = state.inventory[meta.key] ?? 0

  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <MaterialIconSlot materialKey={meta.key} />
        <label htmlFor={`inv-${meta.key}`} className="text-sm text-foreground truncate">
          {meta.name}
        </label>
      </div>
      <Input
        id={`inv-${meta.key}`}
        type="number"
        min={0}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10)
          dispatch({ type: 'SET_INVENTORY', key: meta.key, value: Number.isFinite(n) && n >= 0 ? n : 0 })
        }}
        className="w-24 text-right shrink-0"
      />
    </div>
  )
}
