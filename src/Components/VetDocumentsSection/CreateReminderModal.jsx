import React, { useState } from 'react';

export const CreateReminderModal = ({ selectedPet, onClose, onCreate }) => {
  const [reminderType, setReminderType] = useState('appointment');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isCreating, setIsCreating] = useState(false);

  const reminderTypes = [
    { id: 'vaccine', label: 'Vacuna', icon: '💉', color: 'green' },
    { id: 'checkup', label: 'Revisión', icon: '🩺', color: 'blue' },
    { id: 'medication', label: 'Medicamento', icon: '💊', color: 'purple' },
    { id: 'grooming', label: 'Estética', icon: '✂️', color: 'pink' },
    { id: 'appointment', label: 'Cita', icon: '📅', color: 'orange' },
    { id: 'other', label: 'Otro', icon: '📝', color: 'gray' }
  ];

  const priorities = [
    { id: 'low', label: 'Baja', color: 'blue', icon: '🔵' },
    { id: 'medium', label: 'Media', color: 'yellow', icon: '🟡' },
    { id: 'high', label: 'Alta', color: 'red', icon: '🔴' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Simular creación del recordatorio
      // Aquí deberías llamar a la API real
      const newReminder = {
        _id: Date.now().toString(),
        petId: selectedPet._id,
        type: reminderType,
        title,
        description,
        date,
        priority,
        completed: false,
        createdAt: new Date().toISOString()
      };

      onCreate(newReminder);
    } catch (error) {
      console.error('Error al crear recordatorio:', error);
      alert('Error al crear el recordatorio. Por favor, intenta de nuevo.');
    } finally {
      setIsCreating(false);
    }
  };

  const selectedTypeInfo = reminderTypes.find(type => type.id === reminderType);
  const selectedPriorityInfo = priorities.find(p => p.id === priority);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Nuevo Recordatorio</h2>
              <p className="text-sm text-gray-500 mt-1">
                Para {selectedPet?.name}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200"
            >
              <span className="text-gray-500">✕</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Reminder Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Recordatorio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {reminderTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setReminderType(type.id)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    reminderType === type.id
                      ? 'border-brand bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-lg block mb-1">{type.icon}</span>
                    <span className="text-xs font-medium text-gray-700">
                      {type.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Ej: ${selectedTypeInfo?.label} de ${selectedPet?.name}`}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all duration-200"
              required
            />
          </div>

          {/* Date and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all duration-200"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all duration-200"
              >
                {priorities.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.icon} {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles adicionales sobre este recordatorio..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all duration-200 resize-none"
            />
          </div>

          {/* Preview Card */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Vista previa:</h4>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-lg">{selectedTypeInfo?.icon}</span>
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-800">
                  {title || 'Título del recordatorio'}
                </h5>
                <p className="text-sm text-gray-600">
                  {date ? new Date(date).toLocaleDateString('es-ES') : 'Fecha por definir'}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs">{selectedPriorityInfo?.icon}</span>
                  <span className="text-xs text-gray-500">
                    Prioridad {selectedPriorityInfo?.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
              disabled={isCreating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title || !date || isCreating}
              className="flex-1 px-4 py-3 bg-brand text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creando...
                </>
              ) : (
                'Crear Recordatorio'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 