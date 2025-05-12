import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

// Define metadata
export const metadata: Metadata = {
  // Recommended: Define a base URL for resolving relative paths
  // Replace with your actual deployed URL
  // metadataBase: new URL('YOUR_CANONICAL_URL'), // e.g., https://www.opennotionai.com

  title: {
    default: 'OpenNotionAI | Open source alternative to Notion AI',
    template: '%s | OpenNotionAI', // For page-specific titles
  },
  description: 'OpenNotionAI: Open source alternative to Notion AI. Connect your LLM API (OpenAI, Anthropic, etc.) and chat with your Notion database from any device. Free, self-hostable, and private.',
  keywords: ['Notion AI', 'Open Source Notion AI', 'Chat with Notion', 'LLM Notion', 'Notion Database Chat', 'Self-hosted Notion AI', 'Free Notion AI', 'Notion LLM Integration', 'OpenAI Notion', 'Anthropic Notion'],
  applicationName: 'OpenNotionAI',
  authors: [{ name: 'OpenNotionAI Team' /* Or your name/org */ }], // Consider adding author info
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Add icons if available in /public
  // icons: {
  //   icon: '/favicon.ico', // or /favicon.png
  //   apple: '/apple-touch-icon.png',
  // },
  // Add manifest if available in /public
  // manifest: '/manifest.json',

  // Open Graph (Facebook, LinkedIn, Reddit, etc.)
  openGraph: {
    title: 'OpenNotionAI |  Open source alternative to Notion AI',
    description: 'Open source alternative to Notion AI. Connect your LLM and chat with your Notion database.',
    url: 'YOUR_CANONICAL_URL', // Replace with your actual deployed URL
    siteName: 'OpenNotionAI',
    // Replace with the actual path to your OG image in /public (1200x630 recommended)
    images: [
      {
        url: '/logo-light.png', // Example: replace with your actual image path
        width: 1200,
        height: 630,
        alt: 'OpenNotionAI Logo and promotional banner',
      },
    ],
    locale: 'en_US', // Default locale
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'OpenNotionAI | Open source alternative to Notion AI',
    description: 'Open source alternative to Notion AI. Connect your LLM and chat with your Notion database.',
    // Replace with the actual path to your Twitter image in /public (same as og:image often works)
    images: ['/logo-light.png'], // Example: replace with your actual image path
    // Optional: Add your Twitter handle
    // site: '@YourTwitterSiteHandle',
    // creator: '@YourTwitterCreatorHandle',
  },

  // Optional: Verification for search consoles
  // verification: {
  //   google: 'YOUR_GOOGLE_SITE_VERIFICATION_TOKEN',
  //   yandex: 'YOUR_YANDEX_VERIFICATION_TOKEN',
  //   other: {
  //     me: ['your-email@example.com', 'your-link'],
  //   },
  // },

  // Optional: Theme color for browser UI
  // themeColor: '#ffffff', // Example color
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
