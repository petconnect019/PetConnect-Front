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
  );
};
