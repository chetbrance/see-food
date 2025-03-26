import type { Metadata } from 'next';

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  
  return {
    title: 'SeeFood Hot Dog Detector Results',
    description: 'Check out this food photo analyzed by SeeFood Hot Dog Detector!',
    openGraph: {
      title: 'SeeFood Hot Dog Detection Results',
      description: 'Check out this food photo analyzed by SeeFood Hot Dog Detector!',
      url: `https://hotdogdetector.com/share/${id}`,
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
}

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 