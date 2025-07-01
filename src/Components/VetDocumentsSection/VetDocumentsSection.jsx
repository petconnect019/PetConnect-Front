import React, { useState, useEffect } from 'react';
import { DocumentCard } from './DocumentCard';
import { UploadModal } from './UploadModal';
import { VaccineTimeline } from './VaccineTimeline';
import { useVetDocuments } from '../../Utils/Fetch/FetchVetDocuments/FetchVetDocuments';

export const VetDocumentsSection = ({ petList, navigate, initialTab = 'documents' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getDocuments } = useVetDocuments();

  // Inicializar mascota seleccionada
  useEffect(() => {
    if (petList.length > 0 && !selectedPet) {
      setSelectedPet(petList[0]);
    }
  }, [petList, selectedPet]);

  // Sincronizar con pestaña inicial
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Cargar documentos
  const loadDocuments = async () => {
    if (!selectedPet) return;
    
    setLoading(true);
    setError(null);
    try {
      const documentsData = await getDocuments(selectedPet._id);
      setDocuments(documentsData || []);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
      setError(error.message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [selectedPet]);

  // Calcular estadísticas
  const stats = {
    documents: documents.filter(doc => doc.type !== 'vaccine').length,
    activeVaccines: documents.filter(doc => 
      doc.type === 'vaccine' && 
      doc.status === 'active' && 
      doc.nextDue && 
      new Date(doc.nextDue) > new Date()
    ).length,
    totalDocuments: documents.length
  };

  if (!petList || petList.length === 0) {
    return <EmptyPetsState navigate={navigate} />;
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState 
        error={error} 
        onRetry={loadDocuments}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {selectedPet?.name}
          </h2>
          <p className="text-sm text-gray-500">
            {activeTab === 'documents' ? 'Documentos médicos' :
             activeTab === 'vaccines' ? 'Control de vacunas' :
             'Historial médico'}
          </p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-brand text-white p-2 rounded-xl hover:bg-orange-600 transition-colors duration-150"
        >
          <span className="text-lg">📁</span>
        </button>
      </div>

      {/* Pet Selector (solo si hay más de una mascota) */}
      {petList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {petList.map((pet) => (
            <button
              key={pet._id}
              onClick={() => setSelectedPet(pet)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
                selectedPet?._id === pet._id
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{pet.species === 'dog' ? '🐕' : '🐱'}</span>
              {pet.name}
            </button>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ${
            activeTab === 'documents'
              ? 'bg-brand text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span>📄</span>
          <span>Documentos</span>
          <span className="ml-1 text-xs opacity-80">({stats.documents})</span>
        </button>
        <button
          onClick={() => setActiveTab('vaccines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ${
            activeTab === 'vaccines'
              ? 'bg-brand text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span>💉</span>
          <span>Vacunas</span>
          <span className="ml-1 text-xs opacity-80">({stats.activeVaccines})</span>
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ${
            activeTab === 'timeline'
              ? 'bg-brand text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span>📊</span>
          <span>Historial</span>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'documents' && (
          <div className="grid gap-4">
            {documents
              .filter(doc => doc.type !== 'vaccine')
              .map(doc => (
                <DocumentCard 
                  key={doc._id} 
                  document={doc}
                />
              ))}
            {documents.filter(doc => doc.type !== 'vaccine').length === 0 && (
              <EmptyState
                icon="📄"
                title="Sin documentos"
                subtitle="Agrega documentos médicos para tu mascota"
              />
            )}
          </div>
        )}
        
        {activeTab === 'vaccines' && (
          <div className="grid gap-4">
            {documents
              .filter(doc => doc.type === 'vaccine')
              .map(doc => (
                <DocumentCard 
                  key={doc._id} 
                  document={doc}
                />
              ))}
            {documents.filter(doc => doc.type === 'vaccine').length === 0 && (
              <EmptyState
                icon="💉"
                title="Sin vacunas"
                subtitle="Registra las vacunas de tu mascota"
              />
            )}
          </div>
        )}
        
        {activeTab === 'timeline' && (
          <VaccineTimeline 
            documents={documents}
            selectedPet={selectedPet}
          />
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={loadDocuments}
          selectedPet={selectedPet}
        />
      )}
    </div>
  );
};

const EmptyState = ({ icon, title, subtitle }) => (
  <div className="text-center py-8">
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <span className="text-2xl">{icon}</span>
    </div>
    <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{subtitle}</p>
  </div>
);

const EmptyPetsState = ({ navigate }) => (
  <div className="text-center py-8">
    <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
      <span className="text-2xl">🐕</span>
    </div>
    <h3 className="font-semibold text-gray-800 mb-2">No hay mascotas registradas</h3>
    <p className="text-gray-500 text-sm mb-4">
      Agrega una mascota para comenzar
    </p>
    <button
      onClick={() => navigate('/new-pet1')}
      className="bg-brand hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150"
    >
      Agregar Mascota
    </button>
  </div>
);

const LoadingState = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    ))}
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="text-center py-8">
    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
      <span className="text-2xl">⚠️</span>
    </div>
    <h3 className="font-semibold text-gray-800 mb-2">Error al cargar datos</h3>
    <p className="text-gray-500 text-sm mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="bg-brand hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150"
    >
      Reintentar
    </button>
  </div>
); 