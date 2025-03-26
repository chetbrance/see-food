import type { Metadata } from 'next';

// Static metadata that will work for all share pages
export const metadata: Metadata = {
  title: 'SeeFood Hot Dog Detector Results',
  description: 'Check out this food photo analyzed by SeeFood Hot Dog Detector!',
  openGraph: {
    title: 'SeeFood Hot Dog Detection Results',
    description: 'Check out this food photo analyzed by SeeFood Hot Dog Detector!',
    siteName: 'SeeFood',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SeeFood Hot Dog Detection Results',
    description: 'Check out this food photo analyzed by SeeFood Hot Dog Detector!',
    creator: '@seefood',
    site: '@seefood',
  }
};

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
} 