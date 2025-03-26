'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with SSR disabled for the HotDogDetector component
// because it uses browser APIs (webcam, file reader)
const HotDogDetector = dynamic(
  () => import('./components/HotDogDetector'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="grid min-h-screen p-6 pb-20 sm:p-12">
      <main className="flex flex-col items-center">
        <HotDogDetector />
      </main>
    </div>
  );
}
