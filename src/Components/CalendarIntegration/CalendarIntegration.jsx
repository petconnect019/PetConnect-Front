import React, { useState, useEffect, useCallback } from 'react';
import { GoogleCalendarAPI } from '../../Utils/GoogleCalendar/GoogleCalendarAPI';
import { usePet } from '../../Contexts/PetContext/PetContext';
import { useHasPetsUser } from '../../Contexts/HasPetsUser/HasPetsUser';
import { useFetchPets } from '../../Hooks/useFetchPets/useFetchPets';
import { useVetDocuments } from '../../Utils/Fetch/FetchVetDocuments/FetchVetDocuments';

export const CalendarIntegration = () => {
  const { petList } = usePet();
  const { hasPetsUser } = useHasPetsUser();
  
  useFetchPets(hasPetsUser);
  
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [configError, setConfigError] = useState(null);
  const [activeView, setActiveView] = useState('overview');
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    notes: '',
    petId: '',
    veterinary: ''
  });
  
  const { getReminders, toggleReminder } = useVetDocuments();

  useEffect(() => {
    if (petList?.length > 0 && !selectedPet) {
      setSelectedPet(petList[0]);
      setFormData(prev => ({ ...prev, petId: petList[0]._id }));
    }
  }, [petList, selectedPet]);

  const checkGoogleCalendarConnection = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const connected = await GoogleCalendarAPI.isConnected();
      setIsConnected(connected);
      setConfigError(null);
      
      if (connected) {
        await loadCalendarEvents();
      }
    } catch (error) {
      console.error('Error checking calendar connection:', error);
      setConfigError(error.message);
      setIsConnected(false);
      setError('Error al verificar la conexión con Google Calendar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkGoogleCalendarConnection();
  }, [checkGoogleCalendarConnection]);

  const loadCalendarEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const calendarEvents = await GoogleCalendarAPI.getEvents();
      setEvents(calendarEvents || []);
      
      if (selectedPet) {
        const remindersData = await getReminders(selectedPet._id);
        setReminders(remindersData || []);
      }
    } catch (error) {
      console.error('Error loading calendar events:', error);
      setEvents([]);
      setError('Error al cargar los eventos del calendario');
    } finally {
      setLoading(false);
    }
  };

  const connectToGoogleCalendar = async () => {
    setLoading(true);
    try {
      await GoogleCalendarAPI.authenticate();
      const connected = await GoogleCalendarAPI.isConnected();
      setIsConnected(connected);
      setConfigError(null);
      
      if (connected) {
        await loadCalendarEvents();
        alert('¡Conectado exitosamente a Google Calendar!');
      }
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      alert(`Error al conectar con Google Calendar: ${error.message}`);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const disconnectFromGoogleCalendar = async () => {
    try {
      GoogleCalendarAPI.disconnect();
      setIsConnected(false);
      setEvents([]);
      alert('Desconectado de Google Calendar');
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      const endDateTime = new Date(dateTime.getTime() + 60 * 60 * 1000); // 1 hora después

      const selectedPetData = petList.find(pet => pet._id === formData.petId);
      const petIcon = selectedPetData?.species === 'dog' ? '🐕' : '🐱';
      const petName = selectedPetData?.name || 'Mascota';

      const event = {
        summary: `${petIcon} ${formData.title} - ${petName}`,
        description: `Cita veterinaria para ${petName}\n\nTipo: ${formData.title}\nNotas: ${formData.notes || 'Sin notas adicionales'}\n\nCreado desde Pet Connect`,
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
            { method: 'popup', minutes: 24 * 60 }, // 1 día antes
            { method: 'popup', minutes: 60 }, // 1 hora antes
            { method: 'popup', minutes: 15 } // 15 minutos antes
          ]
        },
        colorId: '3' // Color verde para eventos de mascotas
      };

      if (formData.veterinary?.trim()) {
        event.attendees = [{ 
          email: formData.veterinary.trim(),
          responseStatus: 'needsAction'
        }];
      }

      await GoogleCalendarAPI.createEvent(event);
      await loadCalendarEvents();
      setShowCreateForm(false);
      setFormData({
        title: '',
        date: '',
        time: '',
        notes: '',
        petId: selectedPet?._id || '',
        veterinary: ''
      });
      alert('¡Cita creada exitosamente!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error al crear el evento. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleReminderToggle = async (reminderId) => {
    try {
      await toggleReminder(reminderId);
      if (selectedPet) {
        const remindersData = await getReminders(selectedPet._id);
        setReminders(remindersData || []);
      }
    } catch (error) {
      console.error('Error al actualizar recordatorio:', error);
    }
  };

  const getCombinedEvents = () => {
    const calendarEvents = events.map(event => ({
      ...event,
      type: 'calendar',
      date: event.start?.dateTime || event.start?.date,
      title: event.summary
    }));

    const reminderEvents = reminders
      .filter(reminder => !reminder.completed)
      .map(reminder => ({
        ...reminder,
        type: 'reminder',
        date: reminder.date,
        title: reminder.title
      }));

    return [...calendarEvents, ...reminderEvents]
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  if (configError) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">⚙️</span>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Configuración de Google Calendar Requerida
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Para usar la integración con Google Calendar, necesitas configurar las credenciales de API.
          </p>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mb-6 max-w-md mx-auto text-left">
            <h3 className="font-semibold text-orange-800 mb-2">⚠️ Error de configuración:</h3>
            <p className="text-sm text-orange-700">{configError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !events.length) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Nueva Cita Veterinaria</h3>
          <button
            onClick={() => setShowCreateForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mascota
            </label>
            <select
              value={formData.petId}
              onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand"
              required
            >
              <option value="">Selecciona una mascota</option>
              {petList.map(pet => (
                <option key={pet._id} value={pet._id}>
                  {pet.species === 'dog' ? '🐕' : '🐱'} {pet.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título de la cita
            </label>
            <input
              type="text"
              placeholder="Ej: Control rutinario"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Veterinario (Email - Opcional)
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={formData.veterinary}
              onChange={(e) => setFormData({ ...formData, veterinary: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas adicionales
            </label>
            <textarea
              placeholder="Agrega notas importantes sobre la cita"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand resize-none"
              rows="3"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg text-sm font-medium transition-colors duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creando...
                </>
              ) : (
                <>
                  <span>📅</span>
                  Crear Cita
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status & Create Button */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-gray-700">
              {isConnected ? 'Conectado a Google Calendar' : 'No conectado'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isConnected && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center gap-2"
              >
                <span>➕</span>
                Nueva Cita
              </button>
            )}
            <button
              onClick={isConnected ? disconnectFromGoogleCalendar : connectToGoogleCalendar}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isConnected
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-brand text-white hover:bg-brand-dark'
              }`}
              disabled={loading}
            >
              {isConnected ? 'Desconectar' : 'Conectar Calendar'}
            </button>
          </div>
        </div>
      </div>

      {isConnected && (
        <>
          {/* Events List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Próximos Eventos</h3>
              <button
                onClick={loadCalendarEvents}
                className="text-sm text-brand hover:text-brand-dark transition-colors duration-150"
                disabled={loading}
              >
                Actualizar
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
              </div>
            ) : getCombinedEvents().length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <h4 className="text-gray-800 font-medium mb-2">No hay eventos programados</h4>
                <p className="text-gray-500 text-sm mb-4">
                  Programa tu primera cita veterinaria
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 inline-flex items-center gap-2"
                >
                  <span>➕</span>
                  Nueva Cita
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {getCombinedEvents().map((event) => (
                  <EventCard
                    key={event.id || event._id}
                    event={event}
                    onReminderToggle={handleReminderToggle}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const EventCard = ({ event, onReminderToggle }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = event.type === 'reminder' && !event.completed && new Date(event.date) < new Date();

  return (
    <div className={`rounded-xl p-4 border ${
      isOverdue 
        ? 'border-red-200 bg-red-50' 
        : event.type === 'calendar' 
          ? 'border-blue-200 bg-blue-50'
          : 'border-orange-200 bg-orange-50'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          event.type === 'calendar' 
            ? 'bg-blue-500' 
            : isOverdue
              ? 'bg-red-500'
              : 'bg-orange-500'
        }`}>
          <span className="text-white text-lg">
            {event.type === 'calendar' ? '📅' : '⏰'}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 mb-1">{event.title}</h4>
          <p className="text-sm text-gray-600">
            {formatDate(event.date)}
          </p>
          
          {event.type === 'reminder' && (
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                event.priority === 'high' 
                  ? 'bg-red-100 text-red-700'
                  : event.priority === 'medium'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-700'
              }`}>
                {event.priority} prioridad
              </span>
              
              {isOverdue && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                  Vencido
                </span>
              )}
            </div>
          )}
        </div>

        {event.type === 'reminder' && (
          <button
            onClick={() => onReminderToggle(event._id)}
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors duration-150 ${
              event.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {event.completed && <span className="text-xs">✓</span>}
          </button>
        )}
      </div>
    </div>
  );
}; 