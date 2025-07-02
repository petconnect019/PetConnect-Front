import React, { useState, useEffect } from 'react';
import { getDocumentsByPet, getRemindersByPet } from '../../Utils/Fetch/FetchVetDocuments/FetchVetDocuments';
import { FaPaw, FaSyringe, FaClock, FaFileMedicalAlt, FaStethoscope, FaExclamationTriangle, FaCloudUploadAlt } from 'react-icons/fa';

export const HealthDashboard = ({ petList, navigate }) => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [healthData, setHealthData] = useState({
    nextVaccine: null,
    pendingReminders: 0,
    totalDocuments: 0,
    lastCheckup: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (petList.length > 0) {
      setSelectedPet(petList[0]);
    }
  }, [petList]);

  useEffect(() => {
    const loadHealthSummary = async () => {
      if (selectedPet) {
        setLoading(true);
        try {
          // Cargar datos de salud de la mascota
          const [documentsResponse, remindersResponse] = await Promise.all([
            getDocumentsByPet(selectedPet._id).catch(() => ({ documents: [] })),
            getRemindersByPet(selectedPet._id).catch(() => ({ reminders: [] }))
          ]);

          const documents = documentsResponse.documents || [];
          const reminders = remindersResponse.reminders || [];

          // Calcular estadísticas
          const vaccines = documents.filter(doc => doc.type === 'vaccine');
          const nextVaccine = vaccines
            .filter(v => v.nextDue && new Date(v.nextDue) > new Date())
            .sort((a, b) => new Date(a.nextDue) - new Date(b.nextDue))[0];

          const pendingReminders = reminders.filter(r => !r.completed).length;
          
          const lastCheckup = documents
            .filter(doc => doc.type === 'medical')
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

          setHealthData({
            nextVaccine,
            pendingReminders,
            totalDocuments: documents.length,
            lastCheckup
          });
        } catch (error) {
          console.error('Error al cargar resumen de salud:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadHealthSummary();
  }, [selectedPet]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateString) => {
    const days = Math.ceil((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (petList.length === 0) {
    return (
      <section className="bg-white rounded-2xl p-6 mx-4 mb-6 shadow-sm border border-gray-100">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🏥</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Panel de Salud</h3>
          <p className="text-gray-500 text-sm">Agrega una mascota para ver su información de salud</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-white rounded-2xl p-2 mx-4 mb-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sky-400/90 rounded-xl flex items-center justify-center shadow-sm">
            <FaPaw className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Panel de Salud</h2>
            <p className="text-sm text-gray-600">
              {selectedPet ? `Mantén al día la salud de ${selectedPet.name}` : 'Resumen de salud'}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/health-management')}
          className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-xl text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 shadow-sm"
        >
          Ver detalles
        </button>
      </div>

      {/* Pet Selector */}
      {petList.length > 1 && (
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {petList.map((pet) => (
              <button
                key={pet._id}
                onClick={() => setSelectedPet(pet)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  selectedPet?._id === pet._id
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  {pet.species === 'dog' ? '🐕' : '🐱'}
                </div>
                <span className="text-sm font-medium">{pet.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Health Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Próxima Vacuna */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-amber-400/90 rounded-lg flex items-center justify-center">
              <FaSyringe className="text-white text-sm" />
            </div>
            <span className="text-xs font-medium text-amber-600">Próxima Vacuna</span>
          </div>
          {healthData.nextVaccine ? (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {healthData.nextVaccine.title}
              </p>
              <p className="text-xs text-amber-600">
                {getDaysUntil(healthData.nextVaccine.nextDue) > 0 
                  ? `En ${getDaysUntil(healthData.nextVaccine.nextDue)} días`
                  : 'Vencida'
                }
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500">Sin vacunas programadas</p>
          )}
        </div>

        {/* Recordatorios Pendientes */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-violet-400/90 rounded-lg flex items-center justify-center">
              <FaClock className="text-white text-sm" />
            </div>
            <span className="text-xs font-medium text-violet-600">Recordatorios</span>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">
              {healthData.pendingReminders}
            </p>
            <p className="text-xs text-violet-600">Pendientes</p>
          </div>
        </div>

        {/* Documentos */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-teal-400/90 rounded-lg flex items-center justify-center">
              <FaFileMedicalAlt className="text-white text-sm" />
            </div>
            <span className="text-xs font-medium text-teal-600">Documentos</span>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">
              {healthData.totalDocuments}
            </p>
            <p className="text-xs text-teal-600">Archivados</p>
          </div>
        </div>

        {/* Último Chequeo */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-emerald-400/90 rounded-lg flex items-center justify-center">
              <FaStethoscope className="text-white text-sm" />
            </div>
            <span className="text-xs font-medium text-emerald-600">Último Chequeo</span>
          </div>
          {healthData.lastCheckup ? (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {formatDate(healthData.lastCheckup.date)}
              </p>
              <p className="text-xs text-emerald-600">
                {healthData.lastCheckup.veterinary || 'Sin especificar'}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500">Sin registros</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4">
        <button
          onClick={() => navigate('/health-management?tab=documents')}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-xl p-4 transition-colors duration-150"
        >
          <div className="flex items-center justify-center gap-2">
            <FaCloudUploadAlt className="text-xl" />
            <span className="font-semibold">Subir Documento</span>
          </div>
        </button>
      </div>

      {/* Urgent Alerts */}
      {(healthData.nextVaccine && getDaysUntil(healthData.nextVaccine.nextDue) <= 7) && (
        <div className="mt-4 bg-rose-50 border border-rose-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-rose-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaExclamationTriangle className="text-rose-600 text-sm" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-rose-600 mb-1">
                ¡Vacuna próxima a vencer!
              </h4>
              <p className="text-sm text-rose-600 mb-2">
                {healthData.nextVaccine.title} vence el {formatDate(healthData.nextVaccine.nextDue)}
              </p>
              <button
                onClick={() => navigate('/health-management?tab=vaccines')}
                className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-600 px-3 py-1 rounded-lg transition-colors duration-200"
              >
                Ver vacunas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Cargando...</span>
          </div>
        </div>
      )}
    </section>
  );
}; 