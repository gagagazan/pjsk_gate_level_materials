import { DataActions } from './data-actions'

export function AppBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#FAFAFA] border-[#E0E0E0]">
      <div className="flex h-14">
        <div className="hidden md:block w-16 lg:w-48 shrink-0 border-r border-[#E0E0E0]" />
        <div className="flex flex-1 min-w-0 items-center justify-between px-4 lg:px-6">
          <h1 className="text-lg font-bold text-[#212121] truncate">PJSK 大门升级材料管理器</h1>
          <DataActions />
        </div>
      </div>
    </header>
  )
}
