import { ArrowLeft } from "lucide-react";

export const ScanningScreen = ({stopScanning}) => {
  return (
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
          className="absolute bottom-2 xs:bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-6 left-1/2 transform -translate-x-1/2 px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
          <span className="text-xs xs:text-sm sm:text-base">Cancelar</span>
        </button>
      </div>

      {/* Scanning status */}
      <div className="absolute top-2 xs:top-3 sm:top-4 md:top-5 lg:top-6 left-0 right-0 flex justify-center">
        <div className="px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 bg-black bg-opacity-70 rounded-full flex items-center">
          <div className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 bg-[#EC9126] rounded-full animate-pulse mr-2"></div>
          <span className="text-xs xs:text-sm sm:text-base text-white">Escaneando...</span>
        </div>
      </div>
    </div>
  );
};
