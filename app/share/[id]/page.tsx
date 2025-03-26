'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function SharePage() {
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareData, setShareData] = useState<{
    imageData: string;
    isHotDog: boolean;
  } | null>(null);
  
  useEffect(() => {
    async function fetchShareData() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/share?id=${id}`);
        
        if (!response.ok) {
          throw new Error('Share not found or expired');
        }
        
        const data = await response.json();
        setShareData(data);
      } catch (error) {
        console.error('Error fetching share:', error);
        setError('Could not load this shared content. It may have expired.');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (id) {
      fetchShareData();
    }
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="text-center">
          <div className="animate-pulse flex space-x-2 justify-center mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-xl">Loading share...</p>
        </div>
      </div>
    );
  }
  
  if (error || !shareData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-md p-8 bg-white rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">SeeFood Share Not Found</h1>
          <p className="mb-6">{error || 'This share has expired or was not found.'}</p>
          <Link href="/" className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors inline-block">
            Try SeeFood Detector
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-6 pb-20 sm:p-12 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 mb-4 relative overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/seefood.png"
              alt="SeeFood Logo"
              width={96}
              height={96}
              priority
              className="rounded-2xl" 
            />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-red-600">SeeFood</h1>
          <p className="text-lg text-gray-600 font-medium">Hot Dog Detector</p>
        </div>
        
        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-4 border-4 border-yellow-400 rounded-lg m-4">
            <img 
              src={shareData.imageData} 
              alt={shareData.isHotDog ? "Hot Dog" : "Not Hot Dog"} 
              className="w-full h-64 md:h-80 object-contain mx-auto"
            />
          </div>
          
          {shareData.isHotDog ? (
            <div className="text-center p-6 bg-green-50">
              <div className="w-24 h-24 mx-auto mb-4">
                <Image
                  src="/hot-dog.svg"
                  alt="Hot Dog"
                  width={96}
                  height={96}
                  priority
                />
              </div>
              <h2 className="text-4xl font-bold text-green-500 mb-2">HOT DOG!</h2>
              <p className="text-xl mb-6">This is definitely a hot dog!</p>
            </div>
          ) : (
            <div className="text-center p-6 bg-red-50">
              <div className="w-24 h-24 mx-auto mb-4">
                <Image
                  src="/not-hot-dog.svg"
                  alt="Not Hot Dog"
                  width={96}
                  height={96}
                  priority
                />
              </div>
              <h2 className="text-4xl font-bold text-red-500 mb-2">NOT HOT DOG!</h2>
              <p className="text-xl mb-6">This is definitely not a hot dog.</p>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <Link href="/" className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors inline-block">
            Try It Yourself
          </Link>
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>"What would you say if I told you there is an app on the market..."</p>
          <p className="italic">- Jian-Yang, Silicon Valley</p>
        </div>
      </div>
    </div>
  );
} 