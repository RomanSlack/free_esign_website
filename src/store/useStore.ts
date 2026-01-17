import { create } from 'zustand'

export interface Stamp {
  id: string
  type: 'signature' | 'text' | 'date'
  x: number
  y: number
  width: number
  height: number
  content: string
  pageIndex: number
  fontFamily?: string
}

interface ContextMenu {
  visible: boolean
  x: number
  y: number
  pageIndex: number
  viewportX: number
  viewportY: number
}

interface SignatureModal {
  visible: boolean
  x: number
  y: number
  pageIndex: number
}

export type Tool = 'select' | 'signature' | 'text' | 'date'

interface AppState {
  pdfFile: File | null
  pdfPages: string[]
  stamps: Stamp[]
  selectedStampId: string | null
  contextMenu: ContextMenu
  signatureModal: SignatureModal
  editingStampId: string | null
  selectedTool: Tool

  setPdfFile: (file: File | null) => void
  setPdfPages: (pages: string[]) => void
  addStamp: (stamp: Stamp) => void
  updateStamp: (id: string, updates: Partial<Stamp>) => void
  removeStamp: (id: string) => void
  setSelectedStampId: (id: string | null) => void
  showContextMenu: (x: number, y: number, pageIndex: number, viewportX: number, viewportY: number) => void
  hideContextMenu: () => void
  showSignatureModal: (x: number, y: number, pageIndex: number) => void
  hideSignatureModal: () => void
  setEditingStampId: (id: string | null) => void
  setSelectedTool: (tool: Tool) => void
  reset: () => void
}

const initialState = {
  pdfFile: null,
  pdfPages: [],
  stamps: [],
  selectedStampId: null,
  contextMenu: { visible: false, x: 0, y: 0, pageIndex: 0, viewportX: 0, viewportY: 0 },
  signatureModal: { visible: false, x: 0, y: 0, pageIndex: 0 },
  editingStampId: null,
  selectedTool: 'signature' as Tool,
}

export const useStore = create<AppState>((set) => ({
  ...initialState,

  setPdfFile: (file) => set({ pdfFile: file }),
  setPdfPages: (pages) => set({ pdfPages: pages }),

  addStamp: (stamp) => set((state) => ({
    stamps: [...state.stamps, stamp]
  })),

  updateStamp: (id, updates) => set((state) => ({
    stamps: state.stamps.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    ),
  })),

  removeStamp: (id) => set((state) => ({
    stamps: state.stamps.filter((s) => s.id !== id),
    selectedStampId: state.selectedStampId === id ? null : state.selectedStampId,
  })),

  setSelectedStampId: (id) => set({ selectedStampId: id }),

  showContextMenu: (x, y, pageIndex, viewportX, viewportY) => set({
    contextMenu: { visible: true, x, y, pageIndex, viewportX, viewportY }
  }),

  hideContextMenu: () => set({
    contextMenu: { visible: false, x: 0, y: 0, pageIndex: 0, viewportX: 0, viewportY: 0 }
  }),

  showSignatureModal: (x, y, pageIndex) => set({ signatureModal: { visible: true, x, y, pageIndex } }),
  hideSignatureModal: () => set({ signatureModal: { visible: false, x: 0, y: 0, pageIndex: 0 } }),

  setEditingStampId: (id) => set({ editingStampId: id }),

  setSelectedTool: (tool) => set({ selectedTool: tool }),

  reset: () => set(initialState),
}))
