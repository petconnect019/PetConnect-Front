import React from 'react';

export const DocumentCard = ({ document }) => {
  const getDocumentIcon = (type) => {
    switch (type) {
      case 'vaccine': return '💉';
      case 'medical': return '📋';
      case 'certificate': return '🏆';
      case 'prescription': return '💊';
      default: return '📄';
    }
  };

  const getDocumentColor = (type) => {
    switch (type) {
      case 'vaccine': return 'from-green-50 to-emerald-50 border-green-100';
      case 'medical': return 'from-blue-50 to-cyan-50 border-blue-100';
      case 'certificate': return 'from-yellow-50 to-amber-50 border-yellow-100';
      case 'prescription': return 'from-purple-50 to-violet-50 border-purple-100';
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
    <div className={`bg-gradient-to-r ${getDocumentColor(document.type)} border rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer group`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {/* Icon */}
          <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-lg">{getDocumentIcon(document.type)}</span>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate">
              {document.title}
            </h4>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <span>📅</span>
                {formatDate(document.date)}
              </p>
              
              {document.veterinary && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span>👨‍⚕️</span>
                  {document.veterinary}
                </p>
              )}
              
              {document.nextDue && (
                <p className="text-xs text-orange-600 font-medium flex items-center gap-1">
                  <span>⏰</span>
                  Próximo: {formatDate(document.nextDue)}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Status and Actions */}
        <div className="flex flex-col items-end gap-2">
          {getStatusBadge(document.status)}
          
          <div className="flex gap-1">
            {document.fileUrl ? (
              <button className="w-8 h-8 bg-white/60 hover:bg-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105">
                <span className="text-sm">👁️</span>
              </button>
            ) : (
              <button className="w-8 h-8 bg-white/60 hover:bg-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105">
                <span className="text-sm">📎</span>
              </button>
            )}
            
            <button className="w-8 h-8 bg-white/60 hover:bg-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105">
              <span className="text-sm">⋯</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar for vaccines */}
      {document.type === 'vaccine' && document.nextDue && (
        <div className="mt-3 pt-3 border-t border-white/30">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Vigencia</span>
            <span className="text-xs text-gray-600">
              {Math.ceil((new Date(document.nextDue) - new Date()) / (1000 * 60 * 60 * 24))} días
            </span>
          </div>
          <div className="w-full bg-white/40 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-500 h-1 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.max(10, Math.min(100, 
                  (1 - (new Date(document.nextDue) - new Date()) / (365 * 24 * 60 * 60 * 1000)) * 100
                ))}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}; 