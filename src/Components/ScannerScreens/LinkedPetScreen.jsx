import { AlertCircle, Eye, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LinkedPetScreen = ({petId, handleScanAgain}) => {
    const navigate = useNavigate();

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-amber-50 via-white to-amber-50/30">
          {/* Info Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-3xl flex items-center justify-center shadow-lg shadow-amber-100/50">
              <AlertCircle className="w-12 h-12 text-amber-600" strokeWidth={1.5} />
            </div>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-3xl blur-xl -z-10"></div>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-amber-800 mb-3 tracking-tight">
            Mascota ya vinculada
          </h3>
          
          {/* Description */}
          <p className="text-amber-700/80 mb-8 max-w-sm leading-relaxed">
            Esta mascota ya pertenece a otro usuario. Puedes ver su perfil público o escanear otra medalla.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
            <button
              onClick={() => {
                navigate(`/public-pet-profile/${petId}`);
              }}
              className="group relative flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <div className="flex items-center justify-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Ver perfil</span>
              </div>
              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            </button>
            
            <button
              onClick={handleScanAgain}
              className="group relative flex-1 px-6 py-3 bg-white border-2 border-amber-200 text-amber-700 font-semibold rounded-xl shadow-sm hover:shadow-md hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <div className="flex items-center justify-center space-x-2">
                <QrCode className="w-4 h-4" />
                <span>Escanear otro</span>
              </div>
            </button>
          </div>
        </div>
    );
};
