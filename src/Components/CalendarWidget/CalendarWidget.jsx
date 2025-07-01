import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleCalendarAPI } from '../../Utils/GoogleCalendar/GoogleCalendarAPI';
import { usePet } from '../../Contexts/PetContext/PetContext';

export const CalendarWidget = () => {
  const navigate = useNavigate();
  const { petList } = usePet();
  const [isConnected, setIsConnected] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextEvent, setNextEvent] = useState(null);

  useEffect(() => {
    checkConnectionAndLoadEvents();
  }, []);

  const checkConnectionAndLoadEvents = async () => {
    try {
      const connected = await GoogleCalendarAPI.isConnected();
      setIsConnected(connected);
      
      if (connected) {
        const events = await GoogleCalendarAPI.getEvents();
        setUpcomingEvents(events);
        
        // Encontrar el próximo evento
        const now = new Date();
        const upcoming = events
          .filter(event => new Date(event.start.dateTime || event.start.date) > now)
          .sort((a, b) => new Date(a.start.dateTime || a.start.date) - new Date(b.start.dateTime || b.start.date));
        
        setNextEvent(upcoming[0] || null);
      }
    } catch (error) {
      console.error('Error checking calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Hoy ${date.toLocaleTimeString('es-CO', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Mañana ${date.toLocaleTimeString('es-CO', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else {
      return date.toLocaleDateString('es-CO', { 
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const getDaysUntilEvent = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 my-4 animate-pulse">
        <div className="h-20 bg-white/50 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 my-4 shadow-lg border border-blue-100/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">📅</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Calendario Veterinario</h3>
            <p className="text-sm text-gray-600">
              {isConnected ? 'Sincronizado con Google Calendar' : 'No conectado'}
            </p>
          </div>
        </div>
        
        {/* Connection Status */}
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`}></div>
      </div>

      {!isConnected ? (
        /* Not Connected State */
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔗</span>
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Conecta tu calendario</h4>
          <p className="text-sm text-gray-600 mb-4">
            Sincroniza las citas de tus mascotas con Google Calendar
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/health-management?tab=calendar')}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors duration-150"
            >
              Conectar
            </button>
            <button
              onClick={() => navigate('/health-management?tab=calendar')}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-xl text-sm font-medium border border-gray-200 transition-colors duration-150"
            >
              Ver más
            </button>
          </div>
        </div>
      ) : nextEvent ? (
        /* Has Upcoming Events */
        <div>
          {/* Next Event Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/50 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">🩺</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">{nextEvent.summary}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {formatDate(nextEvent.start.dateTime || nextEvent.start.date)}
                </p>
                
                {/* Days Until Event */}
                {(() => {
                  const days = getDaysUntilEvent(nextEvent.start.dateTime || nextEvent.start.date);
                  if (days === 0) {
                    return (
                      <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        ¡Hoy!
                      </div>
                    );
                  } else if (days === 1) {
                    return (
                      <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        Mañana
                      </div>
                    );
                  } else if (days <= 7) {
                    return (
                      <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        En {days} días
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-white/50">
              <div className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</div>
              <div className="text-xs text-gray-600">Citas programadas</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-white/50">
              <div className="text-2xl font-bold text-green-600">{petList.length}</div>
              <div className="text-xs text-gray-600">Mascotas registradas</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/health-management?tab=calendar')}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors duration-150 flex items-center justify-center gap-2"
            >
              <span>📋</span>
              Nueva Cita
            </button>
            <button
              onClick={() => navigate('/health-management?tab=calendar')}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-xl text-sm font-medium border border-gray-200 transition-colors duration-150 flex items-center justify-center gap-2"
            >
              <span>👁️</span>
              Ver Todo
            </button>
          </div>
        </div>
      ) : (
        /* No Upcoming Events */
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">📅</span>
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">No hay citas programadas</h4>
          <p className="text-sm text-gray-600 mb-4">
            Programa la próxima cita veterinaria para {petList.length > 0 ? 'tus mascotas' : 'tu mascota'}
          </p>
                      <button
              onClick={() => navigate('/health-management?tab=calendar')}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-xl text-sm font-medium transition-colors duration-150 flex items-center gap-2 mx-auto"
            >
              <span>➕</span>
              Programar Cita
            </button>
        </div>
      )}
    </div>
  );
}; 