import { PDFDocument } from 'pdf-lib'
import { Stamp } from '@/store/useStore'

export async function exportPdf(
  originalFile: File,
  stamps: Stamp[],
  pageImages: string[]
): Promise<Blob> {
  const originalBytes = await originalFile.arrayBuffer()
  const pdfDoc = await PDFDocument.load(originalBytes)
  const pages = pdfDoc.getPages()

  // Calculate the scale factor between rendered image and actual PDF
  // The PDF viewer renders at scale 1.5
  const scale = 1.5

  for (const stamp of stamps) {
    const page = pages[stamp.pageIndex]
    if (!page) continue

    const { width: pageWidth, height: pageHeight } = page.getSize()

    // Get the rendered image dimensions to calculate scale
    const img = new Image()
    img.src = pageImages[stamp.pageIndex]
    await new Promise((resolve) => {
      img.onload = resolve
    })

    const imageWidth = img.width
    const imageHeight = img.height

    // Calculate position in PDF coordinates (PDF origin is bottom-left)
    const scaleX = pageWidth / imageWidth
    const scaleY = pageHeight / imageHeight

    const pdfX = stamp.x * scaleX
    const pdfY = pageHeight - (stamp.y + stamp.height) * scaleY
    const pdfWidth = stamp.width * scaleX
    const pdfHeight = stamp.height * scaleY

    if (stamp.type === 'signature') {
      // Embed the signature image
      const imageData = stamp.content.split(',')[1]
      const imageBytes = Uint8Array.from(atob(imageData), (c) => c.charCodeAt(0))
      const pngImage = await pdfDoc.embedPng(imageBytes)

      page.drawImage(pngImage, {
        x: pdfX,
        y: pdfY,
        width: pdfWidth,
        height: pdfHeight,
      })
    } else if (stamp.type === 'text' || stamp.type === 'date') {
      // Draw text
      const fontSize = Math.min(pdfHeight * 0.7, stamp.type === 'date' ? 12 : 16)
      page.drawText(stamp.content, {
        x: pdfX,
        y: pdfY + pdfHeight * 0.3,
        size: fontSize,
      })
    }
  }

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
}

export function downloadPdf(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
