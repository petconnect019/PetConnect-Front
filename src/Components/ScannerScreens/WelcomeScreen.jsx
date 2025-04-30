import scanQrIcon from '../../assets/images/scanQR.png'
import { Scan } from 'lucide-react';

export const WelcomeScreen = ({startScanning}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 xs:p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 3xl:p-10 4xl:p-0 text-center bg-gradient-to-b from-white to-orange-50">
      <img 
        className="w-28 xs:w-32 sm:w-36 md:w-40 lg:w-44 xl:w-48 2xl:w-52 3xl:w-56 4xl:w-40 m-2 xs:m-3 sm:m-4 md:m-5 lg:m-6 xl:m-7 2xl:m-8 3xl:m-9" 
        src={scanQrIcon} 
        alt="Escanea" 
      />
      <h3 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-2xl 3xl:text-3xl 4xl:text-3xl font-bold text-gray-800 mb-1 xs:mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7 3xl:mb-8 4xl:mb-9">
        Escáner de Código QR
      </h3>
      <p className="text-[0.65rem] xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-lg 3xl:text-lg 4xl:text-xl text-gray-600 mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 3xl:mb-11 4xl:mb-12 max-w-[14rem] xs:max-w-[16rem] sm:max-w-[18rem] md:max-w-[20rem] lg:max-w-[22rem] xl:max-w-[24rem] 2xl:max-w-[26rem] 3xl:max-w-[28rem] 4xl:max-w-[30rem]">
        Coloca el código QR dentro del visor de la cámara para escanear
        automáticamente
      </p>
      <button
        onClick={startScanning}
        className="px-4 xs:px-5 sm:px-6 md:px-7 lg:px-8 xl:px-9 2xl:px-10 3xl:px-8 4xl:px-8 py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-3.5 xl:py-4 2xl:py-4.5 3xl:py-3 4xl:py-3 bg-[#EC9126] text-white font-semibold rounded-full hover:bg-[#d98421] focus:outline-none focus:ring-2 focus:ring-[#EC9126] focus:ring-offset-2 transform transition-transform hover:scale-101 shadow-lg flex items-center text-[0.65rem] xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-lg 3xl:text-base 4xl:text-base"
      >
        <Scan className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 3xl:w-6 3xl:h-6 4xl:w-6 4xl:h-6 mr-1 xs:mr-2 sm:mr-3 md:mr-4 lg:mr-5 xl:mr-6 2xl:mr-7 3xl:mr-3 4xl:mr-3" />
        Iniciar Escáner
      </button>
    </div>
  );
};
