import { X, Scan } from "lucide-react";

export const ScanningScreen = ({stopScanning}) => {
  return (
    <div className="absolute inset-0 bg-black/10">
      {/* Scanner Frame */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="relative w-64 h-64 max-w-[80vw] max-h-[80vw]">
          {/* Main scanner border */}
          <div className="absolute inset-0 border-2 border-white/30 rounded-3xl"></div>
          
          {/* Corner indicators */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-2xl"></div>
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-2xl"></div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-2xl"></div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-2xl"></div>
          
          {/* Scanning line animation */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-80 animate-scanline rounded-full"></div>
          
          {/* Center crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/50 rounded-full">
              <div className="w-2 h-2 bg-orange-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="absolute top-8 left-0 right-0 flex justify-center">
        <div className="flex items-center space-x-3 px-6 py-3 bg-black/70 backdrop-blur-md rounded-full">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span className="text-white font-medium">Escaneando código QR...</span>
        </div>
      </div>

      {/* Cancel button */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <button
          onClick={stopScanning}
          className="group flex items-center space-x-3 px-6 py-3 bg-white/90 backdrop-blur-md text-slate-700 font-semibold rounded-full shadow-lg hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/20 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  );
};
