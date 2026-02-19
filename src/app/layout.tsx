import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NavigationProgress from "@/components/NavigationProgress";
import { organizationSchema, websiteSchema } from "@/lib/schema";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Edolv Media | Premium Video Editing Services',
    template: '%s | Edolv Media',
  },
  description: 'Transform your vision into stunning reality with Edolv Media. We offer premium video editing, motion graphics, color grading, and sound design services for creators and businesses worldwide.',
  keywords: ['video editing', 'motion graphics', 'color grading', 'video production', 'content creation', 'post-production'],
  authors: [{ name: 'Edolv Media' }],
  creator: 'Edolv Media',
  publisher: 'Edolv Media',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://edolv.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://edolv.com',
    siteName: 'Edolv Media',
    title: 'Edolv Media | Premium Video Editing Services',
    description: 'Transform your vision into stunning reality with Edolv Media. Premium video editing, motion graphics, and post-production services.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Edolv Media - Premium Video Editing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Edolv Media | Premium Video Editing Services',
    description: 'Transform your vision into stunning reality with Edolv Media.',
    images: ['/og-image.png'],
    creator: '@Edolvmedia',
  },
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
  verification: {
    google: 'add-your-google-search-console-verification-code-here',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <NavigationProgress />
        {children}
      </body>
    </html>
  );
}

