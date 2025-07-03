import { AlertTriangle, RefreshCw } from "lucide-react";

export const ErrorLinkScreen = ({error, handleScanAgain}) => {
  console.log("ErrorLinkScreen rendered with error:", error);
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-red-50 via-white to-red-50/30">
      {/* Error Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl flex items-center justify-center shadow-lg shadow-red-100/50">
          <AlertTriangle className="w-12 h-12 text-red-600" strokeWidth={1.5} />
        </div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-3xl blur-xl -z-10"></div>
      </div>
      
      {/* Title */}
      <h3 className="text-2xl font-bold text-red-800 mb-3 tracking-tight">
        Error al vincular mascota
      </h3>
      
      {/* Error Message */}
      <div className="bg-white/70 backdrop-blur-sm border border-red-200 rounded-2xl p-6 mb-8 max-w-sm">
        <p className="text-red-700/80 leading-relaxed">
          {error}
        </p>
      </div>
      
      {/* Action Button */}
      <button
        onClick={handleScanAgain}
        className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
          <span>Intentar de nuevo</span>
        </div>
        {/* Button glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
      </button>
    </div>
  );
};
