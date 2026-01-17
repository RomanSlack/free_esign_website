'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'

export default function CursorTooltip() {
  const { pdfPages, contextMenu, signatureModal } = useStore()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (pdfPages.length === 0 || contextMenu.visible || signatureModal.visible) {
      setVisible(false)
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isOverPdf = target.closest('.pdf-page-container')

      if (isOverPdf) {
        setPosition({ x: e.clientX, y: e.clientY })
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [pdfPages.length, contextMenu.visible, signatureModal.visible])

  if (!visible) return null

  return (
    <div
      className="fixed pointer-events-none z-40 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg"
      style={{
        left: position.x + 15,
        top: position.y + 15,
      }}
    >
      Click to add
    </div>
  )
}
