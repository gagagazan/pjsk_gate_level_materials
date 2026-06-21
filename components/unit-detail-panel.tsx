'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LevelSlider } from './level-slider'
import { LevelBreakdown } from './level-breakdown'
import { useAppState } from '@/lib/state'
import { UNITS } from '@/lib/recipes'
import { calculateUnitRequirements } from '@/lib/calculator'
import { getMaterialName } from '@/lib/materials'
import { Separator } from '@/components/ui/separator'
import { MaterialIconSlot } from './material-icon-slot'

export function UnitDetailPanel({ unitId }: { unitId: string }) {
  const unit = UNITS.find(u => u.id === unitId)
  const { state, dispatch } = useAppState()

  if (!unit) {
    return null
  }

  const progress = state.units[unit.id]
  const { totalRequired, byLevel } = calculateUnitRequirements(unit, progress.current, progress.target)

  return (
    <Card data-testid="unit-detail-panel" className="border-[#E0E0E0]" id={`unit-${unit.id}`}>
      <CardHeader>
        <CardTitle className="text-base" style={{ color: unit.color }}>
          {unit.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LevelSlider
            label="当前等级"
            value={progress.current}
            min={1}
            max={40}
            onChange={(v) => dispatch({ type: 'SET_CURRENT', unitId: unit.id, value: v })}
          />
          <LevelSlider
            label="目标等级"
            value={progress.target}
            min={progress.current}
            max={40}
            onChange={(v) => dispatch({ type: 'SET_TARGET', unitId: unit.id, value: v })}
          />
        </div>
        <Separator />
        {totalRequired.size === 0 ? (
          <p className="text-sm text-[#757575]">无需材料</p>
        ) : (
          <div className="divide-y divide-[#E0E0E0]">
            {Array.from(totalRequired.entries()).map(([key, need]) => {
              const have = state.inventory[key] ?? 0
              const gap = Math.max(0, need - have)
              return (
                <div key={key} className="flex items-center justify-between py-2 text-sm gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <MaterialIconSlot />
                    <span className="text-[#212121] truncate">{getMaterialName(key)}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[#757575]">{have} / {need}</span>
                    {gap > 0 && <span className="text-xs font-bold text-[#E91E63]">缺 {gap}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <LevelBreakdown byLevel={byLevel} />
      </CardContent>
    </Card>
  )
}
