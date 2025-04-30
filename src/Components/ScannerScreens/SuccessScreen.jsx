import { PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SuccessScreen = ({ handleScanAgain }) => {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6 text-center bg-gradient-to-b from-green-50 to-white">
      <div className="w-20 h-20 xs:w-24 xs:h-24 rounded-full bg-green-100 flex items-center justify-center mb-4 xs:mb-5 sm:mb-6 animate-bounce-slow">
        <PartyPopper className="w-10 h-10 xs:w-12 xs:h-12 text-green-500" />
      </div>
      <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-green-800 mb-2">
        ¡Mascota vinculada con éxito!
      </h3>
      <div className="bg-white rounded-xl p-3 xs:p-4 shadow-md w-full max-w-[16rem] xs:max-w-[18rem] sm:max-w-xs mb-4 xs:mb-5 sm:mb-6 border border-green-200">
        <p className="text-sm xs:text-base sm:text-lg text-gray-700 mb-2">
          Tu mascota ha sido vinculada correctamente a tu cuenta.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full max-w-[16rem] xs:max-w-[18rem] sm:max-w-xs">
        <button
          onClick={handleScanAgain}
          className="px-4 py-2 xs:py-2.5 sm:py-3 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 shadow sm:flex-1 text-sm xs:text-base sm:text-lg"
        >
          Vincular Otra
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 xs:py-2.5 sm:py-3 bg-red-400 text-white font-semibold rounded-full hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-redbg-red-400 focus:ring-offset-2 shadow sm:flex-1 text-sm xs:text-base sm:text-lg"
        >
          Volver
        </button>
      </div>
    </div>
  );
};
