'use client'

import { useCallback } from 'react'
import { useStore } from '@/store/useStore'

export default function PDFUploader() {
  const { setPdfFile } = useStore()

  const handleFile = useCallback((file: File) => {
    if (file.type === 'application/pdf') {
      setPdfFile(file)
    }
  }, [setPdfFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="flex flex-col items-center justify-center w-full max-w-2xl h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white"
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="hidden"
        id="pdf-upload"
      />
      <label htmlFor="pdf-upload" className="flex flex-col items-center cursor-pointer">
        <svg
          className="w-12 h-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-600 text-lg mb-1">Drop your PDF here</p>
        <p className="text-gray-400 text-sm">or click to browse</p>
      </label>
    </div>
  )
}
