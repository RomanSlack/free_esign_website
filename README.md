# Free eSign Website

![Made with Claude Code](https://img.shields.io/badge/Made%20with-Claude%20Code-orange)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4)
![Zustand](https://img.shields.io/badge/Zustand-5-brown)

![Free eSign Screenshot](readme_images/free_e_sign_image.png)

A free, open-source e-signature web application for signing documents online. Upload a PDF, add signatures, text, and dates, then download your signed document instantly. No login required, no accounts, no restrictions. All processing happens in your browser for complete privacy.

## Features

- PDF upload with drag and drop support
- Three signature creation methods: draw, type, or select from signature fonts
- Add text fields and date stamps
- Drag, resize, and edit placed elements
- Export signed PDF with embedded signatures
- Fully client-side processing for privacy

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19, Tailwind CSS 4
- **State**: Zustand
- **PDF Rendering**: pdfjs-dist
- **PDF Export**: pdf-lib
- **Signatures**: react-signature-canvas

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

MIT
