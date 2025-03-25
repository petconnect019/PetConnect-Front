import { InfoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LinkedPetScreen = ({petId, handleScanAgain}) => {
    const navigate = useNavigate();

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-amber-50 to-white">
          <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-6">
            <InfoIcon className="w-12 h-12 text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-amber-800 mb-2">
            Mascota ya vinculada
          </h3>
          <div className="bg-white rounded-xl p-4 shadow-md w-full max-w-xs mb-6 border border-amber-200">
            <p className="text-gray-700 mb-2">
              Esta mascota ya está vinculada a una cuenta. Puedes visitar su perfil público o escanear otro código.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full max-w-xs">
            <button
              onClick={() => {
                // Navigate to public pet profile
                navigate(`/public-pet-profile/${petId}`);
              }}
              className="px-4 py-3 bg-[#EC9126] text-white font-semibold rounded-full hover:bg-[#d98421] focus:outline-none focus:ring-2 focus:ring-[#EC9126] focus:ring-offset-2 shadow-lg sm:flex-1"
            >
              Ver Perfil
            </button>
            <button
              onClick={handleScanAgain}
              className="px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 shadow sm:flex-1"
            >
              Escanear Otro
            </button>
          </div>
        </div>
      );
};
