import { AppBar } from '@/components/app-bar'
import { DashboardShell } from '@/components/dashboard-shell'
import { InventoryPanel } from '@/components/inventory-panel'
import { MaterialDashboard } from '@/components/material-dashboard'
import { UnitOverviewGrid } from '@/components/unit-overview-grid'
import { UnitDetailTabs } from '@/components/unit-detail-tabs'

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppBar />
      <DashboardShell
        overview={<UnitOverviewGrid />}
        inventory={<InventoryPanel />}
        gaps={<MaterialDashboard />}
        units={<UnitDetailTabs />}
      />
    </div>
  )
}
