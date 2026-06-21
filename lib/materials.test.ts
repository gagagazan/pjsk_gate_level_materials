import { describe, expect, it } from 'vitest'
import { MATERIALS, getMaterialName, MEMORY_MATERIALS, MATERIAL_SECTIONS, getMaterialSection, getMaterialSortIndex, getMemoryMaterialIcon } from './materials'

const BASE_MATERIAL_NAMES = [
  '心愿木材',
  '硬质木材',
  '轻质木材',
  '粘稠的树液',
  '夕桐',
  '心愿石块',
  '铜',
  '铁',
  '粘土',
  '漂亮的玻璃',
  '闪耀石英',
  '钻石',
  '螺丝',
  '钉子',
  '塑料',
  '马达',
  '电池',
  '灯泡',
  '电路板',
  '四叶草',
  '顺滑的亚麻',
  '蓬松的棉花',
  '花瓣',
  '空白的音色',
]

// MEMORY_MATERIALS 是去重的唯一材料列表，OC 按各团首次出现顺序排列，VS 按官方默认顺序排在末尾。
const MEMORY_ORDER = [
  // Leo/need OC
  '星乃一歌的记忆',
  '天马咲希的记忆',
  '望月穗波的记忆',
  '日野森志步的记忆',
  // MORE MORE JUMP! OC
  '花里实乃理的记忆',
  '桐谷遥的记忆',
  '桃井爱莉的记忆',
  '日野森雫的记忆',
  // Vivid BAD SQUAD OC
  '小豆泽心羽的记忆',
  '白石杏的记忆',
  '东云彰人的记忆',
  '青柳冬弥的记忆',
  // Wonderlands×Showtime OC
  '天马司的记忆',
  '凤笑梦的记忆',
  '草薙宁宁的记忆',
  '神代类的记忆',
  // 25点 OC
  '宵崎奏的记忆',
  '朝比奈真冬的记忆',
  '东云绘名的记忆',
  '晓山瑞希的记忆',
  // VS 官方默认顺序
  '初音未来的记忆',
  '镜音铃的记忆',
  '镜音连的记忆',
  '巡音流歌的记忆',
  'MEIKO的记忆',
  'KAITO的记忆',
]

describe('MATERIALS order and names', () => {
  it('has base materials in the specified order', () => {
    const actualBase = MATERIALS.slice(0, BASE_MATERIAL_NAMES.length).map(m => m.name)
    expect(actualBase).toEqual(BASE_MATERIAL_NAMES)
  })

  it('appends unique memory materials after base materials in group order', () => {
    const tail = MATERIALS.slice(BASE_MATERIAL_NAMES.length).map(m => m.name)
    expect(tail).toEqual(MEMORY_ORDER)
  })

  it('exports MEMORY_MATERIALS in the same order', () => {
    expect(MEMORY_MATERIALS.map(m => m.name)).toEqual(MEMORY_ORDER)
  })

  it('groups materials into basic and memory sections', () => {
    expect(MATERIAL_SECTIONS.map(s => s.id)).toEqual(['basic', 'memory'])
    expect(MATERIAL_SECTIONS[0].items.map(m => m.name)).toEqual(BASE_MATERIAL_NAMES)
    expect(MATERIAL_SECTIONS[1].items.map(m => m.name)).toEqual(MEMORY_ORDER)
  })

  it('classifies material keys into sections', () => {
    expect(getMaterialSection('memory-初音未来')).toBe('memory')
    expect(getMaterialSection('wish-wood')).toBe('basic')
    expect(getMaterialSection('unknown-key')).toBeUndefined()
  })

  it('sorts by shared material order with basic before memory', () => {
    const basicFirst = getMaterialSortIndex('wish-wood')
    const memoryFirst = getMaterialSortIndex('memory-KAITO')
    const memoryLast = getMaterialSortIndex('memory-初音未来')
    expect(basicFirst).toBeLessThan(memoryFirst)
    expect(memoryLast).toBeLessThan(memoryFirst)
    expect(getMaterialSortIndex('unknown-key')).toBe(Number.MAX_SAFE_INTEGER)
  })

  it('assigns base icons from key-mapped PNGs', () => {
    const expectedBaseIcons = BASE_MATERIAL_NAMES.map(
      name => `/icons/base/${MATERIALS.find(m => m.name === name)!.key}.png`
    )
    const actualBase = MATERIALS.slice(0, BASE_MATERIAL_NAMES.length).map(m => m.icon)
    expect(actualBase).toEqual(expectedBaseIcons)
  })

  it('preserves memory icon assignment behavior', () => {
    const memoryIcons = MEMORY_MATERIALS.map(m => m.icon)
    const expectedIcons = MEMORY_ORDER.map((_, i) => `/icons/memory/item_memoria_${i + 1}.png`)
    expect(memoryIcons).toEqual(expectedIcons)
  })

  it('looks up memory icon by character name', () => {
    expect(getMemoryMaterialIcon('星乃一歌')).toBe('/icons/memory/item_memoria_1.png')
    expect(getMemoryMaterialIcon('镜音铃')).toBe('/icons/memory/item_memoria_22.png')
    expect(getMemoryMaterialIcon('巡音流歌')).toBe('/icons/memory/item_memoria_24.png')
    expect(getMemoryMaterialIcon('MEIKO')).toBe('/icons/memory/item_memoria_25.png')
    expect(getMemoryMaterialIcon('KAITO')).toBe('/icons/memory/item_memoria_26.png')
    expect(getMemoryMaterialIcon('不存在的角色')).toBeUndefined()
  })

  it('returns new translated names for legacy keys', () => {
    expect(getMaterialName('wish-wood')).toBe('心愿木材')
    expect(getMaterialName('heavy-wood')).toBe('硬质木材')
    expect(getMaterialName('light-wood')).toBe('轻质木材')
    expect(getMaterialName('sticky-sap')).toBe('粘稠的树液')
    expect(getMaterialName('wish-pebble')).toBe('心愿石块')
    expect(getMaterialName('clay')).toBe('粘土')
    expect(getMaterialName('pure-glass')).toBe('漂亮的玻璃')
    expect(getMaterialName('new-tone')).toBe('空白的音色')
    expect(getMaterialName('soft-flax')).toBe('顺滑的亚麻')
    expect(getMaterialName('fluffy-cotton')).toBe('蓬松的棉花')
    expect(getMaterialName('clover')).toBe('四叶草')
  })
})
