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
    title: 'SeeFood Hot Dog Detector',
    description: "The ultimate hot dog detection technology. Not hot dog? We'll let you know.",
    siteName: 'SeeFood',
    images: [
      {
        url: '/hotdogdetectorbanner.png',
        width: 1200,
        height: 630,
        alt: 'SeeFood Hot Dog Detector',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SeeFood Hot Dog Detector',
    description: "The ultimate hot dog detection technology. Not hot dog? We'll let you know.",
    images: ['/hotdogdetectorbanner.png'],
    creator: '@seefood',
    site: '@seefood',
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
        
      </body>
    </html>
  );
}
