import React, { useState, useEffect } from 'react';
import { DocumentCard } from './DocumentCard';
import { UploadModal } from './UploadModal';
import { ReminderCard } from './ReminderCard';
import { VaccineTimeline } from './VaccineTimeline';
import { CreateReminderModal } from './CreateReminderModal';
import { getDocumentsByPet, getRemindersByPet } from '../../Utils/Fetch/FetchVetDocuments/FetchVetDocuments';

export const VetDocumentsSection = ({ petList, navigate, initialTab = 'documents' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [reminders, setReminders] = useState([]);

  // Datos de ejemplo para desarrollo (se reemplazarán con datos reales del backend)
  const getMockDocuments = (petId) => [
    {
      id: 1,
      petId: petId,
      type: 'vaccine',
      title: 'Vacuna Antirrábica',
      date: '2024-01-15',
      nextDue: '2025-01-15',
      veterinary: 'Dr. María González',
      status: 'active',
      fileUrl: null
    },
    {
      id: 2,
      petId: petId,
      type: 'medical',
      title: 'Examen General',
      date: '2024-01-10',
      veterinary: 'Clínica VetSalud',
      status: 'completed',
      fileUrl: null
    }
  ];

  const getMockReminders = (petId) => [
    {
      id: 1,
      petId: petId,
      type: 'vaccine',
      title: 'Refuerzo Antirrábica',
      date: '2025-01-15',
      priority: 'high',
      completed: false
    },
    {
      id: 2,
      petId: petId,
      type: 'checkup',
      title: 'Revisión Anual',
      date: '2024-12-25',
      priority: 'medium',
      completed: false
    }
  ];

  useEffect(() => {
    if (petList.length > 0) {
      setSelectedPet(petList[0]);
    }
  }, [petList]);

  // Cargar documentos y recordatorios cuando cambie la mascota seleccionada
  useEffect(() => {
    const loadVetData = async () => {
      if (selectedPet) {
        try {
          // Cargar documentos
          const documentsResponse = await getDocumentsByPet(selectedPet._id);
          setDocuments(documentsResponse.documents || []);

          // Cargar recordatorios
          const remindersResponse = await getRemindersByPet(selectedPet._id);
          setReminders(remindersResponse.reminders || []);
                 } catch (error) {
           console.error('Error al cargar datos veterinarios:', error);
           // Usar datos mock si hay error (para desarrollo)
           setDocuments(getMockDocuments(selectedPet._id));
           setReminders(getMockReminders(selectedPet._id));
         }
      }
    };

    loadVetData();
  }, [selectedPet]);

  const tabs = [
    { id: 'documents', label: 'Documentos', icon: '📄' },
    { id: 'vaccines', label: 'Vacunas', icon: '💉' },
    { id: 'reminders', label: 'Recordatorios', icon: '⏰' },
    { id: 'timeline', label: 'Historial', icon: '📊' }
  ];

  const filteredDocuments = documents.filter(doc => 
    selectedPet && doc.petId === selectedPet._id
  );

  const filteredReminders = reminders.filter(reminder => 
    selectedPet && reminder.petId === selectedPet._id
  );

  if (!petList || petList.length === 0) {
    return (
      <section className="mt-8 sm:mt-10 md:mt-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🏥</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Gestión Veterinaria
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Registra una mascota para comenzar a gestionar sus documentos médicos
          </p>
          <button 
            onClick={() => navigate('/new_pet_1')}
            className="bg-brand text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-all duration-300"
          >
            Registrar Mascota
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 sm:mt-10 md:mt-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Gestión Veterinaria
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Documentos, vacunas y recordatorios
          </p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-r from-brand to-orange-500 text-white p-2 sm:p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <span className="text-lg">📁</span>
        </button>
      </div>

      {/* Pet Selector */}
      {petList.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {petList.map((pet) => (
            <button
              key={pet._id}
              onClick={() => setSelectedPet(pet)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                selectedPet?._id === pet._id
                  ? 'bg-brand text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
                             <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                 {pet.species === 'dog' ? '🐕' : '🐱'}
               </div>
              {pet.name}
            </button>
          ))}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-0 flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-xs font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-white text-brand shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[200px]">
        {activeTab === 'documents' && (
          <div className="space-y-3">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))
            ) : (
              <EmptyState 
                icon="📄"
                title="Sin documentos"
                subtitle="Aún no hay documentos registrados para esta mascota"
                action={() => setShowUploadModal(true)}
                actionText="Subir Documento"
              />
            )}
          </div>
        )}

        {activeTab === 'vaccines' && (
          <div className="space-y-3">
            {filteredDocuments.filter(doc => doc.type === 'vaccine').length > 0 ? (
              filteredDocuments.filter(doc => doc.type === 'vaccine').map((vaccine) => (
                <VaccineCard key={vaccine.id} vaccine={vaccine} />
              ))
            ) : (
              <EmptyState 
                icon="💉"
                title="Sin vacunas registradas"
                subtitle="Mantén al día el calendario de vacunación"
                action={() => setShowUploadModal(true)}
                actionText="Registrar Vacuna"
              />
            )}
          </div>
        )}

                 {activeTab === 'reminders' && (
           <div className="space-y-3">
             {filteredReminders.length > 0 ? (
               <>
                 {filteredReminders.map((reminder) => (
                   <ReminderCard 
                     key={reminder._id || reminder.id} 
                     reminder={reminder} 
                     onUpdate={(updatedReminder) => {
                       setReminders(reminders.map(r => 
                         (r._id || r.id) === (updatedReminder._id || updatedReminder.id) 
                           ? updatedReminder 
                           : r
                       ));
                     }}
                   />
                 ))}
                 {/* Botón flotante para agregar recordatorio */}
                 <button
                   onClick={() => setShowReminderModal(true)}
                   className="fixed bottom-24 right-4 w-14 h-14 bg-brand hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-105"
                   title="Crear nuevo recordatorio"
                 >
                   <span className="text-xl">⏰</span>
                 </button>
               </>
             ) : (
               <EmptyState 
                 icon="⏰"
                 title="Sin recordatorios"
                 subtitle="Configura recordatorios para no olvidar citas importantes"
                 action={() => setShowReminderModal(true)}
                 actionText="Crear Recordatorio"
               />
             )}
           </div>
         )}

        {activeTab === 'timeline' && (
          <VaccineTimeline 
            documents={filteredDocuments} 
            selectedPet={selectedPet}
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        <button 
          onClick={() => navigate('/vet-emergency')}
          className="flex items-center justify-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all duration-300"
        >
          <span className="text-xl">🚨</span>
          <span className="text-sm font-medium text-red-700">Emergencia</span>
        </button>
        <button 
          onClick={() => navigate('/vet-directory')}
          className="flex items-center justify-center gap-2 p-4 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all duration-300"
        >
          <span className="text-xl">🏥</span>
          <span className="text-sm font-medium text-blue-700">Veterinarias</span>
        </button>
      </div>

             {/* Upload Modal */}
       {showUploadModal && (
         <UploadModal 
           selectedPet={selectedPet}
           onClose={() => setShowUploadModal(false)}
           onUpload={(newDoc) => {
             setDocuments([...documents, newDoc]);
             setShowUploadModal(false);
             // Recargar datos si es necesario
             if (selectedPet) {
               const loadUpdatedData = async () => {
                 try {
                   const documentsResponse = await getDocumentsByPet(selectedPet._id);
                   setDocuments(documentsResponse.documents || []);
                   const remindersResponse = await getRemindersByPet(selectedPet._id);
                   setReminders(remindersResponse.reminders || []);
                 } catch (error) {
                   console.error('Error al recargar datos:', error);
                 }
               };
               loadUpdatedData();
             }
           }}
         />
       )}

       {/* Create Reminder Modal */}
       {showReminderModal && (
         <CreateReminderModal 
           selectedPet={selectedPet}
           onClose={() => setShowReminderModal(false)}
           onCreate={(newReminder) => {
             setReminders([...reminders, newReminder]);
             setShowReminderModal(false);
           }}
         />
       )}
    </section>
  );
};

// Componente de estado vacío reutilizable
const EmptyState = ({ icon, title, subtitle, action, actionText }) => (
  <div className="text-center py-8">
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <span className="text-2xl">{icon}</span>
    </div>
    <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm mb-4">{subtitle}</p>
    <button 
      onClick={action}
      className="bg-brand text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-all duration-300"
    >
      {actionText}
    </button>
  </div>
);

// Componente de tarjeta de vacuna
const VaccineCard = ({ vaccine }) => (
  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4">
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-green-600">💉</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 text-sm">{vaccine.title}</h4>
          <p className="text-xs text-gray-500">Aplicada: {vaccine.date}</p>
          {vaccine.nextDue && (
            <p className="text-xs text-green-600 font-medium">
              Próxima: {vaccine.nextDue}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">{vaccine.veterinary}</p>
        </div>
      </div>
      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
        Activa
      </span>
    </div>
  </div>
); 