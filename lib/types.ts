export type UnitId = 'ln' | 'mmj' | 'vbs' | 'ws' | '25'
export type MaterialCategory = 'memory' | 'basic' | 'metal' | 'processed' | 'special'
export interface MaterialItem { key: string; name: string; count: number; category: MaterialCategory }
export interface LevelRecipe { level: number; materials: MaterialItem[] }
export interface UnitConfig { id: UnitId; name: string; color: string; logo: string; vsMembers: string[]; ocMembers: string[]; recipes: LevelRecipe[] }
export interface UnitProgress { current: number; target: number }
export interface UserState { units: Record<UnitId, UnitProgress>; inventory: Record<string, number> }
