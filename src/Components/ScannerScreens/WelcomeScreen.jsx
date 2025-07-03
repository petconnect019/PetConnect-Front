import scanQrIcon from '../../assets/images/scanQR.png'
import { QrCode } from 'lucide-react';

export const WelcomeScreen = ({startScanning}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      {/* Icon Container */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-100/50">
          <QrCode className="w-12 h-12 text-orange-600" strokeWidth={1.5} />
        </div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-3xl blur-xl -z-10"></div>
      </div>
      
      {/* Title */}
      <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">
        Escáner QR
      </h3>
      
      {/* Description */}
      <p className="text-slate-600 mb-8 max-w-sm leading-relaxed">
        Apunta tu cámara hacia el código QR de la medalla para vincular automáticamente la mascota
      </p>
      
      {/* CTA Button */}
      <button
        onClick={startScanning}
        className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <div className="flex items-center space-x-3">
          <QrCode className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
          <span>Iniciar Escáner</span>
        </div>
        {/* Button glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
      </button>
    </div>
  );
};
