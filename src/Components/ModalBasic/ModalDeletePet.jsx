import React from 'react';
import { AiOutlineWarning, AiOutlineClose } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

export const ModalDeletePet = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    petName, 
    isLoading 
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            {/* Fondo borroso */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-in fade-in-0 zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <AiOutlineWarning className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Eliminar Mascota
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        disabled={isLoading}
                    >
                        <AiOutlineClose className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                            <MdDelete className="h-8 w-8 text-red-600" />
                        </div>
                        <p className="text-gray-700 mb-2">
                            ¿Estás seguro de que deseas eliminar a{' '}
                            <span className="font-semibold text-gray-900">
                                {petName}
                            </span>?
                        </p>
                        <p className="text-sm text-gray-500">
                            Esta acción no se puede deshacer. Se eliminarán todas las fotos y datos asociados.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row gap-3 p-6 pt-0">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-600 border border-transparent rounded-xl shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Eliminando...</span>
                            </>
                        ) : (
                            <>
                                <MdDelete className="w-4 h-4" />
                                <span>Eliminar</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}; 