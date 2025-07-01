import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VetDocumentsSection } from '../../Components/VetDocumentsSection';
import { CalendarIntegration } from '../../Components/CalendarIntegration/CalendarIntegration';
import { usePet } from '../../Contexts/PetContext/PetContext';

export const HealthManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'documents';
  const [activeTab, setActiveTab] = useState(initialTab);
  const { petList } = usePet();

  const tabs = [
    { id: 'documents', label: 'Documentos', icon: '📋' },
    { id: 'vaccines', label: 'Vacunas', icon: '💉' },
    { id: 'reminders', label: 'Recordatorios', icon: '⏰' },
    { id: 'calendar', label: 'Calendario', icon: '📅' },
    { id: 'timeline', label: 'Historial', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <span className="text-gray-600">←</span>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Gestión de Salud</h1>
              <p className="text-sm text-gray-500">Administra la salud de tus mascotas</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-brand text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {(activeTab === 'documents' || activeTab === 'vaccines' || activeTab === 'reminders' || activeTab === 'timeline') && (
          <VetDocumentsSection 
            petList={petList} 
            navigate={navigate}
            initialTab={activeTab}
          />
        )}
        
        {activeTab === 'calendar' && (
          <CalendarIntegration />
        )}
      </div>
    </div>
  );
}; 