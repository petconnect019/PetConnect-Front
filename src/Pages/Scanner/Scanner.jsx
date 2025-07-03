import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import { getQrId } from '../../Utils/Helpers/GetQrId/GetQrId';
//importing screens
import { WelcomeScreen } from '../../Components/ScannerScreens/WelcomeScreen';
import { PermisionsDeniedScreens } from '../../Components/ScannerScreens/PermisionsDeniedScreen';
import { ScanningScreen } from '../../Components/ScannerScreens/ScanningScreen';
import { SuccessScreen } from '../../Components/ScannerScreens/SuccessScreen';
import { LinkedPetScreen } from '../../Components/ScannerScreens/LinkedPetScreen';
import { useFetchLinkPet } from '../../Hooks/useFetchLinkPet/useFetchLinkPet';
import { ErrorLinkScreen } from '../../Components/ScannerScreens/ErrorLinkScreen';
import { NavButton } from '../../Components/NavButton/NavButton';

export const Scanner = () => {
  const navigate = useNavigate();
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [renderCheckVideoFrame, setRenderCheckVideoFrame] = useState(false);
  const {pet_id} = useParams();
  const {linkPet, data, pet, hasPet, isLoading, error} = useFetchLinkPet(scannedResult ? getQrId(scannedResult) : null, pet_id);

  // Process QR code function defined early with useCallback
  const processQRCode = useCallback((canvas, ctx) => {
    return new Promise((resolve, reject) => {
      try {
        //obtenemos los datos de la imagen de canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        //intentamos detectar un codigo qr
        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

        //si hay un codigo qr, devolverl el contenido
        if (qrCode) {
          resolve(qrCode.data);
        } else {
          resolve(null);
        }
        
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  // Stop scanning defined early with useCallback
  const stopScanning = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
    setRenderCheckVideoFrame(false);
    setCameraReady(false);
  }, []);

  // Request camera permission and set up video stream
  const startScanning = useCallback(async () => {
    // Ensure previous stream is fully stopped
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Reset video element
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
    
    setScanning(true);
    setCameraReady(false);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded, attempting to play");
          videoRef.current.setAttribute('playsinline', '');
          videoRef.current.play()
            .then(() => {
              console.log("Video playback started successfully");
              setHasPermission(true);
              setCameraReady(true);
              
              // Clear any previous results when starting a new scan
              setScannedResult(null);
              
              // Start looking for QR codes
              setRenderCheckVideoFrame(true);
            })
            .catch(error => {
              console.error("Error playing video:", error);
              setHasPermission(false);
            });
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasPermission(false);
    }
  }, []);

  // Check video frames for QR codes - defined with useCallback before any useEffect that references it
  const checkVideoFrame = useCallback(async () => {
    if (!scanning || !videoRef.current || !canvasRef.current) {
      console.log("Skipping frame check - conditions not met", { scanning });
      return;
    }
    
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
    
    // If still scanning, continue checking frames with a delay
    if (scanning) {
      setTimeout(() => {
        requestAnimationFrame(checkVideoFrame);
      }, 500);
    } else {
      console.log("Scanning stopped, not scheduling next frame");
    }
  }, [scanning, processQRCode, stopScanning]);

  // For the Scan Again button
  const handleScanAgain = useCallback(() => {
    console.log("Scan again requested");
    setScannedResult(null);
    stopScanning();
    console.log("Scanning stopped, scheduling restart");
    setTimeout(() => {
      console.log("Starting scan again");
      startScanning();
    }, 100);
  }, [stopScanning, startScanning]);

  // useEffect to check video frames when renderCheckVideoFrame state changes
  useEffect(() => {
    if (renderCheckVideoFrame && scanning) {
      console.log("Starting to check video frames");
      checkVideoFrame();
    }
  }, [renderCheckVideoFrame, scanning, checkVideoFrame]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  //access to the scanned result
  useEffect(()=> {
    if (scannedResult) {
      linkPet();
    }
    
  }, [scannedResult])
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/20 flex flex-col">
      {/* Header */}
      <div className="relative px-6 py-8 text-center">
        <NavButton onClick={() => navigate(-1)} />
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Escáner <span className="text-orange-600">QR</span>
          </h1>
          <p className="text-slate-600 mt-2">Vincula mascotas escaneando su medalla</p>
        </div>
      </div>
      
      {/* Scanner Container */}
      <div className="flex-1 flex items-center justify-center px-6 pb-8">
        {scanning ? (
          <div className="relative w-full max-w-md aspect-square bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-white/20">
            {/* Video Element */}
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover ${cameraReady ? 'block' : 'hidden'}`}
              autoPlay
              playsInline
              muted
            />
            {/* Scanning Screen */}
            <ScanningScreen stopScanning={stopScanning} />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        ) : (
          <div className="relative w-full max-w-md">
            {/* Welcome Screen */}
            {!scannedResult && !data && !hasPet && (
              <WelcomeScreen startScanning={startScanning} />
            )}

            {/* Permission Denied Screen */}
            {hasPermission === false && (
              <PermisionsDeniedScreens startScanning={startScanning} />
            )}

            {/* Successfully pet created screen */}
            {hasPet === 'first' && !scanning && (
              <SuccessScreen handleScanAgain={handleScanAgain} />
            )}

            {/* Pet already linked Screen */}
            {hasPet === 'linked' && !scanning && (
              <LinkedPetScreen handleScanAgain={handleScanAgain} petId={pet?._id} />
            )}

            {/* Error scanning qr*/}
            {error && !scanning && (
              <ErrorLinkScreen error={error} handleScanAgain={handleScanAgain} />
            )}
          </div>
        )}
      </div>
      
      {/* Bottom hint */}
      {!scanning && !scannedResult && (
        <div className="px-6 pb-6 text-center">
          <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
            Asegúrate de que el código QR esté bien iluminado y centrado para obtener mejores resultados
          </p>
        </div>
      )}
    </div>
  );
};

// Add custom animation
const styles = document.createElement('style');
styles.innerHTML = `
  @keyframes scanline {
    0% {
      transform: translateY(0%);
    }
    50% {
      transform: translateY(1000%);
    }
    100% {
      transform: translateY(0%);
    }
  }
  
  .animate-scanline {
    animation: scanline 2s ease-in-out infinite;
  }
  
  .animate-bounce-slow {
    animation: bounce 2s infinite;
  }
`;
document.head.appendChild(styles);