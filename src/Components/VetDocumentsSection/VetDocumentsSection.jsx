import React, { useState, useEffect } from 'react';
import { DocumentCard } from './DocumentCard';
import { UploadModal } from './UploadModal';
import { VaccineTimeline } from './VaccineTimeline';
import { getDocumentsByPet, getRemindersByPet, useVetDocuments } from '../../Utils/Fetch/FetchVetDocuments/FetchVetDocuments';

export const VetDocumentsSection = ({ petList, navigate, initialTab = 'documents' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    activeVaccines: 0,
    upcomingReminders: 0,
    overdueReminders: 0
  });

  const { getDocuments, getReminders, toggleReminder, loading: apiLoading, error } = useVetDocuments();

  useEffect(() => {
    if (petList.length > 0 && !selectedPet) {
      setSelectedPet(petList[0]);
    }
  }, [petList, selectedPet]);

  // Cargar datos cuando cambie la mascota seleccionada
  useEffect(() => {
    const loadVetData = async () => {
      if (!selectedPet) return;
      
      setLoading(true);
      try {
        // Cargar documentos reales del backend
        const documentsData = await getDocuments(selectedPet._id);
        setDocuments(documentsData || []);

        // Cargar recordatorios reales del backend
        const remindersData = await getReminders(selectedPet._id);
        setReminders(remindersData || []);

        // Calcular estadísticas
        calculateStats(documentsData || [], remindersData || []);
      } catch (error) {
        console.error('Error al cargar datos veterinarios:', error);
        setDocuments([]);
        setReminders([]);
      } finally {
        setLoading(false);
      }
    };

    loadVetData();
  }, [selectedPet]);

  const calculateStats = (docs, rems) => {
    const now = new Date();
    const activeVaccines = docs.filter(doc => 
      doc.type === 'vaccine' && 
      doc.status === 'active' && 
      doc.nextDue && 
      new Date(doc.nextDue) > now
    ).length;

    const upcomingReminders = rems.filter(rem => {
      if (rem.completed) return false;
      const reminderDate = new Date(rem.date);
      const diffDays = Math.ceil((reminderDate - now) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0;
    }).length;

    const overdueReminders = rems.filter(rem => {
      if (rem.completed) return false;
      return new Date(rem.date) < now;
    }).length;

    setStats({
      totalDocuments: docs.length,
      activeVaccines,
      upcomingReminders,
      overdueReminders
    });
  };

  const handleReminderToggle = async (reminderId) => {
    try {
      await toggleReminder(reminderId);
      // Recargar recordatorios
      const remindersData = await getReminders(selectedPet._id);
      setReminders(remindersData || []);
      calculateStats(documents, remindersData || []);
    } catch (error) {
      console.error('Error al actualizar recordatorio:', error);
    }
  };

  const handleDocumentAdded = async () => {
    // Recargar datos después de agregar documento
    if (selectedPet) {
      const documentsData = await getDocuments(selectedPet._id);
      setDocuments(documentsData || []);
      calculateStats(documentsData || [], reminders);
    }
  };

  const tabs = [
    { id: 'documents', label: 'Documentos', icon: '📄', count: stats.totalDocuments },
    { id: 'vaccines', label: 'Vacunas', icon: '💉', count: stats.activeVaccines },
    { id: 'timeline', label: 'Historial', icon: '📊', count: null }
  ];

  // Filtrar documentos por tipo según tab activo
  const getFilteredDocuments = () => {
    if (activeTab === 'vaccines') {
      return documents.filter(doc => doc.type === 'vaccine');
    }
    return documents;
  };

  // Separar recordatorios por estado
  const getUpcomingReminders = () => {
    const now = new Date();
    return reminders.filter(rem => {
      if (rem.completed) return false;
      const reminderDate = new Date(rem.date);
      return reminderDate >= now;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getOverdueReminders = () => {
    const now = new Date();
    return reminders.filter(rem => {
      if (rem.completed) return false;
      return new Date(rem.date) < now;
    });
  };

  if (!petList || petList.length === 0) {
    return <EmptyPetsState navigate={navigate} />;
  }

  return (
    <section className="mt-8 sm:mt-10 md:mt-12">
      {/* Header con estadísticas */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Gestión Veterinaria
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {selectedPet ? `Documentos de ${selectedPet.name}` : 'Selecciona una mascota'}
            </p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            disabled={!selectedPet}
            className="bg-gradient-to-r from-brand to-orange-500 text-white p-2 sm:p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-lg">📁</span>
          </button>
        </div>

        {/* Stats Cards */}
        {selectedPet && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <StatCard 
              icon="📄" 
              value={stats.totalDocuments} 
              label="Documentos" 
              color="blue" 
            />
            <StatCard 
              icon="💉" 
              value={stats.activeVaccines} 
              label="Vacunas Activas" 
              color="green" 
            />
            <StatCard 
              icon="⏰" 
              value={stats.upcomingReminders} 
              label="Próximos" 
              color="orange" 
            />
            <StatCard 
              icon="🚨" 
              value={stats.overdueReminders} 
              label="Vencidos" 
              color="red" 
            />
          </div>
        )}
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

      {/* Recordatorios Urgentes */}
      {selectedPet && (getOverdueReminders().length > 0 || getUpcomingReminders().slice(0, 2).length > 0) && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <span>🚨</span>
              Recordatorios Importantes
            </h3>
            
            {/* Recordatorios vencidos */}
            {getOverdueReminders().slice(0, 2).map(reminder => (
              <ReminderCard 
                key={reminder._id} 
                reminder={reminder} 
                onToggle={handleReminderToggle}
                variant="overdue"
              />
            ))}
            
            {/* Próximos recordatorios */}
            {getUpcomingReminders().slice(0, 2).map(reminder => (
              <ReminderCard 
                key={reminder._id} 
                reminder={reminder} 
                onToggle={handleReminderToggle}
                variant="upcoming"
              />
            ))}

            <div className="mt-3 pt-3 border-t border-red-200">
              <button
                onClick={() => navigate('/health-management?tab=calendar')}
                className="text-sm text-red-700 hover:text-red-800 font-medium transition-colors duration-200 flex items-center gap-1"
              >
                <span>📅</span>
                Ver todos en calendario
              </button>
            </div>
          </div>
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
            <div className="flex items-center gap-1">
              <span className="text-sm">{tab.icon}</span>
              {tab.count !== null && (
                <span className="bg-brand text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                  {tab.count}
                </span>
              )}
            </div>
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[200px]">
        {loading || apiLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onRetry={() => window.location.reload()} />
        ) : !selectedPet ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🐕</span>
            </div>
            <p className="text-gray-500">Selecciona una mascota para ver sus documentos</p>
          </div>
        ) : (
          <>
            {activeTab === 'documents' && (
              <DocumentsTab 
                documents={getFilteredDocuments()} 
                selectedPet={selectedPet}
                onRefresh={handleDocumentAdded}
              />
            )}
            
            {activeTab === 'vaccines' && (
              <VaccinesTab 
                vaccines={getFilteredDocuments()} 
                selectedPet={selectedPet}
                onRefresh={handleDocumentAdded}
              />
            )}
            
            {activeTab === 'timeline' && (
              <VaccineTimeline 
                documents={documents} 
                selectedPet={selectedPet} 
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showUploadModal && (
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          selectedPet={selectedPet}
          onSuccess={handleDocumentAdded}
        />
      )}
    </section>
  );
};

// Componentes auxiliares
const EmptyPetsState = ({ navigate }) => (
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
        onClick={() => navigate('/new-pet1')}
        className="bg-brand text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-all duration-300"
      >
        Registrar Mascota
      </button>
    </div>
  </section>
);

const StatCard = ({ icon, value, label, color }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${colors[color]} flex items-center justify-center`}>
          <span className="text-white text-sm">{icon}</span>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-800">{value}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="space-y-3">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    ))}
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
      <span className="text-2xl">⚠️</span>
    </div>
    <h3 className="font-semibold text-gray-800 mb-2">Error al cargar datos</h3>
    <p className="text-gray-600 text-sm mb-4">{error}</p>
    <button 
      onClick={onRetry}
      className="bg-brand text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition-all duration-200"
    >
      Reintentar
    </button>
  </div>
);

const DocumentsTab = ({ documents, selectedPet, onRefresh }) => (
  <div className="space-y-3">
    {documents.length > 0 ? (
      documents.map((doc) => (
        <DocumentCard 
          key={doc._id} 
          document={doc} 
          onUpdate={onRefresh}
          onDelete={onRefresh}
        />
      ))
    ) : (
      <EmptyState 
        icon="📄" 
        title="No hay documentos" 
        subtitle={`Agrega el primer documento médico de ${selectedPet?.name}`}
        action={() => {}} 
        actionText="Subir Documento" 
      />
    )}
  </div>
);

const VaccinesTab = ({ vaccines, selectedPet, onRefresh }) => (
  <div className="space-y-3">
    {vaccines.length > 0 ? (
      vaccines.map((vaccine) => (
        <VaccineCard 
          key={vaccine._id} 
          vaccine={vaccine} 
          onUpdate={onRefresh}
        />
      ))
    ) : (
      <EmptyState 
        icon="💉" 
        title="No hay vacunas registradas" 
        subtitle={`Registra las vacunas de ${selectedPet?.name}`}
        action={() => {}} 
        actionText="Agregar Vacuna" 
      />
    )}
  </div>
);

const EmptyState = ({ icon, title, subtitle, action, actionText }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <span className="text-2xl">{icon}</span>
    </div>
    <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm mb-4">{subtitle}</p>
    {action && (
      <button 
        onClick={action}
        className="bg-brand text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition-all duration-200"
      >
        {actionText}
      </button>
    )}
  </div>
);

const VaccineCard = ({ vaccine, onUpdate }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
        <span className="text-green-600">💉</span>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{vaccine.title}</h4>
        <p className="text-sm text-gray-600">
          Aplicada: {new Date(vaccine.date).toLocaleDateString('es-CO')}
        </p>
        {vaccine.nextDue && (
          <p className="text-sm text-orange-600">
            Próxima: {new Date(vaccine.nextDue).toLocaleDateString('es-CO')}
          </p>
        )}
        {vaccine.veterinary && (
          <p className="text-xs text-gray-500 mt-1">{vaccine.veterinary}</p>
        )}
      </div>
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
        vaccine.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}>
        {vaccine.status === 'active' ? 'Activa' : 'Completada'}
      </div>
    </div>
  </div>
);

const ReminderCard = ({ reminder, onToggle, variant = 'default' }) => {
  const variantStyles = {
    overdue: 'border-red-200 bg-red-50',
    upcoming: 'border-orange-200 bg-orange-50', 
    default: 'border-gray-200 bg-white'
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Vencido hace ${Math.abs(diffDays)} días`;
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    return `En ${diffDays} días`;
  };

  return (
    <div className={`rounded-lg p-3 border mb-2 last:mb-0 ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800 text-sm">{reminder.title}</h4>
          <p className="text-xs text-gray-600">
            {formatDate(reminder.date)} • {reminder.priority} prioridad
          </p>
        </div>
        <button
          onClick={() => onToggle(reminder._id)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            reminder.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {reminder.completed && <span className="text-xs">✓</span>}
        </button>
      </div>
    </div>
  );
}; 