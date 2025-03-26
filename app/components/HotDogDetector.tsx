'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import NextImage from 'next/image';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

type DetectionState = 'idle' | 'loading' | 'hotdog' | 'nothotdog';

export default function HotDogDetector() {
  const [detectionState, setDetectionState] = useState<DetectionState>('idle');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [webcamReady, setWebcamReady] = useState(false);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load the model on component mount
  useEffect(() => {
    async function loadModel() {
      setIsModelLoading(true);
      try {
        // Load TensorFlow.js
        await tf.ready();
        // Load the MobileNet model
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
      } catch (error) {
        console.error('Failed to load model:', error);
      } finally {
        setIsModelLoading(false);
      }
    }
    
    loadModel();
    
    // Cleanup function
    return () => {
      // Model cleanup handled by TensorFlow.js
      setModel(null);
    };
  }, []);

  const detectHotDog = async (imageElement: HTMLImageElement) => {
    if (!model) {
      console.error("Model not loaded");
      return;
    }
    
    setDetectionState('loading');
    
    try {
      console.log("Starting classification...");
      // Classify the image
      const predictions = await model.classify(imageElement);
      console.log("Raw predictions:", predictions);
      
      // Check if any prediction contains hot dog or similar terms
      const isHotDog = predictions.some(p => {
        const className = p.className.toLowerCase();
        const isMatch = className.includes('hot dog') || 
                       className.includes('hotdog') ||
                       className.includes('frankfurter') ||
                       className.includes('wiener');
        
        if (isMatch) {
          console.log(`Matched "${p.className}" with confidence ${p.probability.toFixed(4)}`);
        }
        
        return isMatch;
      });
      
      console.log('Final result:', isHotDog ? 'HOT DOG' : 'NOT HOT DOG');
      setDetectionState(isHotDog ? 'hotdog' : 'nothotdog');
    } catch (error) {
      console.error("Detection error:", error);
      setDetectionState('nothotdog'); // Default to not hot dog on error
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string;
      setUploadedImage(imageDataUrl);
      
      // Create an image element for the model to analyze
      const img = new window.Image();
      img.onload = () => detectHotDog(img);
      img.src = imageDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const captureFromWebcam = useCallback(() => {
    console.log("Take Photo clicked, webcamRef:", webcamRef.current);
    
    if (!webcamRef.current) {
      console.error("Webcam ref is not available");
      return;
    }
    
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log("Captured image:", imageSrc ? "Image captured successfully" : "No image captured");
      
      if (imageSrc) {
        setUploadedImage(imageSrc);
        
        // Create an image element for the model to analyze
        const img = new window.Image();
        img.onload = () => {
          console.log("Image loaded for detection");
          detectHotDog(img);
        };
        img.onerror = (e) => {
          console.error("Error loading image:", e);
        };
        img.src = imageSrc;
      } else {
        console.error("Failed to capture image from webcam");
      }
    } catch (error) {
      console.error("Error capturing from webcam:", error);
    }
  }, [webcamRef]);

  const resetDetection = () => {
    setDetectionState('idle');
    setUploadedImage(null);
    setShowCamera(false);
    setWebcamReady(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      {/* App header */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold mb-2">SeeFood</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Hot Dog Detector</p>
      </div>

      {detectionState === 'idle' ? (
        <>
          {isModelLoading ? (
            <div className="text-center py-8">
              <p className="text-xl mb-4">Loading AI hot dog detection model...</p>
              <div className="animate-pulse flex space-x-2 justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              {showCamera ? (
                <div className="p-2 border-4 border-yellow-400 rounded-lg">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-64 h-64 md:w-80 md:h-80 object-cover"
                    videoConstraints={{
                      width: 720,
                      height: 720,
                      facingMode: "environment"
                    }}
                    mirrored={false}
                    onUserMedia={() => {
                      console.log("Webcam ready");
                      setWebcamReady(true);
                    }}
                    onUserMediaError={(err) => {
                      console.error("Webcam error:", err);
                      alert("Unable to access camera. Please check permissions or try another browser.");
                    }}
                  />
                  <div className="flex justify-between mt-4">
                    <button 
                      onClick={() => setShowCamera(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full"
                    >
                      Cancel
                    </button>
                    {webcamReady ? (
                      <button 
                        onClick={captureFromWebcam}
                        className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        Take Photo
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="px-4 py-2 bg-gray-400 text-white rounded-full cursor-not-allowed"
                      >
                        Loading Camera...
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <button 
                      onClick={() => setShowCamera(true)}
                      className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                    >
                      <span className="mr-2">📷</span>
                      Use Camera
                    </button>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        ref={fileInputRef}
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
                      >
                        <span className="mr-2">🖼️</span>
                        Upload Image
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center max-w-xs">
                    Take or upload a photo to determine if it's a hot dog or... not hot dog.
                  </p>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="w-full max-w-lg">
          {uploadedImage && (
            <div className="mb-6 p-2 border-4 border-yellow-400 rounded-lg">
              <img 
                src={uploadedImage} 
                alt="Uploaded image" 
                className="w-full h-64 md:h-80 object-contain mx-auto"
              />
            </div>
          )}
          
          {detectionState === 'loading' ? (
            <div className="text-center py-6">
              <p className="text-xl mb-3">Analyzing image...</p>
              <div className="animate-pulse flex space-x-2 justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          ) : detectionState === 'hotdog' ? (
            <div className="text-center py-6 flex flex-col items-center">
              <div className="w-32 h-32 mb-4">
                <NextImage
                  src="/hot-dog.svg"
                  alt="Hot Dog"
                  width={128}
                  height={128}
                  priority
                />
              </div>
              <h2 className="text-4xl font-bold text-green-500 mb-2">HOT DOG!</h2>
              <p className="text-xl mb-6">Congratulations, you found a hot dog!</p>
              <button 
                onClick={resetDetection}
                className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Detect Another
              </button>
            </div>
          ) : (
            <div className="text-center py-6 flex flex-col items-center">
              <div className="w-32 h-32 mb-4">
                <NextImage
                  src="/not-hot-dog.svg"
                  alt="Not Hot Dog"
                  width={128}
                  height={128}
                  priority
                />
              </div>
              <h2 className="text-4xl font-bold text-red-500 mb-2">NOT HOT DOG!</h2>
              <p className="text-xl mb-6">Sorry, this is not a hot dog.</p>
              <button 
                onClick={resetDetection}
                className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Silicon Valley Easter Egg */}
      <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>"What would you say if I told you there is an app on the market..."</p>
        <p className="italic">- Jian-Yang, Silicon Valley</p>
      </div>
    </div>
  );
} 