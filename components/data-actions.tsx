'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useAppState } from '@/lib/state'
import { exportState, importState } from '@/lib/storage'
import { ResetDialog } from './reset-dialog'
import { Download, Upload, Trash2 } from 'lucide-react'

export function DataActions() {
  const { state, dispatch } = useAppState()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const blob = new Blob([exportState(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pjsk-gate-materials-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const newState = importState(text)
      dispatch({ type: 'LOAD_STATE', state: newState })
    } catch (err) {
      alert('导入失败：' + (err instanceof Error ? err.message : '未知错误'))
    }
    e.target.value = ''
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        data-testid="import-file-input"
        onChange={handleFileChange}
        className="sr-only"
        aria-hidden="true"
      />
      <Button variant="outline" size="sm" onClick={handleExport} title="导出">
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline ml-1">导出</span>
      </Button>
      <Button variant="outline" size="sm" onClick={handleImportClick} title="导入">
        <Upload className="w-4 h-4" />
        <span className="hidden sm:inline ml-1">导入</span>
      </Button>
      <ResetDialog onConfirm={() => dispatch({ type: 'RESET_STATE' })}>
        <Button variant="outline" size="sm" className="text-destructive" title="重置">
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline ml-1">重置</span>
        </Button>
      </ResetDialog>
      <a
        href="https://github.com/gagagazan/pjsk_gate_level_materials"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub 仓库"
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background text-foreground hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.763-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </a>
    </div>
  )
}
