import React, { useState, useEffect, useRef } from 'react';
import { Camera, XCircle, CheckCircle2 } from 'lucide-react';

export const Scanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Request camera permission and set up video stream
  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
        setScanning(true);
        
        // Clear any previous results when starting a new scan
        setScannedResult(null);
        
        // Start looking for QR codes
        checkVideoFrame();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasPermission(false);
    }
  };

  // Stop scanning and release camera
  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setScanning(false);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Simple mock QR code processing function
  // In a real implementation, you would use a library like jsQR
  const processQRCode = (canvas, ctx) => {
    // Mock detection - in a real app, process the image data and detect QR codes
    // For demo purposes, we'll simulate finding a QR code after 3 seconds
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("https://example.com/product/12345");
      }, 3000);
    });
  };

  // Check video frames for QR codes
  const checkVideoFrame = async () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Make sure video is ready
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      try {
        // Process the canvas data to find QR codes
        const result = await processQRCode(canvas, ctx);
        
        if (result) {
          // QR code found
          setScannedResult(result);
          stopScanning();
          return;
        }
      } catch (error) {
        console.error("QR processing error:", error);
      }
    }
    
    // If still scanning, continue checking frames
    if (scanning) {
      requestAnimationFrame(checkVideoFrame);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
        {!scanning && !scannedResult && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <Camera className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-800 mb-2">QR Code Scanner</p>
            <p className="text-sm text-gray-500 mb-6">Position the QR code within the camera view</p>
            <button
              onClick={startScanning}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start Scanner
            </button>
          </div>
        )}
        
        {hasPermission === false && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-red-50">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-lg font-medium text-red-800 mb-2">Camera Access Denied</p>
            <p className="text-sm text-red-600 mb-6">Permission to use camera is required for scanning QR codes</p>
            <button
              onClick={startScanning}
              className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        )}
        
        {scanning && (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2/3 h-2/3 border-2 border-white border-opacity-70 rounded-lg"></div>
            </div>
            <button
              onClick={stopScanning}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white text-gray-800 font-medium rounded-md shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          </>
        )}
        
        {scannedResult && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-green-50">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
            <p className="text-lg font-medium text-green-800 mb-2">QR Code Detected!</p>
            <p className="text-sm text-green-700 mb-2 font-mono overflow-hidden text-ellipsis max-w-full">
              {scannedResult}
            </p>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  // Handle the scanned result, e.g., navigate to the URL
                  alert(`Processing QR code: ${scannedResult}`);
                }}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Use Result
              </button>
              <button
                onClick={() => {
                  setScannedResult(null);
                  startScanning();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Scan Again
              </button>
            </div>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};