import { MaterialCategory } from './types'

export interface MaterialMeta {
  key: string
  name: string
  category: MaterialCategory
  icon?: string
}

function baseMeta(key: string, name: string, category: MaterialCategory): MaterialMeta {
  return { key, name, category, icon: `/icons/base/${key}.png` }
}

// 基础材料：严格按游戏内顺序排列
export const BASE_MATERIALS: MaterialMeta[] = [
  baseMeta('wish-wood', '心愿木材', 'basic'),
  baseMeta('heavy-wood', '硬质木材', 'basic'),
  baseMeta('light-wood', '轻质木材', 'basic'),
  baseMeta('sticky-sap', '粘稠的树液', 'basic'),
  baseMeta('evening-paulownia', '夕桐', 'special'),
  baseMeta('wish-pebble', '心愿石块', 'basic'),
  baseMeta('copper', '铜', 'metal'),
  baseMeta('iron', '铁', 'metal'),
  baseMeta('clay', '粘土', 'basic'),
  baseMeta('pure-glass', '漂亮的玻璃', 'processed'),
  baseMeta('shiny-quartz', '闪耀石英', 'processed'),
  baseMeta('diamond', '钻石', 'special'),
  baseMeta('screw', '螺丝', 'processed'),
  baseMeta('nail', '钉子', 'processed'),
  baseMeta('plastic', '塑料', 'processed'),
  baseMeta('motor', '马达', 'processed'),
  baseMeta('battery', '电池', 'processed'),
  baseMeta('bulb', '灯泡', 'processed'),
  baseMeta('circuit-board', '电路板', 'processed'),
  baseMeta('clover', '四叶草', 'special'),
  baseMeta('soft-flax', '顺滑的亚麻', 'basic'),
  baseMeta('fluffy-cotton', '蓬松的棉花', 'basic'),
  baseMeta('petal', '花瓣', 'basic'),
  baseMeta('new-tone', '空白的音色', 'special'),
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
const VS_ORDER = ['初音未来', '镜音铃', '镜音连', '巡音流歌', 'MEIKO', 'KAITO'] as const

function memoryMeta(name: string, icon: string): MaterialMeta {
  return {
    key: `memory-${name}`,
    name: `${name}的记忆`,
    category: 'memory',
    icon,
  }
}

// 记忆材料：OC 保持各团首次出现顺序；VS 统一按官方默认顺序排在末尾。
// 同一角色（如初音未来）出现在多个团的 vs 中，但视为同一种材料。
export const MEMORY_MATERIALS: MaterialMeta[] = (() => {
  const seenOc = new Set<string>()
  const seenVs = new Set<string>()
  const ocList: string[] = []
  const vsList: string[] = []

  for (const unitId of UNIT_ORDER) {
    const { oc, vs } = UNIT_MEMBER_NAMES[unitId]
    for (const name of oc) {
      if (seenOc.has(name)) continue
      seenOc.add(name)
      ocList.push(name)
    }
    for (const name of vs) {
      if (seenVs.has(name)) continue
      seenVs.add(name)
      vsList.push(name)
    }
  }

  const orderedVs = VS_ORDER.filter(name => vsList.includes(name))
  const names = [...ocList, ...orderedVs]

  // Assign icons strictly from the final MEMORY_MATERIALS order.
  return names.map((name, i) => memoryMeta(name, `/icons/memory/item_memoria_${i + 1}.png`))
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

export function getMemoryMaterialIcon(name: string): string | undefined {
  const meta = MEMORY_MATERIALS.find(m => m.name === `${name}的记忆`)
  return meta?.icon
}

export function getMaterialSortIndex(key: string): number {
  return SORT_INDEX_MAP.get(key) ?? Number.MAX_SAFE_INTEGER
}
