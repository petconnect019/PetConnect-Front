import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import { NavButton } from '../../Components/NavButton/NavButton';
import { WelcomeScreen } from '../../Components/ScannerScreens/WelcomeScreen';
import { PermisionsDeniedScreens } from '../../Components/ScannerScreens/PermisionsDeniedScreen';
import { ScanningScreen } from '../../Components/ScannerScreens/ScanningScreen';
import { SuccessScreen } from '../../Components/ScannerScreens/SuccessScreen';
import { ErrorLinkScreen } from '../../Components/ScannerScreens/ErrorLinkScreen';

export const ScanQR = () => {
  const navigate = useNavigate();
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [renderCheckVideoFrame, setRenderCheckVideoFrame] = useState(false);
  const [error, setError] = useState(null);

  // Process QR code function defined early with useCallback
  const processQRCode = useCallback((canvas, ctx) => {
    return new Promise((resolve, reject) => {
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
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
  }, []);

  // Request camera permission and set up video stream
  const startScanning = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
    
    setScanning(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(() => {
              setHasPermission(true);
              setScanning(true);
              setScannedResult(null);
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

  // Check video frames for QR codes
  const checkVideoFrame = useCallback(async () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      try {
        const result = await processQRCode(canvas, ctx);
        if (result) {
          setScannedResult(result);
          stopScanning();
          // Extraer el ID del QR de la URL completa
          const qrId = result.split('/').pop();
          console.log('QR Code detectado:', qrId);
          // Navegamos a la ruta de la API para escanear el QR
          navigate(`/public-pet-profile/${qrId}`);
          return;
        }
      } catch (error) {
        console.error("QR processing error:", error);
        setError("Error al procesar el código QR");
      }
    }
    
    if (scanning) {
      setTimeout(() => {
        requestAnimationFrame(checkVideoFrame);
      }, 500);
    }
  }, [scanning, processQRCode, stopScanning, navigate]);

  // useEffect to check video frames when renderCheckVideoFrame state changes
  useEffect(() => {
    if (renderCheckVideoFrame && scanning) {
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

  // For the Scan Again button
  const handleScanAgain = useCallback(() => {
    setScannedResult(null);
    setError(null);
    stopScanning();
    setTimeout(() => {
      startScanning();
    }, 100);
  }, [stopScanning, startScanning]);

  return (
    <div className="grid grid-cols-1 gap-4 w-full max-w-lg mx-auto p-4">
      {/* Header */}
      <div className="w-full text-center">
        <NavButton onClick={() => navigate(-1)} />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 p-4">
          <span className="text-[#EC9126]">Escanear</span> código QR
        </h2>
      </div>
      
      {/* Scanner Container */}
      <div className="relative w-full bg-white rounded-2xl overflow-hidden shadow-xl scanner-video-container" style={{aspectRatio: "1/1"}}>
        {/* Always render the video element, but hide it when not scanning */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${scanning ? 'block' : 'hidden'}`}
          autoPlay
          playsInline
          muted
        />
        
        {/* Welcome Screen */}
        {!scanning && !scannedResult && !error && (
          <WelcomeScreen startScanning={startScanning}/>
        )}
        
        {/* Permission Denied Screen */}
        {hasPermission === false && (
          <PermisionsDeniedScreens startScanning={startScanning} />
        )}
        
        {/* Scanning Screen */}
        {scanning && (
          <ScanningScreen stopScanning={stopScanning}/>
        )}
        
        {/* Error Screen */}
        {error && !scanning && (
          <ErrorLinkScreen error={error} handleScanAgain={handleScanAgain} />
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {/* Instructions or tip */}
      {!scanning && !scannedResult && !error && (
        <div className="text-center text-[0.65rem] xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-lg 3xl:text-base 4xl:text-base text-gray-500 scanner-instructions">
          <p>Asegúrate de que el código QR esté bien iluminado y encuadrado para mejores resultados.</p>
        </div>
      )}
    </div>
  );
}; 