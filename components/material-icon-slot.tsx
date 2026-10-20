import Image from 'next/image'
import { cn } from '@/lib/utils'
import { MATERIAL_MAP } from '@/lib/materials'

interface MaterialIconSlotProps {
  className?: string
  materialKey?: string
}

export function MaterialIconSlot({ className, materialKey }: MaterialIconSlotProps) {
  const icon = materialKey ? MATERIAL_MAP[materialKey]?.icon : undefined

  if (icon) {
    return (
      <Image
        data-testid="material-icon-slot"
        src={icon}
        alt=""
        width={32}
        height={32}
        className={cn('material-icon shrink-0 w-8 h-8 rounded-md object-contain', className)}
      />
    )
  }

  return (
    <div
      data-testid="material-icon-slot"
      className={cn(
        'shrink-0 w-8 h-8 rounded-md bg-muted border border-border',
        className
      )}
    />
  )
}
