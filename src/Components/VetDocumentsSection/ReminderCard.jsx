import React from 'react';
import { toggleReminder as toggleReminderAPI } from '../../Utils/Fetch/FetchVetDocuments/FetchVetDocuments';

export const ReminderCard = ({ reminder, onComplete, onEdit, onUpdate }) => {

  const handleToggleComplete = async () => {
    try {
      const response = await toggleReminderAPI(reminder._id || reminder.id);
      if (onUpdate) {
        onUpdate(response.reminder);
      } else if (onComplete) {
        onComplete(reminder._id || reminder.id);
      }
    } catch (error) {
      console.error('Error al actualizar recordatorio:', error);
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-50 to-pink-50 border-red-100 text-red-700';
      case 'medium': return 'from-yellow-50 to-orange-50 border-yellow-100 text-orange-700';
      case 'low': return 'from-blue-50 to-indigo-50 border-blue-100 text-blue-700';
      default: return 'from-gray-50 to-slate-50 border-gray-100 text-gray-700';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'vaccine': return '💉';
      case 'checkup': return '🩺';
      case 'medication': return '💊';
      case 'grooming': return '✂️';
      case 'appointment': return '📅';
      default: return '⏰';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays < 0) return `Hace ${Math.abs(diffDays)} días`;
    if (diffDays <= 7) return `En ${diffDays} días`;
    
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = () => {
    const today = new Date();
    const reminderDate = new Date(reminder.date);
    return reminderDate < today && !reminder.completed;
  };

  const isUpcoming = () => {
    const today = new Date();
    const reminderDate = new Date(reminder.date);
    const diffDays = Math.ceil((reminderDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0 && !reminder.completed;
  };

  return (
    <div className={`bg-gradient-to-r ${getPriorityColor(reminder.priority)} border rounded-xl p-4 transition-all duration-300 hover:shadow-md ${
      reminder.completed ? 'opacity-60' : ''
    } ${isOverdue() ? 'ring-2 ring-red-200' : ''} ${isUpcoming() ? 'ring-2 ring-yellow-200' : ''}`}>
      
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {/* Icon and Priority */}
          <div className="relative">
            <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center">
              <span className="text-lg">{getTypeIcon(reminder.type)}</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <span className="text-xs">{getPriorityIcon(reminder.priority)}</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm mb-1 ${reminder.completed ? 'line-through' : ''}`}>
              {reminder.title}
            </h4>
            
            <div className="space-y-1">
              <p className="text-xs flex items-center gap-1">
                <span>📅</span>
                <span className={isOverdue() ? 'text-red-600 font-medium' : isUpcoming() ? 'text-yellow-600 font-medium' : ''}>
                  {formatDate(reminder.date)}
                </span>
              </p>
              
              {reminder.note && (
                <p className="text-xs text-gray-600 mt-2 italic">
                  {reminder.note}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col items-end gap-2">
          {/* Status indicators */}
          <div className="flex gap-1">
            {isOverdue() && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                Vencido
              </span>
            )}
            {isUpcoming() && !isOverdue() && (
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                Próximo
              </span>
            )}
            {reminder.completed && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                ✓ Completado
              </span>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-1">
                         {!reminder.completed ? (
               <>
                 <button 
                   onClick={handleToggleComplete}
                   className="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                   title="Marcar como completado"
                 >
                   <span className="text-sm">✓</span>
                 </button>
                 <button 
                   onClick={() => onEdit && onEdit(reminder._id || reminder.id)}
                   className="w-8 h-8 bg-white/60 hover:bg-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                   title="Editar recordatorio"
                 >
                   <span className="text-sm">✏️</span>
                 </button>
               </>
             ) : (
               <button 
                 onClick={handleToggleComplete}
                 className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                 title="Marcar como pendiente"
               >
                 <span className="text-sm">↺</span>
               </button>
             )}
          </div>
        </div>
      </div>
      
      {/* Progress indicator for upcoming reminders */}
      {!reminder.completed && isUpcoming() && (
        <div className="mt-3 pt-3 border-t border-white/30">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs">Tiempo restante</span>
            <span className="text-xs font-medium">
              {formatDate(reminder.date)}
            </span>
          </div>
          <div className="w-full bg-white/40 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.max(10, 100 - (Math.ceil((new Date(reminder.date) - new Date()) / (1000 * 60 * 60 * 24)) / 3) * 100)}%`
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}; 