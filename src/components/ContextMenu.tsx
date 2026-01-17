'use client'

import { useCallback } from 'react'
import { useStore } from '@/store/useStore'

export default function ContextMenu() {
  const { contextMenu, hideContextMenu, addStamp, showSignatureModal } = useStore()

  const handleAddSignature = useCallback(() => {
    showSignatureModal(contextMenu.x, contextMenu.y, contextMenu.pageIndex)
    hideContextMenu()
  }, [hideContextMenu, showSignatureModal, contextMenu.x, contextMenu.y, contextMenu.pageIndex])

  const handleAddText = useCallback(() => {
    const id = `text-${Date.now()}`
    addStamp({
      id,
      type: 'text',
      x: contextMenu.x - 50,
      y: contextMenu.y - 12,
      width: 100,
      height: 24,
      content: 'Text',
      pageIndex: contextMenu.pageIndex,
    })
    hideContextMenu()
  }, [addStamp, contextMenu.x, contextMenu.y, contextMenu.pageIndex, hideContextMenu])

  const handleAddDate = useCallback(() => {
    const id = `date-${Date.now()}`
    const today = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
    addStamp({
      id,
      type: 'date',
      x: contextMenu.x - 50,
      y: contextMenu.y - 12,
      width: 100,
      height: 24,
      content: today,
      pageIndex: contextMenu.pageIndex,
    })
    hideContextMenu()
  }, [addStamp, contextMenu.x, contextMenu.y, contextMenu.pageIndex, hideContextMenu])

  if (!contextMenu.visible) return null

  return (
    <div
      className="context-menu fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
      style={{
        left: contextMenu.viewportX + 10,
        top: contextMenu.viewportY + 10,
      }}
    >
      <button
        onClick={handleAddSignature}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Signature
      </button>
      <button
        onClick={handleAddText}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        Text
      </button>
      <button
        onClick={handleAddDate}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Date
      </button>
    </div>
  )
}
