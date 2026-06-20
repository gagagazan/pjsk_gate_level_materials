'use client'

import { Input } from '@/components/ui/input'
import { useAppState } from '@/lib/state'
import { MaterialMeta } from '@/lib/materials'

interface MaterialRowProps {
  meta: MaterialMeta
}

export function MaterialRow({ meta }: MaterialRowProps) {
  const { state, dispatch } = useAppState()
  const value = state.inventory[meta.key] ?? 0

  return (
    <div className="flex items-center justify-between py-2 border-b border-[#E0E0E0] last:border-0">
      <label htmlFor={`inv-${meta.key}`} className="text-sm text-[#212121]">{meta.name}</label>
      <Input
        id={`inv-${meta.key}`}
        type="number"
        min={0}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10)
          dispatch({ type: 'SET_INVENTORY', key: meta.key, value: Number.isFinite(n) && n >= 0 ? n : 0 })
        }}
        className="w-24 text-right"
      />
    </div>
  )
}
