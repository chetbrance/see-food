import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Map to store image data temporarily with unique IDs
// In production, you'd use a database or storage service
const temporaryStorage: {[key: string]: {imageData: string, isHotDog: boolean, timestamp: number}} = {};

// Clean up old entries (older than 1 hour)
const cleanupStorage = () => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  Object.keys(temporaryStorage).forEach(key => {
    if (now - temporaryStorage[key].timestamp > oneHour) {
      delete temporaryStorage[key];
    }
  });
};

export async function POST(request: NextRequest) {
  try {
    // Generate a unique ID for this share
    const id = crypto.randomBytes(16).toString('hex');
    
    // Get the request payload
    const body = await request.json();
    const { imageData, isHotDog } = body;
    
    if (!imageData) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }
    
    // Store the image data temporarily
    temporaryStorage[id] = {
      imageData,
      isHotDog: !!isHotDog,
      timestamp: Date.now()
    };
    
    // Clean up old entries
    cleanupStorage();
    
    // Return the share URL
    return NextResponse.json({ 
      id, 
      shareUrl: `${request.nextUrl.origin}/share/${id}` 
    });
  } catch (error) {
    console.error('Share error:', error);
    return NextResponse.json({ error: 'Failed to process share request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id || !temporaryStorage[id]) {
      return NextResponse.json({ error: 'Share not found or expired' }, { status: 404 });
    }
    
    // Return the image data
    return NextResponse.json(temporaryStorage[id]);
  } catch (error) {
    console.error('Get share error:', error);
    return NextResponse.json({ error: 'Failed to retrieve share' }, { status: 500 });
  }
} 