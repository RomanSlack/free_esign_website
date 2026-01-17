'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useStore } from '@/store/useStore'
import Stamp from './Stamp'

export default function PDFViewer() {
  const { pdfFile, pdfPages, setPdfPages, stamps, showContextMenu, setSelectedStampId, hideContextMenu } = useStore()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pdfFile) return

    const loadPdf = async () => {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const pages: string[] = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const scale = 1.5
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({ canvasContext: context, viewport, canvas }).promise
        pages.push(canvas.toDataURL())
      }

      setPdfPages(pages)
    }

    loadPdf()
  }, [pdfFile, setPdfPages])

  const handlePageClick = useCallback((e: React.MouseEvent<HTMLDivElement>, pageIndex: number) => {
    e.stopPropagation()
    const target = e.target as HTMLElement
    if (target.closest('.stamp-element')) return

    const rect = e.currentTarget.getBoundingClientRect()
    const localX = e.clientX - rect.left
    const localY = e.clientY - rect.top

    setSelectedStampId(null)
    // Pass both local coords (for stamp placement) and viewport coords (for menu position)
    showContextMenu(localX, localY, pageIndex, e.clientX, e.clientY)
  }, [showContextMenu, setSelectedStampId])

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.context-menu') && !target.closest('.stamp-element')) {
      hideContextMenu()
    }
  }, [hideContextMenu])

  if (pdfPages.length === 0) return null

  return (
    <div ref={containerRef} onClick={handleContainerClick} className="flex flex-col items-center gap-4">
      {pdfPages.map((page, pageIndex) => (
        <div
          key={pageIndex}
          className="relative bg-white shadow-lg"
          onClick={(e) => handlePageClick(e, pageIndex)}
          style={{ cursor: 'crosshair' }}
        >
          <img src={page} alt={`Page ${pageIndex + 1}`} className="block" draggable={false} />
          {stamps
            .filter((stamp) => stamp.pageIndex === pageIndex)
            .map((stamp) => (
              <Stamp key={stamp.id} stamp={stamp} />
            ))}
        </div>
      ))}
    </div>
  )
}
