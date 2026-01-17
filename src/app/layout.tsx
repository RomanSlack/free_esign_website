import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free eSign - Sign Documents Online",
  description: "Free, open-source e-signature tool. Sign PDFs instantly with no login required. Add signatures, text, and dates to documents. All processing happens in your browser for complete privacy.",
  keywords: ["e-signature", "sign pdf", "free esign", "document signing", "pdf signature", "online signature", "digital signature"],
  authors: [{ name: "Roman Slack", url: "https://romanslack.com" }],
  creator: "Roman Slack",
  publisher: "Roman Slack",
  openGraph: {
    title: "Free eSign - Sign Documents Online",
    description: "Free, open-source e-signature tool. Sign PDFs instantly with no login required.",
    url: "https://github.com/RomanSlack/free_esign_website",
    siteName: "Free eSign",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free eSign - Sign Documents Online",
    description: "Free, open-source e-signature tool. Sign PDFs instantly with no login required.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
