import { MaterialCategory } from './types'

export interface MaterialMeta {
  key: string
  name: string
  category: MaterialCategory
}

export const MATERIAL_MAP: Record<string, MaterialMeta> = {
  'wish-wood': { key: 'wish-wood', name: '心愿木材', category: 'basic' },
  'wish-pebble': { key: 'wish-pebble', name: '心愿小石子', category: 'basic' },
  'heavy-wood': { key: 'heavy-wood', name: '沉重木材', category: 'basic' },
  'light-wood': { key: 'light-wood', name: '轻木材', category: 'basic' },
  'petal': { key: 'petal', name: '花瓣', category: 'basic' },
  'clay': { key: 'clay', name: '黏土', category: 'basic' },
  'screw': { key: 'screw', name: '螺丝', category: 'processed' },
  'soft-flax': { key: 'soft-flax', name: '柔顺亚麻', category: 'basic' },
  'fluffy-cotton': { key: 'fluffy-cotton', name: '蓬松棉花', category: 'basic' },
  'copper': { key: 'copper', name: '铜', category: 'metal' },
  'iron': { key: 'iron', name: '铁', category: 'metal' },
  'sticky-sap': { key: 'sticky-sap', name: '黏黏的树液', category: 'basic' },
  'pure-glass': { key: 'pure-glass', name: '纯净玻璃', category: 'processed' },
  'shiny-quartz': { key: 'shiny-quartz', name: '闪耀石英', category: 'processed' },
  'nail': { key: 'nail', name: '钉子', category: 'processed' },
  'motor': { key: 'motor', name: '马达', category: 'processed' },
  'battery': { key: 'battery', name: '电池', category: 'processed' },
  'bulb': { key: 'bulb', name: '灯泡', category: 'processed' },
  'circuit-board': { key: 'circuit-board', name: '电路板', category: 'processed' },
  'new-tone': { key: 'new-tone', name: '崭新的音色', category: 'special' },
  'diamond': { key: 'diamond', name: '钻石', category: 'special' },
  'clover': { key: 'clover', name: '四叶幸运草', category: 'special' },
  'evening-paulownia': { key: 'evening-paulownia', name: '夕桐', category: 'special' },
  'plastic': { key: 'plastic', name: '塑料', category: 'processed' },
}

export function getMaterialName(key: string): string {
  return MATERIAL_MAP[key]?.name ?? key
}
