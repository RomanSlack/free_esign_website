'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useStore } from '@/store/useStore'
import Stamp from './Stamp'

export default function PDFViewer() {
  const { pdfFile, pdfPages, setPdfPages, stamps, setSelectedStampId, selectedTool, addStamp, showSignatureModal, setEditingStampId } = useStore()
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
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (selectedTool === 'select') {
      setSelectedStampId(null)
      return
    }

    if (selectedTool === 'signature') {
      showSignatureModal(x, y, pageIndex)
      return
    }

    if (selectedTool === 'text') {
      const id = `text-${Date.now()}`
      addStamp({
        id,
        type: 'text',
        x: x - 50,
        y: y - 12,
        width: 100,
        height: 24,
        content: '',
        pageIndex,
      })
      setSelectedStampId(id)
      setEditingStampId(id)
      return
    }

    if (selectedTool === 'date') {
      const today = new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
      addStamp({
        id: `date-${Date.now()}`,
        type: 'date',
        x: x - 50,
        y: y - 12,
        width: 100,
        height: 24,
        content: today,
        pageIndex,
      })
      return
    }
  }, [selectedTool, setSelectedStampId, addStamp, showSignatureModal, setEditingStampId])

  if (pdfPages.length === 0) return null

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4">
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
