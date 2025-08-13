import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://youtube.com'),
  title: 'Dosa Cafe – Authentic & Delicious South Indian Dosas in Pondicherry',
  description:
    'Visit Dosa Cafe in Pondicherry for authentic South Indian dosas – crispy, fluffy, and full of flavor. From masala dosa to special varieties, every bite is made fresh with traditional recipes.',
  keywords: [
    'Dosa Cafe',
    'authentic dosa Pondicherry',
    'South Indian food Pondicherry',
    'crispy dosa Pondicherry',
    'masala dosa Pondicherry',
    'best dosa near me',
    'plain dosa',
    'dosa varieties',
    'vegetarian dosa',
    'Indian street food Pondicherry',
    'best dosa restaurant Pondicherry'
  ],

  // Open Graph (for Facebook, LinkedIn, etc.)
  openGraph: {
    title: 'Dosa Cafe – Your Destination for Authentic South Indian Dosas',
    description:
      'Enjoy the taste of tradition at Dosa Cafe in Pondicherry. Freshly made, authentic South Indian dosas – from crispy masala dosa to specialty varieties.',
    url: 'https://youtube.com', // Change to your actual website URL
    siteName: 'Dosa Cafe',
    images: [
      {
        url: '/images/dosa-cafe-banner.jpg', // Place your banner image in public/images folder
        width: 1200,
        height: 630,
        alt: 'Dosa Cafe – Authentic South Indian Dosas'
      }
    ],
    locale: 'en_IN',
    type: 'website'
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Dosa Cafe – Authentic & Delicious South Indian Dosas in Pondicherry',
    description:
      'Visit Dosa Cafe in Pondicherry for authentic South Indian dosas – crispy, fluffy, and full of flavor.',
    images: ['/images/dosa-cafe-banner.jpg']
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
