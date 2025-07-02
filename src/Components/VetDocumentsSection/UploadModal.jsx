import React, { useState, useRef } from 'react';
import { createVetDocument } from '../../Utils/Fetch/FetchVetDocuments/FetchVetDocuments';

export const UploadModal = ({ selectedPet, onClose, onUpload }) => {
  const [documentType, setDocumentType] = useState('medical');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [nextDue, setNextDue] = useState('');
  const [veterinary, setVeterinary] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const documentTypes = [
    { id: 'medical', label: 'Examen Médico', icon: '📋', color: 'blue' },
    { id: 'vaccine', label: 'Vacuna', icon: '💉', color: 'green' },
    { id: 'passport', label: 'Pasaporte', icon: '🛂', color: 'yellow' },
    { id: 'prescription', label: 'Receta', icon: '💊', color: 'purple' },
    { id: 'lab', label: 'Laboratorio', icon: '🧪', color: 'pink' },
    { id: 'surgery', label: 'Cirugía', icon: '🏥', color: 'red' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setFileError('');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > MAX_FILE_SIZE) {
        setFileError('El archivo supera el límite de 10 MB. Selecciona uno más ligero.');
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileError('');
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        setFileError('El archivo supera el límite de 10 MB. Selecciona uno más ligero.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const documentData = {
        petId: selectedPet._id,
        type: documentType,
        title,
        date,
        nextDue: nextDue || null,
        veterinary,
        notes
      };

      const response = await createVetDocument(documentData, file);
      
      // Crear objeto para el callback con la estructura esperada
      const newDocument = {
        ...response.document,
        id: response.document._id // Para compatibilidad con el frontend
      };

      if (onUpload) {
        await onUpload(newDocument);
      }

      // Cerrar modal y resetear campos
      setTitle('');
      setDate('');
      setNextDue('');
      setVeterinary('');
      setNotes('');
      setFile(null);
      onClose();
    } catch (error) {
      console.error('Error al subir documento:', error);
      alert('Error al subir el documento. Por favor, intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const selectedTypeInfo = documentTypes.find(type => type.id === documentType);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Nuevo Documento</h2>
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
          {/* Document Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Documento
            </label>
            <div className="grid grid-cols-2 gap-2">
              {documentTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setDocumentType(type.id)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    documentType === type.id
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
              placeholder={`Ej: ${selectedTypeInfo?.label} de rutina`}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all duration-200"
              required
            />
          </div>

          {/* Date */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha del Documento *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all duration-200"
                required
              />
            </div>
            
            {/* Next Due Date (for vaccines) */}
            {documentType === 'vaccine' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Próxima Dosis
                </label>
                <input
                  type="date"
                  value={nextDue}
                  onChange={(e) => setNextDue(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all duration-200"
                />
              </div>
            )}
          </div>

          {/* Veterinary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Veterinario/Clínica
            </label>
            <input
              type="text"
              value={veterinary}
              onChange={(e) => setVeterinary(e.target.value)}
              placeholder="Nombre del veterinario o clínica"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all duration-200"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo Adjunto
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-brand bg-orange-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-green-600">📄</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-gray-400">📎</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Arrastra un archivo aquí o{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-brand hover:text-orange-600 font-medium"
                    >
                      selecciona uno
                    </button>
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF, JPG, PNG hasta 10MB
                  </p>
                </div>
              )}
              {fileError && (
                <p className="text-xs text-red-500 mt-2">{fileError}</p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas Adicionales
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observaciones, detalles importantes..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all duration-200 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
              disabled={isUploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title || !date || isUploading || fileError}
              className="flex-1 px-4 py-3 bg-brand text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                'Guardar Documento'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 