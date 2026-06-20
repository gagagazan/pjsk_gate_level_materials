import { DataActions } from './data-actions'

export function AppBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#FAFAFA] border-[#E0E0E0]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#212121]">PJSK 大门升级材料管理器</h1>
        <DataActions />
      </div>
    </header>
  )
}
