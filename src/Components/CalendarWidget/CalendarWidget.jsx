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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    checkConnectionAndLoadEvents();
  }, []);

  const checkConnectionAndLoadEvents = async () => {
    try {
      const connected = await GoogleCalendarAPI.isConnected();
      setIsConnected(connected);
      
      if (connected) {
        const events = await GoogleCalendarAPI.getEvents();
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

  const handleCreateEvent = () => {
    if (!isConnected) {
      navigate('/health-management');
      return;
    }
    setShowCreateForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      const endDateTime = new Date(dateTime.getTime() + 60 * 60 * 1000); // 1 hora después

      const event = {
        summary: `🐾 ${formData.title}`,
        description: formData.notes,
        start: {
          dateTime: dateTime.toISOString(),
          timeZone: 'America/Bogota'
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/Bogota'
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 60 }, // 1 hora antes
            { method: 'popup', minutes: 15 } // 15 minutos antes
          ]
        }
      };

      await GoogleCalendarAPI.createEvent(event);
      await checkConnectionAndLoadEvents();
      setShowCreateForm(false);
      setFormData({ title: '', date: '', time: '', notes: '' });
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error al crear el evento. Por favor, intenta de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-16 bg-gray-100 rounded-lg"></div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-800">Agendar Cita</h3>
          <button
            onClick={() => setShowCreateForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Título de la cita"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand"
              required
            />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand"
              required
            />
          </div>

          <div>
            <textarea
              placeholder="Notas (opcional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand resize-none"
              rows="2"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg text-sm font-medium transition-colors duration-150"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    );
  }

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
            onClick={() => navigate('/health-management')}
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
            Agendar →
          </button>
        </div>
      )}
    </div>
  );
}; 