"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LevelSlider } from "./level-slider"
import { UnitLogo } from "./unit-logo"
import { useAppState } from "@/lib/state"
import { UnitConfig } from "@/lib/types"
import { getLevelCost } from "@/lib/calculator"

export function UnitLevelControls({ unit }: { unit: UnitConfig }) {
  const { state, dispatch } = useAppState()
  const progress = state.units[unit.id]
  const cost = getLevelCost(unit, progress.current + 1)
  const shortage = cost
    .map((material) => ({
      ...material,
      gap: material.count - (state.inventory[material.key] ?? 0),
    }))
    .filter((material) => material.gap > 0)
  const canLevelUp = progress.current < 40 && shortage.length === 0

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        className="lv-display text-center text-sm text-[#757575]"
        aria-live="polite"
      >
        Lv.{progress.current} → Lv.{progress.target}
      </div>
      <div className="flex w-full items-center justify-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-w-0 flex-1 hover:border-[#2E7D67] hover:text-[#2E7D67] max-[479px]:h-11"
          disabled={progress.current <= 1}
          onClick={() => dispatch({ type: "LEVEL_DOWN", unitId: unit.id })}
          aria-label="降 1 级"
          data-testid={`level-down-${unit.id}`}
        >
          <span className="text-base leading-none">−</span>
          <span className="max-[479px]:hidden">降 1 级</span>
          <span className="hidden text-xs text-muted-foreground min-[640px]:inline">
            返库存
          </span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-w-0 flex-1 hover:border-[#2E7D67] hover:text-[#2E7D67] max-[479px]:h-11"
          disabled={!canLevelUp}
          onClick={() => dispatch({ type: "LEVEL_UP", unitId: unit.id })}
          aria-label="升 1 级"
          data-testid={`level-up-${unit.id}`}
        >
          <span className="text-base leading-none">+</span>
          <span className="max-[479px]:hidden">升 1 级</span>
          <span className="hidden text-xs text-muted-foreground min-[640px]:inline">
            扣库存
          </span>
        </Button>
      </div>
      {shortage.length > 0 && (
        <div
          className="text-center text-xs font-semibold text-[#E91E63]"
          aria-live="polite"
        >
          · 缺{" "}
          {shortage
            .map((material) => `${material.gap} 个${material.name}`)
            .join(" · ")}
        </div>
      )}
    </div>
  )
}

export function UnitOverviewCard({ unit }: { unit: UnitConfig }) {
  const { state, dispatch } = useAppState()
  const progress = state.units[unit.id]

  return (
    <Card className="border-[#E0E0E0] bg-[#FAFAFA]" id={`overview-${unit.id}`}>
      <CardHeader className="pb-2">
        <CardTitle
          className="flex items-center gap-2 text-base"
          style={{ color: unit.color }}
        >
          <UnitLogo unit={unit} size="sm" />
          <span className="truncate">{unit.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <UnitLevelControls unit={unit} />
        <LevelSlider
          label="当前等级"
          value={progress.current}
          min={1}
          max={40}
          onChange={(v) =>
            dispatch({ type: "SET_CURRENT", unitId: unit.id, value: v })
          }
        />
        <LevelSlider
          label="目标等级"
          value={progress.target}
          min={progress.current}
          max={40}
          onChange={(v) =>
            dispatch({ type: "SET_TARGET", unitId: unit.id, value: v })
          }
        />
      </CardContent>
    </Card>
  )
}
