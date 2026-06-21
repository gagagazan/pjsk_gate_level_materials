'use client'

import { useState, ReactNode } from 'react'
import { SectionRail, MobileSectionTabs, SectionId } from './section-rail'

interface DashboardShellProps {
  overview: ReactNode
  inventory: ReactNode
  gaps: ReactNode
  units: ReactNode
}

export function DashboardShell({ overview, inventory, gaps, units }: DashboardShellProps) {
  const [active, setActive] = useState<SectionId>('overview')

  const renderSection = () => {
    switch (active) {
      case 'overview':
        return (
          <section data-testid="section-overview" className="space-y-6">
            {overview}
          </section>
        )
      case 'inventory':
        return (
          <section data-testid="section-inventory" className="space-y-6">
            {inventory}
          </section>
        )
      case 'gaps':
        return (
          <section data-testid="section-gaps" className="space-y-6">
            {gaps}
          </section>
        )
      case 'units':
        return (
          <section data-testid="section-units" className="space-y-6">
            {units}
          </section>
        )
    }
  }

  return (
    <div className="flex flex-1 min-h-[calc(100vh-3.5rem)]">
      <SectionRail active={active} onChange={setActive} />
      <div className="flex flex-col flex-1 min-w-0">
        <MobileSectionTabs active={active} onChange={setActive} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  )
}
