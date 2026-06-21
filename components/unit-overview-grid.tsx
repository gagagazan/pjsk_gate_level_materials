import { UNITS } from '@/lib/recipes'
import { UnitOverviewCard } from './unit-overview-card'

export function UnitOverviewGrid() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {UNITS.map(unit => (
        <UnitOverviewCard key={unit.id} unit={unit} />
      ))}
    </section>
  )
}
