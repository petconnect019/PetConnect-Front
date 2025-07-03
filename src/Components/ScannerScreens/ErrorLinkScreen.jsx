import { Frown } from "lucide-react";

export const ErrorLinkScreen = ({error, handleScanAgain}) => {
  console.log("ErrorLinkScreen rendered with error:", error);
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6 text-center bg-blue-50">
      <div className="w-20 h-20 xs:w-24 xs:h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4 xs:mb-5 sm:mb-6">
        <Frown className="w-10 h-10 xs:w-12 xs:h-12 text-blue-500" />
      </div>
      <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-blue-800 mb-2">
        Error en la vinvulación de la mascota
      </h3>
      <p className="text-sm xs:text-base sm:text-lg text-blue-600 mb-6 xs:mb-7 sm:mb-8 max-w-[16rem] xs:max-w-[18rem] sm:max-w-xs">
        {error}
      </p>
      <button
        onClick={handleScanAgain}
        className="px-5 xs:px-6 py-2 xs:py-2.5 sm:py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg text-sm xs:text-base sm:text-lg"
      >
        Intentar de nuevo
      </button>
    </div>
  );
};
