import { AppBar } from '@/components/app-bar'
import { DashboardShell } from '@/components/dashboard-shell'
import { InventoryPanel } from '@/components/inventory-panel'
import { MaterialDashboard } from '@/components/material-dashboard'

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppBar />
      <DashboardShell
        inventory={<InventoryPanel />}
        gaps={<MaterialDashboard />}
      />
    </div>
  )
}
