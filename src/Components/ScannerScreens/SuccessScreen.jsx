import { PartyPopper } from "lucide-react";

export const SuccessScreen = ({ handleScanAgain }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-green-50 to-white">
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-bounce-slow">
        <PartyPopper className="w-12 h-12 text-green-500" />
      </div>
      <h3 className="text-xl font-bold text-green-800 mb-2">
        ¡Mascota vinculada con éxito!
      </h3>
      <div className="bg-white rounded-xl p-4 shadow-md w-full max-w-xs mb-6 border border-green-200">
        <p className="text-gray-700 mb-2">
          Tu mascota ha sido vinculada correctamente a tu cuenta.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full max-w-xs">
        <button
          onClick={() => {
            // Navigate to pet profile or dashboard
            window.location.href = "/pet-profile";
          }}
          className="px-4 py-3 bg-[#EC9126] text-white font-semibold rounded-full hover:bg-[#d98421] focus:outline-none focus:ring-2 focus:ring-[#EC9126] focus:ring-offset-2 shadow-lg sm:flex-1"
        >
          Ver Mascota
        </button>
        <button
          onClick={handleScanAgain}
          className="px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 shadow sm:flex-1"
        >
          Vincular Otra
        </button>
      </div>
    </div>
  );
};