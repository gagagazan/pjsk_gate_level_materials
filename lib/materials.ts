import { MaterialCategory } from './types'

export interface MaterialMeta {
  key: string
  name: string
  category: MaterialCategory
}

// 基础材料：严格按游戏内顺序排列
export const BASE_MATERIALS: MaterialMeta[] = [
  { key: 'wish-wood', name: '心愿木材', category: 'basic' },
  { key: 'heavy-wood', name: '硬质木材', category: 'basic' },
  { key: 'light-wood', name: '轻质木材', category: 'basic' },
  { key: 'sticky-sap', name: '粘稠的树液', category: 'basic' },
  { key: 'evening-paulownia', name: '夕桐', category: 'special' },
  { key: 'wish-pebble', name: '心愿石块', category: 'basic' },
  { key: 'copper', name: '铜', category: 'metal' },
  { key: 'iron', name: '铁', category: 'metal' },
  { key: 'clay', name: '粘土', category: 'basic' },
  { key: 'pure-glass', name: '漂亮的玻璃', category: 'processed' },
  { key: 'shiny-quartz', name: '闪耀石英', category: 'processed' },
  { key: 'diamond', name: '钻石', category: 'special' },
  { key: 'screw', name: '螺丝', category: 'processed' },
  { key: 'nail', name: '钉子', category: 'processed' },
  { key: 'plastic', name: '塑料', category: 'processed' },
  { key: 'motor', name: '马达', category: 'processed' },
  { key: 'battery', name: '电池', category: 'processed' },
  { key: 'bulb', name: '灯泡', category: 'processed' },
  { key: 'circuit-board', name: '电路板', category: 'processed' },
  { key: 'clover', name: '四叶草', category: 'special' },
  { key: 'soft-flax', name: '顺滑的亚麻', category: 'basic' },
  { key: 'fluffy-cotton', name: '蓬松的棉花', category: 'basic' },
  { key: 'petal', name: '花瓣', category: 'basic' },
  { key: 'new-tone', name: '空白的音色', category: 'special' },
]

// 各团角色名（用于生成记忆材料）
const UNIT_MEMBER_NAMES: Record<string, { oc: string[]; vs: string[] }> = {
  ln: {
    oc: ['星乃一歌', '天马咲希', '望月穗波', '日野森志步'],
    vs: ['初音未来', '巡音流歌'],
  },
  mmj: {
    oc: ['花里实乃理', '桐谷遥', '桃井爱莉', '日野森雫'],
    vs: ['初音未来', '镜音铃'],
  },
  vbs: {
    oc: ['小豆泽心羽', '白石杏', '东云彰人', '青柳冬弥'],
    vs: ['初音未来', '镜音连', 'MEIKO'],
  },
  ws: {
    oc: ['天马司', '凤笑梦', '草薙宁宁', '神代类'],
    vs: ['初音未来', 'KAITO'],
  },
  '25': {
    oc: ['宵崎奏', '朝比奈真冬', '东云绘名', '晓山瑞希'],
    vs: ['初音未来'],
  },
}

const UNIT_ORDER = ['ln', 'mmj', 'vbs', 'ws', '25'] as const

function memoryMeta(name: string): MaterialMeta {
  return {
    key: `memory-${name}`,
    name: `${name}的记忆`,
    category: 'memory',
  }
}

// 记忆材料：按"各团 oc -> 各团 vs"的顺序遍历并去重。
// 同一角色（如初音未来）出现在多个团的 vs 中，但视为同一种材料。
export const MEMORY_MATERIALS: MaterialMeta[] = (() => {
  const seen = new Set<string>()
  const result: MaterialMeta[] = []
  for (const unitId of UNIT_ORDER) {
    const { oc, vs } = UNIT_MEMBER_NAMES[unitId]
    for (const name of [...oc, ...vs]) {
      if (seen.has(name)) continue
      seen.add(name)
      result.push(memoryMeta(name))
    }
  }
  return result
})()

export const MATERIALS: MaterialMeta[] = [...BASE_MATERIALS, ...MEMORY_MATERIALS]

export const MATERIAL_MAP: Record<string, MaterialMeta> = Object.fromEntries(
  MATERIALS.map(m => [m.key, m])
)

export function getMaterialName(key: string): string {
  return MATERIAL_MAP[key]?.name ?? key
}

export function getMaterialKeyByName(name: string): string | undefined {
  return MATERIALS.find(m => m.name === name)?.key
}
