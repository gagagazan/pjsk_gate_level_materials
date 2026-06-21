import Image from 'next/image'
import { cn } from '@/lib/utils'
import { UnitConfig } from '@/lib/types'

interface UnitLogoProps {
  unit: UnitConfig
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_HEIGHT = {
  sm: 20,
  md: 28,
  lg: 32,
}

export function UnitLogo({ unit, size = 'md', className }: UnitLogoProps) {
  const height = SIZE_HEIGHT[size]

  return (
    <Image
      src={unit.logo}
      alt={unit.name}
      height={height}
      width={height * 3}
      className={cn('shrink-0 h-[var(--logo-height)] w-auto object-contain', className)}
      style={{ '--logo-height': `${height}px` } as React.CSSProperties}
    />
  )
}
