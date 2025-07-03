import { CheckCircle, QrCode, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SuccessScreen = ({ handleScanAgain }) => {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
      {/* Success Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-100/50">
          <CheckCircle className="w-12 h-12 text-emerald-600" strokeWidth={1.5} />
        </div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-3xl blur-xl -z-10"></div>
      </div>
      
      {/* Title */}
      <h3 className="text-2xl font-bold text-emerald-800 mb-3 tracking-tight">
        ¡Mascota vinculada!
      </h3>
      
      {/* Description */}
      <p className="text-emerald-700/80 mb-8 max-w-sm leading-relaxed">
        La mascota ha sido vinculada exitosamente a tu cuenta. Ya puedes gestionar su información.
      </p>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={handleScanAgain}
          className="group relative flex-1 px-6 py-3 bg-white border-2 border-emerald-200 text-emerald-700 font-semibold rounded-xl shadow-sm hover:shadow-md hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <div className="flex items-center justify-center space-x-2">
            <QrCode className="w-4 h-4" />
            <span>Vincular otra</span>
          </div>
        </button>
        
        <button
          onClick={() => navigate(-1)}
          className="group relative flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <div className="flex items-center justify-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </div>
          {/* Button glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
        </button>
      </div>
    </div>
  );
};
