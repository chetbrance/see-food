import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hot Dog Detector - SeeFood",
  description: "The ultimate hot dog detection technology. Not hot dog? We'll let you know.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/favicon.ico' },
    ],
  },
  openGraph: {
    type: 'website',
    url: 'https://hotdogdetector.com',
    title: '🌭 SeeFood Hot Dog Detector',
    description: "Is it a hot dog? 🌭 Find out with one tap! Not hot dog? We'll let you know.",
    siteName: 'SeeFood',
    images: [
      {
        url: '/hot-dog-share.svg',
        width: 1200,
        height: 628,
        alt: 'SeeFood Hot Dog Detector',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '🌭 SeeFood Hot Dog Detector',
    description: "Is it a hot dog? 🌭 Find out with one tap! Not hot dog? We'll let you know.",
    images: ['/hot-dog-share.svg'],
    creator: '@seefood',
    site: '@seefood',
  },
  other: {
    'theme-color': '#FF6B35',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Hot Dog Detector',
    'format-detection': 'telephone=no',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex flex-col`}
      >
        <div className="flex-grow">
          {children}
        </div>
        <footer className="text-center py-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            Made by <a href="https://www.brett.world/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900 dark:hover:text-white">Brett</a> | <a href="https://github.com/chetbrance/see-food" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900 dark:hover:text-white">Source Code</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
