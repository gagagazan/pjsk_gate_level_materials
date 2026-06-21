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
      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="w-4 h-4 mr-1" /> 导出
      </Button>
      <Button variant="outline" size="sm" onClick={handleImportClick}>
        <Upload className="w-4 h-4 mr-1" /> 导入
      </Button>
      <ResetDialog onConfirm={() => dispatch({ type: 'RESET_STATE' })}>
        <Button variant="outline" size="sm" className="text-destructive">
          <Trash2 className="w-4 h-4 mr-1" /> 重置
        </Button>
      </ResetDialog>
    </div>
  )
}
