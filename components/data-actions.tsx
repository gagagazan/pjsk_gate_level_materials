"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppState } from "@/lib/state"
import { exportState, importState } from "@/lib/storage"
import { ResetDialog } from "./reset-dialog"
import {
  Clipboard,
  ChevronDown,
  Download,
  File,
  Trash2,
  Upload,
} from "lucide-react"

export function DataActions() {
  const { state, dispatch } = useAppState()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [clipboardExported, setClipboardExported] = useState(false)
  const [pasteDialogOpen, setPasteDialogOpen] = useState(false)
  const [pasteText, setPasteText] = useState("")

  const handleExport = () => {
    const blob = new Blob([exportState(state)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pjsk-gate-materials-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportState(state))
      setClipboardExported(true)
      window.setTimeout(() => setClipboardExported(false), 1500)
    } catch (err) {
      alert("导出失败：" + (err instanceof Error ? err.message : "未知错误"))
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handlePasteDialogOpen = async () => {
    setPasteText("")
    setPasteDialogOpen(true)
    try {
      if (navigator.clipboard) {
        setPasteText(await navigator.clipboard.readText())
      }
    } catch {
      // Clipboard permission failures leave the textarea empty for manual paste.
    }
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const newState = importState(text)
      dispatch({ type: "LOAD_STATE", state: newState })
    } catch (err) {
      alert("导入失败：" + (err instanceof Error ? err.message : "未知错误"))
    }
    e.target.value = ""
  }

  const handlePasteImport = () => {
    try {
      const newState = importState(pasteText)
      dispatch({ type: "LOAD_STATE", state: newState })
      setPasteDialogOpen(false)
    } catch (err) {
      alert("导入失败：" + (err instanceof Error ? err.message : "未知错误"))
    }
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            title="导出"
            aria-label={clipboardExported ? "已复制" : "导出"}
          >
            <Download data-icon="inline-start" />
            <span className="hidden sm:inline">
              {clipboardExported ? "已复制 ✓" : "导出"}
            </span>
            <ChevronDown data-icon="inline-end" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={handleExport}>
              <File data-icon="inline-start" />
              下载 JSON 文件
              <DropdownMenuShortcut>.json</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void handleExportClipboard()}>
              <Clipboard data-icon="inline-start" />
              复制到剪贴板
              <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" title="导入" aria-label="导入">
            <Upload data-icon="inline-start" />
            <span className="hidden sm:inline">导入</span>
            <ChevronDown data-icon="inline-end" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={handleImportClick}>
              <File data-icon="inline-start" />
              从文件导入
              <DropdownMenuShortcut>.json</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void handlePasteDialogOpen()}>
              <Clipboard data-icon="inline-start" />
              粘贴配置文本
              <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ResetDialog onConfirm={() => dispatch({ type: "RESET_STATE" })}>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive"
          title="重置"
        >
          <Trash2 className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">重置</span>
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
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.763-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </a>
      <Dialog open={pasteDialogOpen} onOpenChange={setPasteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>粘贴配置文本</DialogTitle>
            <DialogDescription>
              粘贴之前导出的 JSON 配置，导入后会覆盖当前数据。
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="在此粘贴 JSON 配置"
            aria-label="配置 JSON"
            data-testid="clipboard-import-textarea"
            rows={10}
            className="min-h-48 w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasteDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handlePasteImport}>导入</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
