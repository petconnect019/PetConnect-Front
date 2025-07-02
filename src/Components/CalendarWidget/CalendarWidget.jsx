import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleCalendarAPI } from '../../Utils/GoogleCalendar/GoogleCalendarAPI';
import { usePet } from '../../Contexts/PetContext/PetContext';

export const CalendarWidget = () => {
  const navigate = useNavigate();
  const { petList } = usePet();
  const [isConnected, setIsConnected] = useState(false);
  const [nextEvent, setNextEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnectionAndLoadEvents();
  }, []);

  const checkConnectionAndLoadEvents = async () => {
    try {
      const connected = await GoogleCalendarAPI.isConnected();
      setIsConnected(connected);
      
      if (connected) {
        const events = await GoogleCalendarAPI.getEvents();
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
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-CO', { 
        day: 'numeric',
        month: 'short'
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-16 bg-gray-100 rounded-lg"></div>
      </div>
    );
  }

  const handleCreateEvent = () => {
    navigate('/health-management');
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📅</span>
          <h3 className="text-sm font-medium text-gray-800">Próxima Cita</h3>
        </div>
        
        <button
          onClick={handleCreateEvent}
          className="bg-brand hover:bg-brand-dark text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center gap-1"
        >
          <span className="text-xs">➕</span>
          Agendar
        </button>
      </div>

      {!isConnected ? (
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-500">Sin conexión a Calendar</span>
          <button
            onClick={handleCreateEvent}
            className="text-brand hover:text-brand-dark text-sm font-medium transition-colors duration-150"
          >
            Conectar →
          </button>
        </div>
      ) : nextEvent ? (
        <div className="flex items-center gap-3 py-1">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm">🩺</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-800 text-sm truncate">{nextEvent.summary}</h4>
            <p className="text-xs text-gray-500">
              {formatDate(nextEvent.start.dateTime || nextEvent.start.date)}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-500">Sin citas programadas</span>
          <button
            onClick={handleCreateEvent}
            className="text-brand hover:text-brand-dark text-sm font-medium transition-colors duration-150"
          >
            Programar →
          </button>
        </div>
      )}
    </div>
  );
}; 