'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LevelSlider } from './level-slider'
import { useAppState } from '@/lib/state'
import { UnitConfig } from '@/lib/types'

export function UnitOverviewCard({ unit }: { unit: UnitConfig }) {
  const { state, dispatch } = useAppState()
  const progress = state.units[unit.id]

  return (
    <Card className="border-[#E0E0E0] bg-[#FAFAFA]" id={`overview-${unit.id}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base" style={{ color: unit.color }}>
          {unit.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-sm text-[#757575]">
          Lv.{progress.current} → Lv.{progress.target}
        </div>
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
      </CardContent>
    </Card>
  )
}
