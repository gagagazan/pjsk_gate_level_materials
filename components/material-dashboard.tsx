'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppState } from '@/lib/state'
import { UNITS } from '@/lib/recipes'
import { getMaterialName, compareMaterialShortage } from '@/lib/materials'
import { calculateGlobalRequirements } from '@/lib/calculator'
import { MaterialIconSlot } from './material-icon-slot'
import { UnitLogo } from './unit-logo'
import { UnitOverviewCard } from './unit-overview-card'
import { UnitDetailPanel } from './unit-detail-panel'

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
    .sort(compareMaterialShortage)

  if (rows.length === 0) return <p className="text-sm text-[#757575]">无需材料</p>

  return (
    <div className="divide-y divide-[#E0E0E0]">
      {rows.map(row => (
        <div key={row.key} className="flex items-center justify-between py-2 text-sm gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <MaterialIconSlot materialKey={row.key} />
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

function GlobalProgressGrid() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {UNITS.map(unit => (
        <UnitOverviewCard key={unit.id} unit={unit} />
      ))}
    </section>
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
          <TabsList className="mb-4 flex flex-nowrap h-auto gap-1 overflow-x-auto w-full justify-start [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible md:w-auto md:justify-center">
            <TabsTrigger className="flex-none md:flex-1" value="global">全局</TabsTrigger>
            {UNITS.map(unit => (
              <TabsTrigger className="flex-none md:flex-1 px-2" key={unit.id} value={unit.id} title={unit.name}>
                <UnitLogo unit={unit} size="sm" />
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="global">
            <GlobalProgressGrid />
            <SummaryTable required={global} />
          </TabsContent>
          {UNITS.map(unit => (
            <TabsContent key={unit.id} value={unit.id}>
              <UnitDetailPanel unitId={unit.id} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
