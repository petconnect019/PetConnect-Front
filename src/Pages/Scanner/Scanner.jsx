import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import { XCircle, CheckCircle2, Scan, ArrowLeft } from 'lucide-react';
import scanQrIcon from '../../assets/scanQR.png'

export const Scanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [renderCheckVideoFrame, setRenderCheckVideoFrame] = useState(false);

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
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded, attempting to play");
          videoRef.current.play()
            .then(() => {
              console.log("Video playback started successfully");
              setHasPermission(true);
              setScanning(true);
              
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
          console.log("QR code found:", result);
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
    }, 800);
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

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4 relative">
      {/* Header */}
      <div className="w-full mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 p-4">
          <span className="text-[#EC9126]">Tag</span> Scanner
        </h2>
      </div>
      
      {/* Scanner Container with responsive aspect ratio */}
      <div className="relative w-full bg-white rounded-2xl overflow-hidden shadow-xl mb-6" style={{aspectRatio: "1/1", maxHeight: "80vh"}}>
        {/* Always render the video element, but hide it when not scanning */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${scanning ? 'block' : 'hidden'}`}
          autoPlay
          playsInline
          muted
        />
        
        {/* Welcome Screen */}
        {!scanning && !scannedResult && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-white to-orange-50">
            <img className='w-40 m-5' src={scanQrIcon} alt="Escanea" />
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Escáner de Código QR</h3>
            <p className="text-gray-600 mb-8 max-w-xs">Coloca el código QR dentro del visor de la cámara para escanear automáticamente</p>
            <button
              onClick={startScanning}
              className="px-8 py-3 bg-[#EC9126] text-white font-semibold rounded-full hover:bg-[#d98421] focus:outline-none focus:ring-2 focus:ring-[#EC9126] focus:ring-offset-2 transform transition-transform hover:scale-101 shadow-lg flex items-center"
            >
              <Scan className="w-5 h-5 mr-2" />
              Iniciar Escáner
            </button>
          </div>
        )}
        
        {/* Permission Denied Screen */}
        {hasPermission === false && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-red-50">
            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Acceso a la cámara denegado</h3>
            <p className="text-red-600 mb-8 max-w-xs">Se requiere permiso para usar la cámara para escanear códigos QR</p>
            <button
              onClick={startScanning}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg"
            >
              Intentar de nuevo
            </button>
          </div>
        )}
        
        {/* Scanning UI */}
        {scanning && (
          <div className="absolute inset-0">
            {/* Scan frame with corners */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-4/5 h-2/3 max-w-xs">
                {/* Scanner overlay */}
                <div className="absolute inset-0 border-2 border-[#EC9126] rounded-lg z-10">
                  {/* Top-left corner */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#EC9126] rounded-tl-lg" />
                  {/* Top-right corner */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#EC9126] rounded-tr-lg" />
                  {/* Bottom-left corner */}
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#EC9126] rounded-bl-lg" />
                  {/* Bottom-right corner */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#EC9126] rounded-br-lg" />
                </div>
                
                {/* Scan animation */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#EC9126] opacity-70 z-20 animate-scanline"></div>
              </div>

              {/* Cancel button */}
              <button
                onClick={stopScanning}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Cancelar</span>
              </button>
            </div>
            
            {/* Scanning status */}
            <div className="absolute top-6 left-0 right-0 flex justify-center">
              <div className="px-4 py-2 bg-black bg-opacity-70 rounded-full flex items-center">
                <div className="w-3 h-3 bg-[#EC9126] rounded-full animate-pulse mr-2"></div>
                <span className="text-white text-sm">Escaneando...</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Success Screen */}
        {scannedResult && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-green-50 to-white">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-bounce-slow">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">¡Código QR Detectado!</h3>
            <div className="bg-white rounded-xl p-4 shadow-md w-full max-w-xs mb-6 border border-green-200">
              <p className="text-gray-500 text-xs mb-1">Resultado:</p>
              <p className="text-sm font-mono overflow-hidden text-ellipsis break-all bg-gray-50 p-2 rounded">{scannedResult}</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full max-w-xs">
              <button
                onClick={() => {
                  // Handle the scanned result, e.g., navigate to the URL
                  alert(`Procesando código QR: ${scannedResult}`);
                }}
                className="px-4 py-3 bg-[#EC9126] text-white font-semibold rounded-full hover:bg-[#d98421] focus:outline-none focus:ring-2 focus:ring-[#EC9126] focus:ring-offset-2 shadow-lg sm:flex-1"
              >
                Usar Resultado
              </button>
              <button
                onClick={handleScanAgain}
                className="px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 shadow sm:flex-1"
              >
                Escanear Nuevo
              </button>
            </div>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {/* Instructions or tip */}
      {!scanning && !scannedResult && (
        <div className="text-center text-sm text-gray-500 max-w-xs">
          <p>Asegúrate de que el código QR esté bien iluminado y encuadrado para mejores resultados.</p>
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