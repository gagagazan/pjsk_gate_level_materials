import { cn } from '@/lib/utils'

interface MaterialIconSlotProps {
  className?: string
}

export function MaterialIconSlot({ className }: MaterialIconSlotProps) {
  return (
    <div
      data-testid="material-icon-slot"
      className={cn(
        'shrink-0 w-8 h-8 rounded-md bg-[#EEEEEE] border border-[#E0E0E0]',
        className
      )}
    />
  )
}
