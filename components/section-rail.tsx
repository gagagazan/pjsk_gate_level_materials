'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type SectionId = 'overview' | 'inventory' | 'gaps' | 'units'

export interface SectionRailProps {
  active: SectionId
  onChange: (id: SectionId) => void
}

const ITEMS: { id: SectionId; label: string }[] = [
  { id: 'overview', label: '概览' },
  { id: 'inventory', label: '库存' },
  { id: 'gaps', label: '缺口' },
  { id: 'units', label: '各团' },
]

export function SectionRail({ active, onChange }: SectionRailProps) {
  return (
    <nav
      role="navigation"
      aria-label="分区导航"
      className="hidden md:flex flex-col gap-1 w-16 lg:w-48 shrink-0 py-3 px-2 border-r bg-[#FAFAFA] border-[#E0E0E0]"
    >
      {ITEMS.map(item => (
        <Button
          key={item.id}
          variant="ghost"
          onClick={() => onChange(item.id)}
          className={cn(
            'justify-start gap-3 h-10 px-3 text-sm font-medium transition-colors',
            active === item.id
              ? 'bg-[#2E7D67]/10 text-[#2E7D67] hover:bg-[#2E7D67]/15'
              : 'text-[#757575] hover:bg-[#EEEEEE] hover:text-[#212121]'
          )}
        >
          <span className="hidden lg:inline">{item.label}</span>
          <span className="lg:hidden w-6 h-6 flex items-center justify-center rounded bg-[#2E7D67]/10 text-xs font-bold text-[#2E7D67]">
            {item.label.charAt(0)}
          </span>
        </Button>
      ))}
    </nav>
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
