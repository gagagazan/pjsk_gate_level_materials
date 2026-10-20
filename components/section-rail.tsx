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
    <aside className="hidden w-16 shrink-0 border-r border-sidebar-border bg-sidebar md:block lg:w-48">
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
            aria-current={active === item.id ? 'page' : undefined}
            onClick={() => onChange(item.id)}
            className={cn(
              'h-10 justify-start gap-3 px-3 text-sm font-medium transition-colors',
              active === item.id
                ? 'bg-brand/5 text-brand hover:bg-brand/10'
                : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
          >
            <span className="hidden lg:inline">{item.label}</span>
            <span className="flex h-6 w-6 items-center justify-center rounded bg-brand/5 text-xs font-bold text-brand lg:hidden">
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
      className="md:hidden flex items-center gap-1 px-4 py-2 border-b bg-sidebar border-sidebar-border overflow-x-auto"
    >
      {ITEMS.map(item => (
        <Button
          key={item.id}
          variant="ghost"
          size="sm"
          aria-current={active === item.id ? 'page' : undefined}
          onClick={() => onChange(item.id)}
          className={cn(
            'shrink-0 h-8 px-3 text-sm font-medium transition-colors',
            active === item.id
              ? 'bg-brand/5 text-brand hover:bg-brand/10'
              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          )}
        >
          {item.label}
        </Button>
      ))}
    </nav>
  )
}
