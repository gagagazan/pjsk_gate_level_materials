import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { MaterialItem } from '@/lib/types'
import { getMaterialName } from '@/lib/materials'

interface LevelBreakdownProps {
  byLevel: Map<number, MaterialItem[]>
}

export function LevelBreakdown({ byLevel }: LevelBreakdownProps) {
  if (byLevel.size === 0) return null

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center text-sm text-[#2E7D67] hover:underline">
        查看每级明细 <ChevronDown className="w-4 h-4 ml-1" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        {Array.from(byLevel.entries()).map(([level, materials]) => (
          <div key={level} className="text-sm border-l-2 border-[#E0E0E0] pl-3">
            <div className="font-medium text-[#757575]">Lv.{level - 1} → Lv.{level}</div>
            <div className="text-[#212121]">
              {materials.map(m => `${getMaterialName(m.key)}×${m.count}`).join('、')}
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
