import React, { useState, useEffect } from 'react';
import { GoogleCalendarAPI } from '../../Utils/GoogleCalendar/GoogleCalendarAPI';
import { usePet } from '../../Contexts/PetContext/PetContext';
import { useHasPetsUser } from '../../Contexts/HasPetsUser/HasPetsUser';
import { useFetchPets } from '../../Hooks/useFetchPets/useFetchPets';

export const CalendarIntegration = () => {
  // Obtener mascotas del context
  const { petList } = usePet();
  const { hasPetsUser } = useHasPetsUser();
  
  // Cargar mascotas si es necesario
  useFetchPets(hasPetsUser);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [configError, setConfigError] = useState(null);

  useEffect(() => {
    console.log('PetList actualizado:', petList);
    if (petList && petList.length > 0) {
      setSelectedPet(petList[0]);
      console.log('Mascota seleccionada automáticamente:', petList[0]);
    } else {
      console.log('No hay mascotas disponibles:', petList);
      setSelectedPet(null);
    }
    checkGoogleCalendarConnection();
  }, [petList]);

  // Log para debugging
  useEffect(() => {
    console.log('CalendarIntegration montado - hasPetsUser:', hasPetsUser);
    console.log('CalendarIntegration montado - petList:', petList);
  }, []);

  const checkGoogleCalendarConnection = async () => {
    try {
      const connected = await GoogleCalendarAPI.isConnected();
      setIsConnected(connected);
      setConfigError(null);
      
      if (connected) {
        loadCalendarEvents();
      }
    } catch (error) {
      console.error('Error checking calendar connection:', error);
      setConfigError(error.message);
      setIsConnected(false);
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

  const loadCalendarEvents = async () => {
    try {
      console.log('Cargando eventos del calendario...');
      const calendarEvents = await GoogleCalendarAPI.getEvents();
      console.log('Eventos cargados:', calendarEvents);
      setEvents(calendarEvents || []);
    } catch (error) {
      console.error('Error loading calendar events:', error);
      setEvents([]);
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

      const event = {
        summary: `${petIcon} ${appointmentData.title} - ${petName}`,
        description: `Cita veterinaria para ${petName}\n\nTipo: ${appointmentData.title}\nNotas: ${appointmentData.notes || 'Sin notas adicionales'}`,
        start: {
          dateTime: appointmentData.datetime,
          timeZone: 'America/Bogota'
        },
        end: {
          dateTime: new Date(new Date(appointmentData.datetime).getTime() + 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Bogota'
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 día antes
            { method: 'popup', minutes: 60 }, // 1 hora antes
            { method: 'popup', minutes: 15 } // 15 minutos antes
          ]
        }
      };

      // Agregar veterinario si se proporcionó
      if (appointmentData.veterinary) {
        event.attendees = [{ email: appointmentData.veterinary }];
      }

      const createdEvent = await GoogleCalendarAPI.createEvent(event);
      console.log('Evento creado:', createdEvent);
      
      // Recargar eventos
      await loadCalendarEvents();
      alert('¡Cita creada exitosamente en Google Calendar!');
    } catch (error) {
      console.error('Error creating calendar event:', error);
      alert(`Error al crear la cita: ${error.message}`);
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg flex items-center gap-2 mx-auto"
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
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

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Google Calendar Conectado</h3>
              <p className="text-sm text-gray-500">Sincronización activa</p>
            </div>
          </div>
          <button
            onClick={disconnectFromGoogleCalendar}
            className="text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
          >
            Desconectar
          </button>
        </div>
      </div>

      {/* Pet Selector - Mostrar siempre si hay mascotas */}
      {petList && petList.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">
            {petList.length > 1 ? 'Selecciona una mascota' : 'Mascota seleccionada'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {petList.map((pet) => (
              <button
                key={pet._id}
                onClick={() => setSelectedPet(pet)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  selectedPet?._id === pet._id
                    ? 'bg-brand text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  {pet.species === 'dog' ? '🐕' : '🐱'}
                </div>
                <span className="font-medium">{pet.name}</span>
              </button>
            ))}
          </div>
          
          {/* Info de debugging */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
              Total mascotas: {petList.length} | Seleccionada: {selectedPet?.name || 'ninguna'}
            </div>
          )}
        </div>
      )}

      {/* Mensaje si no hay mascotas */}
      {(!petList || petList.length === 0) && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🐕</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">No hay mascotas registradas</h3>
            <p className="text-gray-500 text-sm mb-4">
              Agrega una mascota para poder programar citas veterinarias
            </p>
            <button
              onClick={() => window.location.href = '/new-pet1'}
              className="bg-brand hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            >
              Agregar Mascota
            </button>
          </div>
        </div>
      )}

      {/* Quick Create Appointment */}
      <CreateAppointmentForm 
        selectedPet={selectedPet}
        onCreateAppointment={createVetAppointment}
        loading={loading}
      />

      {/* Upcoming Events */}
      <UpcomingEvents events={events} onRefresh={loadCalendarEvents} />
    </div>
  );
};

// Componente para crear citas rápidas
const CreateAppointmentForm = ({ selectedPet, onCreateAppointment, loading }) => {
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
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all duration-200 resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.title || !formData.datetime}
          className="w-full bg-brand hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
      </form>
    </div>
  );
};

// Componente para mostrar próximos eventos
const UpcomingEvents = ({ events, onRefresh }) => {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Próximas Citas</h3>
          <button
            onClick={onRefresh}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            🔄 Actualizar
          </button>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-gray-500">No hay citas programadas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Próximas Citas</h3>
        <button
          onClick={onRefresh}
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          🔄 Actualizar
        </button>
      </div>
      <div className="space-y-3">
        {events.slice(0, 5).map((event, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📅</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{event.summary}</h4>
              <p className="text-sm text-gray-500">
                {new Date(event.start.dateTime || event.start.date).toLocaleDateString('es-CO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: event.start.dateTime ? '2-digit' : undefined,
                  minute: event.start.dateTime ? '2-digit' : undefined
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 