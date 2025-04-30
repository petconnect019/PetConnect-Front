import { CameraOff } from 'lucide-react';

export const PermisionsDeniedScreens = ({startScanning}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 xs:p-4 sm:p-5 md:p-4 lg:p-5 xl:p-8 2xl:p-4 3xl:p-8 4xl:p-15 text-center bg-red-50">
      <CameraOff className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-22 xl:h-22 2xl:w-20 2xl:h-20 3xl:w-20 3xl:h-20 4xl:w-20 4xl:h-20 text-red-500 mb-2 xs:mb-3 sm:mb-4 md:mb-3 lg:mb-4 xl:mb-7 2xl:mb-5 3xl:mb-6 4xl:mb-6" />
      <h3 className="text-sm xs:text-base sm:text-lg md:text-base lg:text-lg xl:text-3xl 2xl:text-lg 3xl:text-lg 4xl:text-xl font-bold text-red-800 mb-1 xs:mb-2 sm:mb-3 md:mb-2 lg:mb-3 xl:mb-6 2xl:mb-4 3xl:mb-5 4xl:mb-5">
        Permiso de cámara denegado
      </h3>
      <p className="text-[0.65rem] xs:text-xs sm:text-sm md:text-xs lg:text-sm xl:text-xl 2xl:text-sm 3xl:text-sm 4xl:text-xs text-red-600 mb-4 xs:mb-5 sm:mb-6 md:mb-4 lg:mb-5 xl:mb-9 2xl:mb-6 3xl:mb-7 4xl:mb-7 max-w-[14rem] xs:max-w-[16rem] sm:max-w-[18rem] md:max-w-[16rem] lg:max-w-[18rem] xl:max-w-[24rem] 2xl:max-w-[18rem] 3xl:max-w-[18rem] 4xl:max-w-[16rem]">
        Necesitamos acceso a tu cámara para escanear el código QR. Por favor, permite el acceso a la cámara en la configuración de tu dispositivo.
      </p>
      <button
        onClick={startScanning}
        className="px-4 xs:px-5 sm:px-6 md:px-5 lg:px-6 xl:px-9 2xl:px-6 3xl:px-6 4xl:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-2 lg:py-2.5 xl:py-4 2xl:py-2 3xl:py-2 4xl:py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform transition-transform hover:scale-101 shadow-lg flex items-center text-[0.65rem] xs:text-xs sm:text-sm md:text-xs lg:text-sm xl:text-xl 2xl:text-sm 3xl:text-sm 4xl:text-sm"
      >
        Intentar de nuevo
      </button>
    </div>
  );
};
