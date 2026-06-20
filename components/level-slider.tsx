'use client'

import { Slider } from '@/components/ui/slider'

interface LevelSliderProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}

export function LevelSlider({ label, value, min, max, onChange }: LevelSliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-[#757575]">
        <span>{label}</span>
        <span className="font-medium text-[#212121]">{value}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  )
}
