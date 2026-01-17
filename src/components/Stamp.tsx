'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { useStore, Stamp as StampType } from '@/store/useStore'

interface StampProps {
  stamp: StampType
}

export default function Stamp({ stamp }: StampProps) {
  const { selectedStampId, setSelectedStampId, updateStamp, removeStamp, setEditingStampId, editingStampId } = useStore()
  const isSelected = selectedStampId === stamp.id
  const isEditing = editingStampId === stamp.id
  const [isResizing, setIsResizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, stampX: 0, stampY: 0 })
  const resizeStart = useRef({ width: 0, height: 0, mouseX: 0, mouseY: 0 })
  const inputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if ((e.target as HTMLElement).classList.contains('resize-handle')) return

    setSelectedStampId(stamp.id)
    setIsDragging(true)
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      stampX: stamp.x,
      stampY: stamp.y,
    }
  }, [stamp.id, stamp.x, stamp.y, setSelectedStampId])

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    resizeStart.current = {
      width: stamp.width,
      height: stamp.height,
      mouseX: e.clientX,
      mouseY: e.clientY,
    }
  }, [stamp.width, stamp.height])

  useEffect(() => {
    if (!isDragging && !isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.current.x
        const dy = e.clientY - dragStart.current.y
        updateStamp(stamp.id, {
          x: dragStart.current.stampX + dx,
          y: dragStart.current.stampY + dy,
        })
      } else if (isResizing) {
        const dx = e.clientX - resizeStart.current.mouseX
        const dy = e.clientY - resizeStart.current.mouseY
        const newWidth = Math.max(50, resizeStart.current.width + dx)
        const newHeight = Math.max(20, resizeStart.current.height + dy)
        // No max size limit - user can resize as large as needed
        updateStamp(stamp.id, { width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, stamp.id, updateStamp])

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (stamp.type === 'text') {
      setEditingStampId(stamp.id)
    }
  }, [stamp.id, stamp.type, setEditingStampId])

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateStamp(stamp.id, { content: e.target.value })
  }, [stamp.id, updateStamp])

  const handleTextBlur = useCallback(() => {
    setEditingStampId(null)
  }, [setEditingStampId])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditingStampId(null)
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (!isEditing && isSelected) {
        removeStamp(stamp.id)
      }
    }
  }, [isEditing, isSelected, removeStamp, stamp.id, setEditingStampId])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const renderContent = () => {
    if (stamp.type === 'signature') {
      return (
        <img
          src={stamp.content}
          alt="Signature"
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
      )
    }

    if (stamp.type === 'text') {
      const fontSize = Math.max(12, Math.min(stamp.height * 0.6, 64))
      if (isEditing) {
        return (
          <input
            ref={inputRef}
            value={stamp.content}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            onKeyDown={handleKeyDown}
            placeholder="Type here..."
            className="w-full h-full bg-transparent outline-none placeholder:text-gray-400 px-1"
            style={{ fontSize, fontFamily: stamp.fontFamily }}
          />
        )
      }
      return (
        <span
          className={`select-none truncate w-full h-full flex items-center px-1 ${!stamp.content ? 'text-gray-400' : ''}`}
          style={{ fontSize, fontFamily: stamp.fontFamily }}
        >
          {stamp.content || 'Text'}
        </span>
      )
    }

    if (stamp.type === 'date') {
      const fontSize = Math.max(12, Math.min(stamp.height * 0.6, 48))
      return (
        <span
          className="select-none truncate w-full h-full flex items-center px-1"
          style={{ fontSize }}
        >
          {stamp.content}
        </span>
      )
    }

    return null
  }

  return (
    <div
      ref={contentRef}
      className={`stamp-element absolute cursor-move ${
        isSelected ? 'outline outline-2 outline-blue-500' : ''
      }`}
      style={{
        left: stamp.x,
        top: stamp.y,
        width: stamp.width,
        height: stamp.height,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {renderContent()}
      {isSelected && (
        <>
          <div
            className="resize-handle absolute w-3 h-3 bg-blue-500 cursor-se-resize rounded-sm"
            style={{ right: -6, bottom: -6 }}
            onMouseDown={handleResizeMouseDown}
          />
          <button
            className="absolute w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
            style={{ top: -10, right: -10 }}
            onClick={(e) => {
              e.stopPropagation()
              removeStamp(stamp.id)
            }}
          >
            ×
          </button>
        </>
      )}
    </div>
  )
}
