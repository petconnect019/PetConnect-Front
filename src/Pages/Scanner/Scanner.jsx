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
  const { pet_id } = useParams();
  
  // Estados del scanner
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [qrId, setQrId] = useState(null);
  
  // Referencias
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanningRef = useRef(false);
  const animationRef = useRef(null);

  // Hook para vincular mascota
  const { linkPet, data, pet, hasPet, isLoading, error } = useFetchLinkPet(qrId, pet_id);

  // Debug logs (solo para errores críticos)
  if (error) {
    console.error('Error en Scanner:', error);
  }

  // Función para procesar el QR
  const processQRCode = useCallback((canvas, ctx) => {
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
      return qrCode ? qrCode.data : null;
    } catch (error) {
      console.error('Error procesando QR:', error);
      return null;
    }
  }, []);

  // Función para detener el escaneo
  const stopScanning = useCallback(() => {
    scanningRef.current = false;
    setScanning(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Función para verificar frames del video
  const checkVideoFrame = useCallback(() => {
    if (!scanningRef.current || !videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const result = processQRCode(canvas, ctx);
      
      if (result) {
        setScannedResult(result);
        const extractedQrId = getQrId(result);
        setQrId(extractedQrId);
        stopScanning();
        return;
      }
    }

    // Continuar escaneando si no se encontró QR
    if (scanningRef.current) {
      animationRef.current = requestAnimationFrame(checkVideoFrame);
    }
  }, [processQRCode, stopScanning]);

  // Función para iniciar el escaneo
  const startScanning = useCallback(async () => {
    // Limpiar estado anterior
    setScannedResult(null);
    setQrId(null);
    setHasPermission(null);
    
    // Detener stream anterior si existe
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      scanningRef.current = true;
      setScanning(true);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(() => {
              checkVideoFrame();
            })
            .catch(error => {
              console.error('Error reproduciendo video:', error);
              setHasPermission(false);
            });
        };
      }
    } catch (error) {
      console.error('Error accediendo a cámara:', error);
      setHasPermission(false);
      scanningRef.current = false;
      setScanning(false);
    }
  }, [checkVideoFrame]);

  // Función para escanear otra vez
  const handleScanAgain = useCallback(() => {
    setScannedResult(null);
    setQrId(null);
    stopScanning();
    setTimeout(() => {
      startScanning();
    }, 100);
  }, [stopScanning, startScanning]);

  // Effect para vincular mascota cuando se detecta QR
  useEffect(() => {
    if (qrId && pet_id && !isLoading && !data && !error) {
      linkPet();
    }
  }, [qrId, pet_id, linkPet, isLoading, data, error]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  // Determinar qué pantalla mostrar
  const renderScreen = () => {
    // Pantalla de bienvenida
    if (!scanning && !scannedResult && !data && !error) {
      return <WelcomeScreen startScanning={startScanning} />;
    }
    
    // Pantalla de permisos denegados
    if (hasPermission === false) {
      return <PermisionsDeniedScreens startScanning={startScanning} />;
    }
    
    // Pantalla de escaneo
    if (scanning) {
      return <ScanningScreen stopScanning={stopScanning} />;
    }
    
    // Pantalla de éxito (mascota vinculada por primera vez)
    if (hasPet === 'first') {
      return <SuccessScreen handleScanAgain={handleScanAgain} />;
    }
    
    // Pantalla de mascota ya vinculada
    if (hasPet === 'linked' && pet) {
      return <LinkedPetScreen handleScanAgain={handleScanAgain} petId={pet._id} />;
    }
    
    // Pantalla de error
    if (error) {
      return <ErrorLinkScreen error={error} handleScanAgain={handleScanAgain} />;
    }
    
    // Pantalla de carga
    if (isLoading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EC9126] mx-auto mb-4"></div>
            <p className="text-gray-600">Procesando...</p>
          </div>
        </div>
      );
    }
    
    // Default
    return <WelcomeScreen startScanning={startScanning} />;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4 relative">
      {/* Header */}
      <div className="w-full mb-6 text-center">
        <NavButton onClick={() => navigate(-1)} />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 p-4">
          <span className="text-[#EC9126]">Escaner</span> medalla QR
        </h2>
      </div>
      
      {/* Scanner Container */}
      <div className="relative w-full bg-white rounded-2xl overflow-hidden shadow-xl mb-6" style={{aspectRatio: "1/1"}}>
        {/* Video siempre presente pero oculto cuando no escanea */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${scanning ? 'block' : 'hidden'}`}
          autoPlay
          playsInline
          muted
        />
        
        {/* Canvas oculto para procesamiento */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Pantallas del scanner */}
        {renderScreen()}
      </div>
      
      {/* Instrucciones */}
      {!scanning && !scannedResult && (
        <div className="text-center text-sm text-gray-500">
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