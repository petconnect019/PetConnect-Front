import { useState, useEffect, useRef } from 'react';
import tag from '../../assets/images/tag.png';
import { MoreVertical, AlertTriangle } from 'lucide-react';

export const ImageTagContainer = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);
  const menuButtonRef = useRef(null);

  const handleDelete = () => {
    //se hace el fetch de eliminacion de qr
    console.log("eliminando...");
    setShowModal(false);
  };

  const handleDeleteClick = () => {
    setShowDropdown(false);
    setTimeout(() => {
      setShowModal(true);
    }, 50);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        menuButtonRef.current && 
        !menuButtonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center bg-gray-50 border-none rounded-lg shadow-lg p-4">
      {/* Three dots menu */}
      <div className="absolute top-2 right-2 z-10">
        <button 
          ref={menuButtonRef}
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Opciones"
        >
          <MoreVertical size={20} className="text-gray-600" />
        </button>
        
        {/* Dropdown menu */}
        {showDropdown && (
          <div 
            ref={dropdownRef}
            className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200"
          >
            <button
              onClick={handleDeleteClick}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Image container */}
      <div className="flex items-center justify-center w-full h-full">
        <img 
          src={tag} 
          alt={'tag'} 
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-200/30 backdrop-blur-md">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle size={24} className="text-amber-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Confirmar eliminación</h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro que deseas eliminar este QR? Una vez eliminado no podrás volver a utilizarlo.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};