import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';
export const alt = 'SeeFood Hot Dog Detector';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({ params }: { params: { id: string } }) {
  const id = params.id;
  
  // Try to fetch the share data
  // Note: In production, you'd use a reliable persistent storage method
  try {
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/share?id=${id}`);
    if (!response.ok) {
      // Return default image if share not found
      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: '#FFEDD5',
              padding: 40,
            }}
          >
            <h1 style={{ fontSize: 64, fontWeight: 'bold', color: '#D97706', marginBottom: 20 }}>
              SeeFood Hot Dog Detector
            </h1>
            <p style={{ fontSize: 32, color: '#4B5563' }}>Share not found or expired</p>
          </div>
        ),
        { ...size }
      );
    }
    
    const data = await response.json();
    const { isHotDog, imageData } = data;
    
    // Strip data URL prefix
    const imageBase64 = imageData.split(',')[1];
    
    // Generate dynamic OG image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: isHotDog ? '#ECFDF5' : '#FEF2F2',
            padding: 40,
            position: 'relative',
          }}
        >
          <h1 style={{ fontSize: 64, fontWeight: 'bold', color: isHotDog ? '#059669' : '#DC2626', marginBottom: 20 }}>
            {isHotDog ? 'HOT DOG!' : 'NOT HOT DOG!'}
          </h1>
          
          <div
            style={{
              display: 'flex',
              width: '80%',
              height: 400,
              position: 'relative',
              margin: 'auto',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              border: '8px solid #FBBF24',
              borderRadius: 16,
              backgroundColor: 'white',
              padding: 10,
            }}
          >
            {/* User's image*/}
            <img
              src={`data:image/jpeg;base64,${imageBase64}`}
              alt={isHotDog ? 'Hot Dog' : 'Not Hot Dog'}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
          
          <p style={{ fontSize: 32, marginTop: 20, color: '#4B5563' }}>
            hotdogdetector.com
          </p>
        </div>
      ),
      { ...size }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    // Return default image on error
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#FFEDD5',
            padding: 40,
          }}
        >
          <h1 style={{ fontSize: 64, fontWeight: 'bold', color: '#D97706', marginBottom: 20 }}>
            SeeFood Hot Dog Detector
          </h1>
          <p style={{ fontSize: 32, color: '#4B5563' }}>Share your food detection results!</p>
        </div>
      ),
      { ...size }
    );
  }
} 