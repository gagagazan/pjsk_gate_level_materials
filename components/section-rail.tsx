'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type SectionId = 'gaps' | 'inventory'

export interface SectionRailProps {
  active: SectionId
  onChange: (id: SectionId) => void
}

const ITEMS: { id: SectionId; label: string }[] = [
  { id: 'gaps', label: '材料缺口' },
  { id: 'inventory', label: '库存' },
]

export function SectionRail({ active, onChange }: SectionRailProps) {
  return (
    <aside className="hidden w-16 shrink-0 border-r border-[#E0E0E0] bg-[#FAFAFA] md:block lg:w-48">
      <nav
        role="navigation"
        aria-label="分区导航"
        data-testid="section-rail"
        className="sticky top-[calc(3.5rem+1px)] flex flex-col gap-1 px-2 py-3"
      >
        {ITEMS.map(item => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => onChange(item.id)}
            className={cn(
              'h-10 justify-start gap-3 px-3 text-sm font-medium transition-colors',
              active === item.id
                ? 'bg-[#2E7D67]/10 text-[#2E7D67] hover:bg-[#2E7D67]/15'
                : 'text-[#757575] hover:bg-[#EEEEEE] hover:text-[#212121]'
            )}
          >
            <span className="hidden lg:inline">{item.label}</span>
            <span className="flex h-6 w-6 items-center justify-center rounded bg-[#2E7D67]/10 text-xs font-bold text-[#2E7D67] lg:hidden">
              {item.label.charAt(0)}
            </span>
          </Button>
        ))}
      </nav>
    </aside>
  )
}

export function MobileSectionTabs({ active, onChange }: SectionRailProps) {
  return (
    <nav
      role="navigation"
      aria-label="分区导航"
      className="md:hidden flex items-center gap-1 px-4 py-2 border-b bg-[#FAFAFA] border-[#E0E0E0] overflow-x-auto"
    >
      {ITEMS.map(item => (
        <Button
          key={item.id}
          variant="ghost"
          size="sm"
          onClick={() => onChange(item.id)}
          className={cn(
            'shrink-0 h-8 px-3 text-sm font-medium transition-colors',
            active === item.id
              ? 'bg-[#2E7D67]/10 text-[#2E7D67] hover:bg-[#2E7D67]/15'
              : 'text-[#757575] hover:bg-[#EEEEEE] hover:text-[#212121]'
          )}
        >
          {item.label}
        </Button>
      ))}
    </nav>
  )
}
