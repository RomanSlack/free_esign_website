import { PDFDocument, rgb } from 'pdf-lib'
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
    } else if (stamp.type === 'checkmark') {
      // Center the shape within the stamp bounds
      const size = Math.min(pdfWidth, pdfHeight)
      const shapeSize = size * 0.55  // Match the visual size of the Unicode character
      const offsetX = pdfX + (pdfWidth - shapeSize) / 2
      const offsetY = pdfY + (pdfHeight - shapeSize) / 2

      if (stamp.content === '■') {
        // Draw a filled black square
        page.drawRectangle({
          x: offsetX,
          y: offsetY,
          width: shapeSize,
          height: shapeSize,
          color: rgb(0, 0, 0),
        })
      } else {
        // Draw a checkmark using lines
        const left = offsetX
        const right = offsetX + shapeSize
        const top = offsetY + shapeSize
        const bottom = offsetY
        const midX = left + shapeSize * 0.35
        const midY = bottom + shapeSize * 0.3

        page.drawLine({
          start: { x: left, y: bottom + shapeSize * 0.5 },
          end: { x: midX, y: midY },
          thickness: size * 0.1,
          color: rgb(0, 0, 0),
        })
        page.drawLine({
          start: { x: midX, y: midY },
          end: { x: right, y: top },
          thickness: size * 0.1,
          color: rgb(0, 0, 0),
        })
      }
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
