import { describe, expect, it } from 'vitest'
import { MATERIALS, getMaterialName, MEMORY_MATERIALS } from './materials'

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

// MEMORY_MATERIALS 是去重的唯一材料列表，按"各团 oc -> vs"顺序首次出现排列。
const MEMORY_ORDER = [
  // Leo/need
  '星乃一歌的记忆',
  '天马咲希的记忆',
  '望月穗波的记忆',
  '日野森志步的记忆',
  '初音未来的记忆',
  '巡音流歌的记忆',
  // MORE MORE JUMP!
  '花里实乃理的记忆',
  '桐谷遥的记忆',
  '桃井爱莉的记忆',
  '日野森雫的记忆',
  '镜音铃的记忆',
  // Vivid BAD SQUAD
  '小豆泽心羽的记忆',
  '白石杏的记忆',
  '东云彰人的记忆',
  '青柳冬弥的记忆',
  '镜音连的记忆',
  'MEIKO的记忆',
  // Wonderlands×Showtime
  '天马司的记忆',
  '凤笑梦的记忆',
  '草薙宁宁的记忆',
  '神代类的记忆',
  'KAITO的记忆',
  // 25点
  '宵崎奏的记忆',
  '朝比奈真冬的记忆',
  '东云绘名的记忆',
  '晓山瑞希的记忆',
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
