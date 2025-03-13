import { XCircle } from "lucide-react";

export const PermisionsDeniedScreens = ({startScanning}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-red-50">
      <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <XCircle className="w-12 h-12 text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-red-800 mb-2">
        Acceso a la cámara denegado
      </h3>
      <p className="text-red-600 mb-8 max-w-xs">
        Se requiere permiso para usar la cámara para escanear códigos QR
      </p>
      <button
        onClick={startScanning}
        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg"
      >
        Intentar de nuevo
      </button>
    </div>
  );
};
