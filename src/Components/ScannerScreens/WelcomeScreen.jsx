import scanQrIcon from '../../assets/scanQR.png'
import { Scan } from 'lucide-react';

export const WelcomeScreen = ({startScanning}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-white to-orange-50">
      <img className="w-40 m-5" src={scanQrIcon} alt="Escanea" />
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
        Escáner de Código QR
      </h3>
      <p className="text-gray-600 mb-8 max-w-xs">
        Coloca el código QR dentro del visor de la cámara para escanear
        automáticamente
      </p>
      <button
        onClick={startScanning}
        className="px-8 py-3 bg-[#EC9126] text-white font-semibold rounded-full hover:bg-[#d98421] focus:outline-none focus:ring-2 focus:ring-[#EC9126] focus:ring-offset-2 transform transition-transform hover:scale-101 shadow-lg flex items-center"
      >
        <Scan className="w-5 h-5 mr-2" />
        Iniciar Escáner
      </button>
    </div>
  );
};
