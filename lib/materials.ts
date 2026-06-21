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

// VS 角色官方默认顺序：放在记忆材料列表末尾。
const VS_ORDER = ['KAITO', 'MEIKO', '巡音流歌', '镜音连', '镜音铃', '初音未来'] as const

function memoryMeta(name: string): MaterialMeta {
  return {
    key: `memory-${name}`,
    name: `${name}的记忆`,
    category: 'memory',
  }
}

// 记忆材料：OC 保持各团首次出现顺序；VS 统一按官方默认顺序排在末尾。
// 同一角色（如初音未来）出现在多个团的 vs 中，但视为同一种材料。
export const MEMORY_MATERIALS: MaterialMeta[] = (() => {
  const seenOc = new Set<string>()
  const seenVs = new Set<string>()
  const ocList: MaterialMeta[] = []
  const vsList: MaterialMeta[] = []

  for (const unitId of UNIT_ORDER) {
    const { oc, vs } = UNIT_MEMBER_NAMES[unitId]
    for (const name of oc) {
      if (seenOc.has(name)) continue
      seenOc.add(name)
      ocList.push(memoryMeta(name))
    }
    for (const name of vs) {
      if (seenVs.has(name)) continue
      seenVs.add(name)
      vsList.push(memoryMeta(name))
    }
  }

  const orderedVs = VS_ORDER.filter(name => vsList.some(m => m.name === `${name}的记忆`))
    .map(name => memoryMeta(name))

  return [...ocList, ...orderedVs]
})()

export const MATERIALS: MaterialMeta[] = [...BASE_MATERIALS, ...MEMORY_MATERIALS]

export const MATERIAL_MAP: Record<string, MaterialMeta> = Object.fromEntries(
  MATERIALS.map(m => [m.key, m])
)

// 共享材料分组：库存页按此顺序展示，缺口排序也使用同一顺序（基础材料在前，记忆材料在后）
export const MATERIAL_SECTIONS = [
  { id: 'basic', label: '基础材料', items: BASE_MATERIALS },
  { id: 'memory', label: '记忆材料', items: MEMORY_MATERIALS },
] as const

const SHARED_ORDER: MaterialMeta[] = [...BASE_MATERIALS, ...MEMORY_MATERIALS]
const SORT_INDEX_MAP = new Map(SHARED_ORDER.map((m, i) => [m.key, i]))

export function getMaterialName(key: string): string {
  return MATERIAL_MAP[key]?.name ?? key
}

export function getMaterialKeyByName(name: string): string | undefined {
  return MATERIALS.find(m => m.name === name)?.key
}

export function getMaterialSection(key: string): 'memory' | 'basic' | undefined {
  if (MEMORY_MATERIALS.some(m => m.key === key)) return 'memory'
  if (BASE_MATERIALS.some(m => m.key === key)) return 'basic'
  return undefined
}

export function getMaterialSortIndex(key: string): number {
  return SORT_INDEX_MAP.get(key) ?? Number.MAX_SAFE_INTEGER
}
