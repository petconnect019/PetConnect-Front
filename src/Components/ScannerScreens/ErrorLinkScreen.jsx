import { Frown } from "lucide-react";

export const ErrorLinkScreen = ({error, handleScanAgain}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-blue-50">
      <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6">
        <Frown className="w-12 h-12 text-blue-500" />
      </div>
      <h3 className="text-xl font-bold text-blue-800 mb-2">
        Error en la vinvulación de la mascota
      </h3>
      <p className="text-blue-600 mb-8 max-w-xs">
        {error}
      </p>
      <button
        onClick={handleScanAgain}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg"
      >
        Intentar de nuevo
      </button>
    </div>
  );
};
