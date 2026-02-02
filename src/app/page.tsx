'use client'

import { useCallback, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import PDFUploader from '@/components/PDFUploader'
import PDFViewer from '@/components/PDFViewer'
import Toolbar from '@/components/Toolbar'
import SignatureModal from '@/components/SignatureModal'
import { exportPdf, downloadPdf } from '@/lib/pdfExport'

export default function Home() {
  const { pdfFile, pdfPages, stamps, reset, undo, redo } = useStore()

  // Warn before closing if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (stamps.length > 0) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [stamps.length])

  // Undo/Redo keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          redo()
        } else {
          undo()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  const handleExport = useCallback(async () => {
    if (!pdfFile || stamps.length === 0) return

    try {
      const blob = await exportPdf(pdfFile, stamps, pdfPages)
      const filename = pdfFile.name.replace('.pdf', '_signed.pdf')
      downloadPdf(blob, filename)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }, [pdfFile, stamps, pdfPages])

  const handleReset = useCallback(() => {
    reset()
  }, [reset])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Free eSign</h1>
          {pdfFile && (
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                New Document
              </button>
              <button
                onClick={handleExport}
                disabled={stamps.length === 0}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download PDF
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Toolbar */}
      <Toolbar />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {!pdfFile ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <PDFUploader />
            <p className="mt-6 text-gray-500 text-sm">
              Your documents stay private — everything happens in your browser
            </p>
          </div>
        ) : (
          <div className="pdf-page-container">
            <PDFViewer />
          </div>
        )}
      </main>

      {/* Signature Modal */}
      <SignatureModal />

      {/* Footer */}
      <footer className="fixed bottom-4 left-4 flex items-center gap-3 text-sm text-gray-500">
        <a
          href="https://github.com/RomanSlack/free_esign_website"
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>
        <span>
          Created by{' '}
          <a
            href="https://romanslack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 underline"
          >
            Roman Slack
          </a>
        </span>
      </footer>
    </div>
  )
}
