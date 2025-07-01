import React from 'react';

export const VaccineTimeline = ({ documents, selectedPet }) => {
  const sortedDocuments = documents.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sortedDocuments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="font-semibold text-gray-800 mb-2">Sin historial médico</h3>
        <p className="text-gray-500 text-sm">El historial aparecerá aquí cuando agregues documentos</p>
      </div>
    );
  }

  const getIconByType = (type) => {
    switch (type) {
      case 'vaccine': return '💉';
      case 'medical': return '🩺';
      case 'certificate': return '🏆';
      case 'prescription': return '💊';
      case 'lab': return '🧪';
      case 'surgery': return '🏥';
      default: return '📄';
    }
  };

  const getColorByType = (type) => {
    switch (type) {
      case 'vaccine': return 'bg-green-100 text-green-700 border-green-200';
      case 'medical': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'certificate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'prescription': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'lab': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'surgery': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const groupByYear = (docs) => {
    return docs.reduce((groups, doc) => {
      const year = new Date(doc.date).getFullYear();
      if (!groups[year]) groups[year] = [];
      groups[year].push(doc);
      return groups;
    }, {});
  };

  const groupedDocs = groupByYear(sortedDocuments);

  return (
    <div className="space-y-6">
      {Object.entries(groupedDocs).map(([year, yearDocs]) => (
        <div key={year}>
          {/* Year Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-brand text-white px-3 py-1 rounded-full text-sm font-medium">
              {year}
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-500">
              {yearDocs.length} registro{yearDocs.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Timeline Items */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-4">
              {yearDocs.map((doc, index) => (
                <div key={doc.id} className="relative flex gap-4">
                  {/* Timeline dot */}
                  <div className={`w-12 h-12 rounded-full border-4 border-white ${getColorByType(doc.type)} flex items-center justify-center z-10 shadow-sm`}>
                    <span className="text-lg">{getIconByType(doc.type)}</span>
                  </div>
                  
                  {/* Content card */}
                  <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{doc.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{formatDate(doc.date)}</p>
                        
                        {doc.veterinary && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                            <span>👨‍⚕️</span>
                            {doc.veterinary}
                          </p>
                        )}
                        
                        {doc.nextDue && (
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-xs text-orange-600">⏰ Próximo:</span>
                            <span className="text-xs text-orange-600 font-medium">
                              {formatDate(doc.nextDue)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Status badge */}
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doc.status === 'active' ? 'bg-green-100 text-green-700' :
                          doc.status === 'expired' ? 'bg-red-100 text-red-700' :
                          doc.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {doc.status === 'active' ? 'Vigente' :
                           doc.status === 'expired' ? 'Vencido' :
                           doc.status === 'pending' ? 'Pendiente' : 'Completado'}
                        </span>
                        
                        {doc.fileUrl && (
                          <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-200">
                            <span className="text-sm">👁️</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      
      {/* Summary Statistics */}
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4">
        <h4 className="font-semibold text-gray-800 mb-3 text-center">Resumen de {selectedPet?.name}</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand">
              {documents.filter(d => d.type === 'vaccine').length}
            </div>
            <div className="text-xs text-gray-600">Vacunas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {documents.filter(d => d.type === 'medical').length}
            </div>
            <div className="text-xs text-gray-600">Exámenes</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 