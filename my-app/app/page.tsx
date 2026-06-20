import { AppBar } from '@/components/app-bar'
import { UnitOverviewGrid } from '@/components/unit-overview-grid'
import { InventoryPanel } from '@/components/inventory-panel'
import { MaterialDashboard } from '@/components/material-dashboard'
import { UnitDetailPanel } from '@/components/unit-detail-panel'
import { UNITS } from '@/lib/recipes'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <AppBar />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <UnitOverviewGrid />
        <InventoryPanel />
        <MaterialDashboard />
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#212121]">各团详情</h2>
          {UNITS.map(unit => (
            <UnitDetailPanel key={unit.id} unitId={unit.id} />
          ))}
        </section>
      </main>
    </div>
  )
}
