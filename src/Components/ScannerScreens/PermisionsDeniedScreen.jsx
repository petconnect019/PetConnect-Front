import { XCircle } from "lucide-react";

export const PermisionsDeniedScreens = ({startScanning}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6 text-center bg-red-50">
      <div className="w-20 h-20 xs:w-24 xs:h-24 rounded-full bg-red-100 flex items-center justify-center mb-4 xs:mb-5 sm:mb-6">
        <XCircle className="w-10 h-10 xs:w-12 xs:h-12 text-red-500" />
      </div>
      <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-red-800 mb-2">
        Acceso a la cámara denegado
      </h3>
      <p className="text-sm xs:text-base sm:text-lg text-red-600 mb-6 xs:mb-7 sm:mb-8 max-w-[16rem] xs:max-w-[18rem] sm:max-w-xs">
        Se requiere permiso para usar la cámara para escanear códigos QR
      </p>
      <button
        onClick={startScanning}
        className="px-5 xs:px-6 py-2 xs:py-2.5 sm:py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg text-sm xs:text-base sm:text-lg"
      >
        Intentar de nuevo
      </button>
    </div>
  );
};
