'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppState } from '@/lib/state'
import { UNITS } from '@/lib/recipes'
import { getMaterialName } from '@/lib/materials'
import { calculateUnitRequirements, calculateGlobalRequirements } from '@/lib/calculator'
import { MaterialIconSlot } from './material-icon-slot'

function GapBadge({ have, need }: { have: number; need: number }) {
  const gap = Math.max(0, need - have)
  if (gap === 0) return <span className="text-xs text-[#2E7D67]">充足</span>
  return <span className="text-xs font-bold text-[#E91E63]">缺 {gap}</span>
}

function SummaryTable({ required }: { required: Map<string, number> }) {
  const { state } = useAppState()
  const rows = Array.from(required.entries())
    .map(([key, need]) => ({
      key,
      name: getMaterialName(key),
      have: state.inventory[key] ?? 0,
      need,
      gap: Math.max(0, need - (state.inventory[key] ?? 0)),
    }))
    .sort((a, b) => b.gap - a.gap)

  if (rows.length === 0) return <p className="text-sm text-[#757575]">无需材料</p>

  return (
    <div className="divide-y divide-[#E0E0E0]">
      {rows.map(row => (
        <div key={row.key} className="flex items-center justify-between py-2 text-sm gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <MaterialIconSlot />
            <span className="text-[#212121] truncate">{row.name}</span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-[#757575]">{row.have} / {row.need}</span>
            <GapBadge have={row.have} need={row.need} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function MaterialDashboard() {
  const { state } = useAppState()
  const global = calculateGlobalRequirements(UNITS, state.units)

  return (
    <Card className="border-[#E0E0E0]">
      <CardHeader>
        <CardTitle data-testid="gaps-heading" className="text-base text-[#212121]">材料缺口汇总</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="global">
          <TabsList className="mb-4 flex flex-wrap h-auto gap-1">
            <TabsTrigger value="global">全局</TabsTrigger>
            {UNITS.map(unit => (
              <TabsTrigger key={unit.id} value={unit.id}>{unit.name}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="global">
            <SummaryTable required={global} />
          </TabsContent>
          {UNITS.map(unit => {
            const { totalRequired } = calculateUnitRequirements(
              unit,
              state.units[unit.id].current,
              state.units[unit.id].target
            )
            return (
              <TabsContent key={unit.id} value={unit.id}>
                <SummaryTable required={totalRequired} />
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}
