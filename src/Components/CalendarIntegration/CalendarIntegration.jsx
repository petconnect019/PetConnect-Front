import React, { useState, useEffect, useCallback } from 'react';
import { GoogleCalendarAPI } from '../../Utils/GoogleCalendar/GoogleCalendarAPI';
import { usePet } from '../../Contexts/PetContext/PetContext';
import { useHasPetsUser } from '../../Contexts/HasPetsUser/HasPetsUser';
import { useFetchPets } from '../../Hooks/useFetchPets/useFetchPets';
import { useVetDocuments } from '../../Utils/Fetch/FetchVetDocuments/FetchVetDocuments';

export const CalendarIntegration = () => {
  // Obtener mascotas del context
  const { petList } = usePet();
  const { hasPetsUser } = useHasPetsUser();
  
  // Cargar mascotas si es necesario
  useFetchPets(hasPetsUser);
  
  // Estados principales
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [configError, setConfigError] = useState(null);
  const [activeView, setActiveView] = useState('overview'); // overview, create
  const [error, setError] = useState(null);
  
  // Hook para gestionar recordatorios del backend
  const { getReminders, toggleReminder, loading: remindersLoading } = useVetDocuments();

  // Memoizar la función de verificación de conexión
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

  // Efecto para verificar la conexión al montar y cuando cambie petList
  useEffect(() => {
    checkGoogleCalendarConnection();
  }, [checkGoogleCalendarConnection]);

  // Efecto para manejar la selección automática de mascota
  useEffect(() => {
    if (petList && petList.length > 0 && !selectedPet) {
      setSelectedPet(petList[0]);
    } else if (!petList || petList.length === 0) {
      setSelectedPet(null);
    }
  }, [petList, selectedPet]);

  // Cargar recordatorios cuando cambie la mascota seleccionada
  useEffect(() => {
    const loadReminders = async () => {
      if (selectedPet) {
        try {
          const remindersData = await getReminders(selectedPet._id);
          setReminders(remindersData || []);
        } catch (error) {
          console.error('Error al cargar recordatorios:', error);
          setReminders([]);
        }
      }
    };

    loadReminders();
  }, [selectedPet]);

  // Log para debugging
  useEffect(() => {
    console.log('CalendarIntegration montado - hasPetsUser:', hasPetsUser);
    console.log('CalendarIntegration montado - petList:', petList);
  }, []);

  const loadCalendarEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Cargando eventos del calendario...');
      const calendarEvents = await GoogleCalendarAPI.getEvents();
      console.log('Eventos cargados:', calendarEvents);
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
      console.log('Iniciando proceso de autenticación...');
      await GoogleCalendarAPI.authenticate();
      
      // Verificar que realmente estamos conectados
      const connected = await GoogleCalendarAPI.isConnected();
      setIsConnected(connected);
      setConfigError(null);
      
      if (connected) {
        console.log('Conectado exitosamente, cargando eventos...');
        await loadCalendarEvents();
        alert('¡Conectado exitosamente a Google Calendar!');
      } else {
        throw new Error('Falló la verificación de conexión después de autenticar');
      }
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      if (error.message.includes('VITE_GOOGLE')) {
        setConfigError(error.message);
      } else {
        alert(`Error al conectar con Google Calendar: ${error.message}`);
      }
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

  const createVetAppointment = async (appointmentData) => {
    setLoading(true);
    try {
      console.log('Creando cita veterinaria...', appointmentData);
      console.log('Mascota seleccionada:', selectedPet);
      
      // Verificar que estamos autenticados
      if (!isConnected) {
        throw new Error('No estás conectado a Google Calendar. Por favor conecta primero.');
      }

      // Verificar que hay una mascota seleccionada
      if (!selectedPet || !selectedPet.name) {
        throw new Error('Por favor selecciona una mascota antes de crear la cita.');
      }

      const petName = selectedPet.name;
      const petIcon = selectedPet.species === 'dog' ? '🐕' : '🐱';

      // Asegurar formato correcto de fecha/hora
      const startDateTime = new Date(appointmentData.datetime);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hora

      // Verificar que las fechas son válidas
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error('Fecha/hora inválida. Por favor verifica la fecha seleccionada.');
      }

      const event = {
        summary: `${petIcon} ${appointmentData.title} - ${petName}`,
        description: `Cita veterinaria para ${petName}\n\nTipo: ${appointmentData.title}\nNotas: ${appointmentData.notes || 'Sin notas adicionales'}\n\nCreado desde Pet Connect`,
        start: {
          dateTime: startDateTime.toISOString(),
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
        location: appointmentData.location || '',
        colorId: '3' // Color verde para eventos de mascotas
      };

      // Agregar veterinario si se proporcionó
      if (appointmentData.veterinary && appointmentData.veterinary.trim()) {
        event.attendees = [{ 
          email: appointmentData.veterinary.trim(),
          responseStatus: 'needsAction'
        }];
      }

      console.log('Evento a crear:', JSON.stringify(event, null, 2));

      const createdEvent = await GoogleCalendarAPI.createEvent(event);
      console.log('Evento creado exitosamente:', createdEvent);
      
      // Recargar eventos y recordatorios
      await loadCalendarEvents();
      setActiveView('overview');
      alert('¡Cita creada exitosamente en Google Calendar!');
    } catch (error) {
      console.error('Error creating calendar event:', error);
      let errorMessage = 'Error desconocido al crear la cita.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.result?.error?.message) {
        errorMessage = error.result.error.message;
      } else if (error.body) {
        try {
          const errorBody = JSON.parse(error.body);
          errorMessage = errorBody.error?.message || errorMessage;
        } catch (e) {
          // Si no se puede parsear el error, usar el mensaje por defecto
        }
      }
      
      alert(`Error al crear la cita: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar error de configuración si las credenciales no están configuradas
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
            <p className="text-sm text-orange-700 mb-3">{configError}</p>
            
            <div className="text-sm text-orange-700 space-y-2">
              <p className="font-medium">Pasos para solucionarlo:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Ve a <a href="https://console.cloud.google.com/" target="_blank" className="underline">Google Cloud Console</a></li>
                <li>Habilita la Google Calendar API</li>
                <li>Crea credenciales OAuth 2.0 y API Key</li>
                <li>Configura las variables en el archivo .env</li>
                <li>Reinicia el servidor de desarrollo</li>
              </ol>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 mb-6 max-w-md mx-auto">
            <h4 className="font-semibold text-gray-800 mb-2">Agrega a tu archivo .env:</h4>
            <div className="text-left text-xs font-mono bg-white p-3 rounded border">
              <div className="text-green-600"># Google Calendar Integration</div>
              <div>VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui</div>
              <div>VITE_GOOGLE_API_KEY=tu_api_key_aqui</div>
            </div>
          </div>

          <button
            onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-150 flex items-center gap-2 mx-auto"
          >
            <span>🔗</span>
            Abrir Google Cloud Console
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Consulta la documentación en GOOGLE_CALENDAR_SETUP.md para instrucciones detalladas
          </p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">📅</span>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Conecta con Google Calendar
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Sincroniza los recordatorios veterinarios de {selectedPet?.name || 'tus mascotas'} con tu calendario personal y recibe notificaciones automáticas.
          </p>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6 max-w-md mx-auto">
            <h3 className="font-semibold text-green-800 mb-2">¿Qué puedes hacer?</h3>
            <ul className="text-sm text-green-700 text-left space-y-1">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Programar citas veterinarias
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Recordatorios de vacunas automáticos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Notificaciones por email y móvil
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Compartir con familiares
              </li>
            </ul>
          </div>

          <button
            onClick={connectToGoogleCalendar}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Conectando...
              </>
            ) : (
              <>
                <span>🔗</span>
                Conectar con Google Calendar
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Utilizamos una conexión segura. Tus datos están protegidos.
          </p>
        </div>
      </div>
    );
  }

  const handleReminderToggle = async (reminderId) => {
    try {
      await toggleReminder(reminderId);
      // Recargar recordatorios
      if (selectedPet) {
        const remindersData = await getReminders(selectedPet._id);
        setReminders(remindersData || []);
      }
    } catch (error) {
      console.error('Error al actualizar recordatorio:', error);
    }
  };

  // Combinar y ordenar eventos y recordatorios
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
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5); // Mostrar solo los próximos 5
  };

  const getStats = () => {
    const now = new Date();
    const upcomingEvents = events.filter(event => 
      new Date(event.start?.dateTime || event.start?.date) > now
    ).length;

    const pendingReminders = reminders.filter(reminder => 
      !reminder.completed && new Date(reminder.date) > now
    ).length;

    const overdueReminders = reminders.filter(reminder => 
      !reminder.completed && new Date(reminder.date) < now
    ).length;

    return [
      {
        icon: "📅",
        value: upcomingEvents + pendingReminders,
        label: "Total Eventos",
        color: "blue"
      },
      {
        icon: "🗓️",
        value: upcomingEvents,
        label: "Citas Calendar",
        color: "green"
      },
      {
        icon: "⏰",
        value: pendingReminders,
        label: "Recordatorios",
        color: "orange"
      },
      {
        icon: "🚨",
        value: overdueReminders,
        label: "Vencidos",
        color: "red"
      }
    ];
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
        </div>
      ) : (
        <>
          {activeView === 'overview' ? (
            <CalendarOverview
              stats={stats}
              combinedEvents={getCombinedEvents()}
              onRefresh={loadCalendarEvents}
              onReminderToggle={handleReminderToggle}
              loading={loading}
              isConnected={isConnected}
              onConnect={connectToGoogleCalendar}
              onDisconnect={disconnectFromGoogleCalendar}
              error={error}
            />
          ) : (
            <CreateAppointmentForm
              selectedPet={selectedPet}
              onCreateAppointment={createVetAppointment}
              loading={loading}
              onCancel={() => setActiveView('overview')}
            />
          )}
        </>
      )}
    </div>
  );
};

// Componente para crear citas rápidas
const CreateAppointmentForm = ({ selectedPet, onCreateAppointment, loading, onCancel }) => {
  console.log('CreateAppointmentForm - selectedPet:', selectedPet);
  const [formData, setFormData] = useState({
    title: '',
    datetime: '',
    veterinary: '',
    notes: ''
  });

  const appointmentTypes = [
    { id: 'checkup', label: 'Chequeo General', icon: '🩺' },
    { id: 'vaccine', label: 'Vacunación', icon: '💉' },
    { id: 'surgery', label: 'Cirugía', icon: '⚕️' },
    { id: 'dental', label: 'Limpieza Dental', icon: '🦷' },
    { id: 'emergency', label: 'Emergencia', icon: '🚨' },
    { id: 'grooming', label: 'Estética', icon: '✂️' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones mejoradas
    if (!selectedPet || !selectedPet.name) {
      alert('Error: No hay mascota seleccionada. Por favor selecciona una mascota.');
      return;
    }
    
    if (!formData.title || !formData.datetime) {
      alert('Por favor completa los campos requeridos (tipo de cita y fecha/hora)');
      return;
    }
    
    console.log('Enviando cita:', { formData, selectedPet });
    onCreateAppointment(formData);
    setFormData({ title: '', datetime: '', veterinary: '', notes: '' });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>📅</span>
        Programar Cita para {selectedPet?.name || 'mascota'}
      </h3>
      
      {/* Debug info - remover en producción */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
          Debug: selectedPet = {selectedPet ? `${selectedPet.name} (${selectedPet.species})` : 'null/undefined'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de cita */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de cita
          </label>
          <div className="grid grid-cols-2 gap-2">
            {appointmentTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData({ ...formData, title: type.label })}
                className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                  formData.title === type.label
                    ? 'border-brand bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{type.icon}</span>
                  <span className="text-sm font-medium">{type.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Fecha y hora */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha y hora *
          </label>
          <input
            type="datetime-local"
            value={formData.datetime}
            onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all duration-200"
            required
          />
        </div>

        {/* Veterinario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email del veterinario (opcional)
          </label>
          <input
            type="email"
            value={formData.veterinary}
            onChange={(e) => setFormData({ ...formData, veterinary: e.target.value })}
            placeholder="doctor@clinica.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all duration-200"
          />
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas adicionales
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Información adicional sobre la cita..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-colors duration-150 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors duration-150"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !formData.title || !formData.datetime}
            className="flex-1 bg-brand hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creando cita...
              </>
            ) : (
              <>
                <span>📅</span>
                Crear Cita en Calendar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Componente de resumen del calendario
const CalendarOverview = ({
  stats,
  combinedEvents,
  onRefresh,
  onReminderToggle,
  loading,
  isConnected,
  onConnect,
  onDisconnect,
  error
}) => {
  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-gray-700">
              {isConnected ? 'Conectado a Google Calendar' : 'No conectado'}
            </span>
          </div>
          <button
            onClick={isConnected ? onDisconnect : onConnect}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ${
              isConnected
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-brand text-white hover:bg-brand-dark'
            }`}
            disabled={loading}
          >
            {isConnected ? 'Desconectar' : 'Conectar'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Events List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Próximos Eventos</h3>
          <button
            onClick={onRefresh}
            className="text-sm text-brand hover:text-brand-dark transition-colors duration-150"
            disabled={loading}
          >
            Actualizar
          </button>
        </div>

        {combinedEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay eventos programados
          </div>
        ) : (
          <div className="space-y-4">
            {combinedEvents.map((event) => (
              <CombinedEventCard
                key={event.id || event._id}
                event={event}
                onReminderToggle={onReminderToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de tarjeta de evento combinado
const CombinedEventCard = ({ event, onReminderToggle }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays < 0) return `Hace ${Math.abs(diffDays)} días`;
    return `En ${diffDays} días`;
  };

  const isOverdue = event.type === 'reminder' && !event.completed && new Date(event.date) < new Date();

  return (
    <div className={`rounded-xl p-4 border transition-colors duration-150 ${
      isOverdue 
        ? 'border-red-200 bg-red-50' 
        : event.type === 'calendar' 
          ? 'border-blue-200 bg-blue-50'
          : 'border-orange-200 bg-orange-50'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          event.type === 'calendar' 
            ? 'bg-blue-500 text-white' 
            : isOverdue
              ? 'bg-red-500 text-white'
              : 'bg-orange-500 text-white'
        }`}>
          <span className="text-sm">
            {event.type === 'calendar' ? '📅' : '⏰'}
          </span>
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-sm">{event.title}</h4>
          <p className="text-xs text-gray-600 mb-1">
            {formatDate(event.date)} • {new Date(event.date).toLocaleTimeString('es-CO', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
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

// Componente de tarjeta de estadística
const StatCard = ({ icon, value, label, color }) => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}>
          <span className="text-white text-sm">{icon}</span>
        </div>
        <div>
          <div className="text-xl font-bold text-gray-800">{value}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar próximos eventos (LEGACY - mantener por compatibilidad)
const UpcomingEvents = ({ events, onRefresh }) => {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <CombinedEventCard
          key={event.id}
          event={event}
          onReminderToggle={() => {}}
        />
      ))}
    </div>
  );
}; 