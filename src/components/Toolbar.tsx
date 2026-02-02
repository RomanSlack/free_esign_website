'use client'

import { ReactNode } from 'react'
import { useStore, Tool, CheckmarkVariant } from '@/store/useStore'

const tools: { id: Tool; label: string; icon: ReactNode }[] = [
  {
    id: 'select',
    label: 'Select',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
  },
  {
    id: 'signature',
    label: 'Signature',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    id: 'text',
    label: 'Text',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ),
  },
  {
    id: 'date',
    label: 'Date',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'checkmark',
    label: 'Checkmark',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
]

const checkmarkVariants: { id: CheckmarkVariant; label: string; symbol: string }[] = [
  { id: 'square', label: 'Square', symbol: '■' },
  { id: 'check', label: 'Check', symbol: '✓' },
]

export default function Toolbar() {
  const { selectedTool, setSelectedTool, pdfFile, checkmarkVariant, setCheckmarkVariant } = useStore()

  if (!pdfFile) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
      {selectedTool === 'checkmark' && (
        <div className="bg-white rounded-full shadow-lg border border-gray-200 px-2 py-1 flex items-center gap-1">
          {checkmarkVariants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setCheckmarkVariant(variant.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                checkmarkVariant === variant.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-base">{variant.symbol}</span>
              {variant.label}
            </button>
          ))}
        </div>
      )}
      <div className="bg-white rounded-full shadow-lg border border-gray-200 px-2 py-2 flex items-center gap-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTool === tool.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tool.icon}
            {tool.label}
          </button>
        ))}
      </div>
    </div>
  )
}
