import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MATERIALS } from '@/lib/materials'
import { MaterialRow } from './material-row'

export function InventoryPanel() {
  return (
    <Card className="border-[#E0E0E0]">
      <CardHeader>
        <CardTitle data-testid="inventory-heading" className="text-base text-[#212121]">材料库存</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
        {MATERIALS.map(meta => (
          <MaterialRow key={meta.key} meta={meta} />
        ))}
      </CardContent>
    </Card>
  )
}
