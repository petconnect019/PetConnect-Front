import React, { useState, useRef, useEffect } from 'react';
import { FaSyringe, FaFileMedicalAlt, FaPassport, FaPrescriptionBottleAlt, FaFlask, FaHospitalAlt, FaFileAlt } from 'react-icons/fa';

export const DocumentCard = ({ document: doc, onView, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'vaccine': return FaSyringe;
      case 'medical': return FaFileMedicalAlt;
      case 'certificate': return '🏆';
      case 'prescription': return FaPrescriptionBottleAlt;
      case 'passport': return FaPassport;
      case 'lab': return FaFlask;
      case 'surgery': return FaHospitalAlt;
      default: return FaFileAlt;
    }
  };

  const getDocumentColor = (type) => {
    switch (type) {
      case 'vaccine': return 'from-green-50 to-emerald-50 border-green-100';
      case 'medical': return 'from-blue-50 to-cyan-50 border-blue-100';
      case 'certificate': return 'from-yellow-50 to-amber-50 border-yellow-100';
      case 'prescription': return 'from-purple-50 to-violet-50 border-purple-100';
      case 'passport': return 'from-yellow-50 to-amber-50 border-yellow-100';
      default: return 'from-gray-50 to-slate-50 border-gray-100';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Vigente</span>;
      case 'expired':
        return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">Vencido</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">Pendiente</span>;
      case 'completed':
        return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">Completado</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-gradient-to-r ${getDocumentColor(doc.type)} border rounded-xl p-4 hover:bg-opacity-90 transition-colors duration-150 cursor-pointer group`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {/* Icon */}
          <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center transition-colors duration-150">
            {React.createElement(getDocumentIcon(doc.type), { className: 'text-lg' })}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate">
              {doc.title}
            </h4>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <span>📅</span>
                {formatDate(doc.date)}
              </p>
              
              {doc.veterinary && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span>👨‍⚕️</span>
                  {doc.veterinary}
                </p>
              )}
              
              {doc.nextDue && (
                <p className="text-xs text-orange-600 font-medium flex items-center gap-1">
                  <span>⏰</span>
                  Próximo: {formatDate(doc.nextDue)}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Status and Actions */}
        <div className="flex flex-col items-end gap-2">
          {getStatusBadge(doc.status)}
          
          <div className="flex gap-1">
            {doc.fileUrl ? (
              <button onClick={() => onView && onView(doc)} className="w-8 h-8 bg-white/60 hover:bg-white rounded-lg flex items-center justify-center transition-colors duration-150">
                <span className="text-sm">👁️</span>
              </button>
            ) : (
              <button className="w-8 h-8 bg-white/60 hover:bg-white rounded-lg flex items-center justify-center transition-colors duration-150">
                <span className="text-sm">📎</span>
              </button>
            )}
            
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(!menuOpen)} className="w-8 h-8 bg-white/60 hover:bg-white rounded-lg flex items-center justify-center transition-colors duration-150">
                <span className="text-sm">⋯</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete && onDelete(doc);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress bar for vaccines */}
      {doc.type === 'vaccine' && doc.nextDue && (
        <div className="mt-3 pt-3 border-t border-white/30">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Vigencia</span>
            <span className="text-xs text-gray-600">
              {Math.ceil((new Date(doc.nextDue) - new Date()) / (1000 * 60 * 60 * 24))} días
            </span>
          </div>
          <div className="w-full bg-white/40 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-500 h-1 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.max(10, Math.min(100, 
                  (1 - (new Date(doc.nextDue) - new Date()) / (365 * 24 * 60 * 60 * 1000)) * 100
                ))}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}; 