# PJSK 大门升级材料管理器 — 设计规格

日期：2026-06-20

## 1. 项目概述

一个基于 Next.js + TypeScript + Tailwind CSS + shadcn/ui 的纯前端应用，用于管理《Project Sekai》五团大门升级所需材料。

- 五团：Leo/need (ln)、MORE MORE JUMP! (mmj)、Vivid BAD SQUAD (vbs)、Wonderlands×Showtime (ws)、25点，Nightcord见。 (25)
- 等级范围：1–40
- 第 N 行材料 = 从 (N-1) 级升级到 N 级所需材料
- 用户填写当前等级、目标等级、现有材料，应用自动计算缺口
- 数据保存在浏览器 localStorage，支持导出/导入 JSON 备份
- 部署目标：Cloudflare Pages（静态导出）

## 2. 核心数据模型

```ts
// 五团 ID
type UnitId = 'ln' | 'mmj' | 'vbs' | 'ws' | '25'

// 单个材料项
interface MaterialItem {
  key: string          // 内部 key，例如 "4-oc-memory"
  name: string         // 显示名，例如 "4位OC记忆"
  count: number        // 需要数量
  category: 'memory' | 'basic' | 'metal' | 'processed' | 'special'
}

// 每级升级配方
interface LevelRecipe {
  level: number        // 目标等级 1..40
  materials: MaterialItem[]
}

// 每团配置
interface UnitConfig {
  id: UnitId
  name: string         // 团名，例如 "Leo/need"
  color: string        // 主题色
  vsMembers: string[]  // 该团 VS 角色名
  ocMembers: string[]  // 该团 OC 角色名
  recipes: LevelRecipe[]
}

// 用户状态
interface UserState {
  units: Record<UnitId, { current: number; target: number }>
  inventory: Record<string, number>   // 材料 key -> 拥有数量
}
```

### 材料解析规则

- `4×oc记忆×2` → 该团 4 位 OC 角色记忆，各需 2 个，总缺口为 `4 × 2 = 8`
- `3×vs记忆×2` → 该团 3 位 VS 角色记忆，各需 2 个，总缺口为 `3 × 2 = 6`
- `蓝绿色记忆` → 25点团初音未来 VS 记忆的专属名称，作为独立材料处理
- 普通材料（如 `心愿木材×20`）直接按显示数量处理

### 各团角色映射

| 组合 | OC 角色 | VS 角色 |
|---|---|---|
| Leo/need | 星乃一歌、天马咲希、望月穗波、日野森志步 | 初音未来、巡音流歌 |
| MORE MORE JUMP! | 花里实乃理、桐谷遥、桃井爱莉、日野森雫 | 初音未来、镜音铃 |
| Vivid BAD SQUAD | 小豆泽心羽、白石杏、东云彰人、青柳冬弥 | 初音未来、镜音连、MEIKO |
| Wonderlands×Showtime | 天马司、凤笑梦、草薙宁宁、神代类 | 初音未来、KAITO |
| 25点，Nightcord见。 | 宵崎奏、朝比奈真冬、东云绘名、晓山瑞希 | 初音未来 |

## 3. 页面结构

单一页面，所有管理功能在同一页面完成：

1. **顶部 App Bar**
   - 标题
   - 导出 JSON / 导入 JSON / 重置数据 按钮

2. **五团概览区**
   - 5 个团卡片横向/网格排列
   - 显示当前等级 → 目标等级
   - 点击卡片可滚动到对应详情面板

3. **材料库存面板**
   - 列出所有材料
   - 可输入当前拥有数量

4. **Dashboard 汇总**
   - 全局总缺口表
   - 按团分类缺口表
   - 缺货项视觉高亮

5. **各团详情面板**（5 个可折叠卡片）
   - 当前等级 / 目标等级滑动条
   - 升级所需材料累计清单
   - 每级明细（默认折叠）

## 4. 组件拆分

| 组件 | 职责 |
|---|---|
| `AppBar` | 顶部标题 + 数据操作按钮 |
| `DataActions` | 导出/导入/重置数据 |
| `ResetConfirmDialog` | 重置数据强确认弹窗 |
| `UnitOverviewCard` | 单团概览卡片 |
| `UnitOverviewGrid` | 五团概览网格 |
| `InventoryPanel` | 全局材料库存输入 |
| `MaterialDashboard` | 全局 + 按团分类缺口表 |
| `UnitDetailPanel` | 单团详情面板 |
| `LevelSlider` | 当前/目标等级滑动条 |
| `MaterialRow` | 单个材料展示（拥有/需要/缺口） |
| `LevelBreakdown` | 每级升级所需材料（默认折叠） |

## 5. 关键交互逻辑

### 等级滑动条

- 当前等级滑动条范围：1–40
- 目标等级滑动条范围：当前等级–40
- 拖动时实时重算缺口
- 当前等级 ≥ 目标等级时，该团显示"无需材料"

### 库存输入

- 数字输入框
- 失焦或按 Enter 时持久化到 localStorage
- 非法输入自动归零或保持上次合法值

### 累计计算

- 对每团，从 `current + 1` 到 `target` 的所有配方按 `MaterialItem.key` 聚合
- 全局汇总：五团缺口继续按 key 聚合
- 按团分类：保留各团独立缺口视图

### 数据持久化

- localStorage key：`pjsk-gate-materials-v1`
- 页面加载时读取，无数据时使用默认值（所有团当前 1 级/目标 1 级，库存全 0）
- 任何用户操作 500ms 内 debounce 写入 localStorage

### 导入/导出

- 导出：生成 JSON 文件并触发下载
- 导入：读取 JSON 文件，校验 schema，合并或覆盖当前状态
- 导入失败时显示错误提示

### 重置数据

- 点击重置按钮后弹出强确认对话框
- 对话框需明确提示"此操作会清空所有等级和库存数据，无法恢复"
- 用户必须二次确认后才执行重置

## 6. 视觉风格

遵循用户提供的"游戏数据库风 / Material 信息库风"指引：

- 背景：#FFFFFF
- 侧边栏/卡片背景：#FAFAFA
- 主色：#2E7D67
- 强调/激活色：#E91E63
- 文本主色：#212121
- 次要文本：#757575
- 边框/分割线：#E0E0E0
- 骨架屏：#EEEEEE

使用系统无衬线字体栈，中日文混排友好。

## 7. 技术方案

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui（Slider、Card、Input、Button、Dialog、Collapsible、Tabs 等）
- 纯客户端渲染
- 静态导出：`output: 'export'`
- Playwright 用于调试和端到端验证

### 数据方案

采用**全量静态类型化数据**（`lib/recipes.ts`），将 40 级 × 5 团配方硬编码。原因：

- 规则存在团별分支（vbs/ln/mmj/ws/25 各不相同）
- 硬编码更直观、类型安全、便于校对
- 运行时无需解析器，减少出错可能

## 8. 开发任务清单与验收标准

| # | 任务 | 验收标准 |
|---|---|---|
| 1 | 初始化 Next.js 项目 | `npm run dev` 能启动，App Router + TypeScript + Tailwind + shadcn/ui 配置完成 |
| 2 | 配置静态导出 | `next.config.js` 设置 `output: 'export'`，`npm run build` 成功生成 `dist` |
| 3 | 录入 5 团 40 级配方数据 | `lib/recipes.ts` 包含完整类型化数据，与原文逐行核对无误 |
| 4 | 实现材料聚合计算逻辑 | 给定 current/target/inventory，正确输出"需要/拥有/缺口" |
| 5 | 实现 localStorage 持久化 | 刷新后数据不丢失；默认状态合理；写入带 debounce |
| 6 | 实现导出/导入 JSON | 导出文件可下载并重新导入恢复；导入失败有错误提示 |
| 7 | 实现重置数据 + 强确认 | 点击重置弹出 Dialog，二次确认后才清空；取消无影响 |
| 8 | 实现 App Bar + 主题色 | 符合 Material Design 风格，主色 #2E7D67 |
| 9 | 实现五团概览卡片 + 滑动条 | 每个团当前/目标等级可调，目标 ≥ 当前，实时更新 |
| 10 | 实现库存输入面板 | 所有材料可输入拥有数量，非法输入处理合理 |
| 11 | 实现 Dashboard 汇总 | 全局总缺口 + 按团分类缺口，缺货项高亮 |
| 12 | 实现各团详情面板 | 显示累计材料 + 每级明细，明细默认折叠 |
| 13 | 响应式适配 | 桌面/平板/手机布局不崩，滑动条在移动端可用 |
| 14 | 构建并验证 Cloudflare 产物 | 无动态路由/API 依赖，产物纯静态 |
| 15 | 数据正确性验收 | 抽样核对 5/15/25/40 级材料计算结果与原文一致 |
| 16 | Playwright 调试脚本 | 至少覆盖：页面加载、滑动条调整、库存输入、导入导出流程 |

## 9. 风险与注意事项

1. **localStorage SSR 问题**：读取 localStorage 必须在 `useEffect` 或 `"use client"` 组件中进行。
2. **静态导出限制**：不能使用 API Routes、Server Actions、动态路由参数。
3. **数据准确性**：40 级配方录入是最大风险点，必须逐项核对。
4. **Cloudflare Pages**：确保产物只包含静态文件，无 Node.js 运行时依赖。
5. **shadcn/ui 组件**：按需引入，避免打包体积过大。
