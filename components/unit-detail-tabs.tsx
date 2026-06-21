'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UnitDetailPanel } from './unit-detail-panel'
import { UNITS } from '@/lib/recipes'
import { UnitId } from '@/lib/types'

const UNIT_IDS = UNITS.map(u => u.id) as UnitId[]

export function UnitDetailTabs() {
  const [active, setActive] = useState<UnitId>(UNITS[0].id)

  return (
    <Tabs
      data-testid="unit-detail-tabs"
      value={active}
      onValueChange={(value: string) => {
        if ((UNIT_IDS as string[]).includes(value)) {
          setActive(value as UnitId)
        }
      }}
      className="space-y-4"
    >
      <TabsList className="flex flex-wrap h-auto gap-1 bg-[#FAFAFA] p-1 border border-[#E0E0E0]">
        {UNITS.map(unit => (
          <TabsTrigger
            key={unit.id}
            value={unit.id}
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#2E7D67] data-[state=active]:shadow-sm"
            style={{ color: active === unit.id ? unit.color : undefined }}
          >
            {unit.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {UNITS.map(unit => (
        <TabsContent key={unit.id} value={unit.id}>
          <UnitDetailPanel unitId={unit.id} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
