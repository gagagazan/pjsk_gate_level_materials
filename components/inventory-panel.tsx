import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MATERIAL_SECTIONS } from '@/lib/materials'
import { MaterialRow } from './material-row'

export function InventoryPanel() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle data-testid="inventory-heading" className="text-base text-foreground">材料库存</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {MATERIAL_SECTIONS.map(section => (
          <section key={section.id}>
            <h3 className="text-sm font-semibold text-foreground mb-3">{section.label}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
              {section.items.map(meta => (
                <MaterialRow key={meta.key} meta={meta} />
              ))}
            </div>
          </section>
        ))}
      </CardContent>
    </Card>
  )
}
